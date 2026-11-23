import {
  ActionCommitment,
  ComBPrimaryResult,
  FollowUpStatus,
  PilotMetricsStore,
} from '../types/entreNos';

const COMMITMENTS_KEY = 'entrenos_comb_commitments_v1';
const METRICS_KEY = 'entrenos_pilot_metrics_v1';

const DEFAULT_METRICS: PilotMetricsStore = {
  consentGiven: false,
  consentUpdatedAt: null,
  experiencesCompleted: 0,
  barrierCounts: {
    motivation: 0,
    capability: 0,
    opportunity: 0,
    combined: 0,
  },
  intentionShifts: 0,
  controlsConsultedIds: [],
  commercialLinkClicks: 0,
  commitmentsDefined: 0,
  progressDeclaredCount: 0,
  technicallyVerifiedCount: 0,
};

export function loadCommitments(): ActionCommitment[] {
  try {
    const raw = localStorage.getItem(COMMITMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCommitment(commitment: ActionCommitment): ActionCommitment[] {
  const existing = loadCommitments().filter((c) => c.id !== commitment.id);
  const updated = [commitment, ...existing];
  try {
    localStorage.setItem(COMMITMENTS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors silently
  }
  return updated;
}

export function updateCommitmentFollowUp(
  commitmentId: string,
  status: FollowUpStatus,
  note?: string
): ActionCommitment[] {
  const existing = loadCommitments();
  const prevItem = existing.find((c) => c.id === commitmentId);
  const updated = existing.map((c) =>
    c.id === commitmentId
      ? {
          ...c,
          followUpStatus: status,
          followUpUpdatedAt: new Date().toISOString(),
          followUpNote: note ?? c.followUpNote,
        }
      : c
  );

  try {
    localStorage.setItem(COMMITMENTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Actualizar indicadores piloto solo si existe consentimiento y hubo avance real
  const metrics = loadPilotMetrics();
  if (metrics.consentGiven && prevItem && prevItem.followUpStatus !== status) {
    if (status !== 'not_started') {
      metrics.progressDeclaredCount += 1;
    }
    if (status === 'technically_verified' && prevItem.followUpStatus !== 'technically_verified') {
      metrics.technicallyVerifiedCount += 1;
    }
    savePilotMetrics(metrics);
  }

  return updated;
}

export function loadPilotMetrics(): PilotMetricsStore {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    if (!raw) return { ...DEFAULT_METRICS, barrierCounts: { ...DEFAULT_METRICS.barrierCounts } };
    const parsed = JSON.parse(raw) as Partial<PilotMetricsStore>;
    return {
      ...DEFAULT_METRICS,
      ...parsed,
      barrierCounts: {
        ...DEFAULT_METRICS.barrierCounts,
        ...(parsed.barrierCounts ?? {}),
      },
      controlsConsultedIds: Array.isArray(parsed.controlsConsultedIds)
        ? parsed.controlsConsultedIds
        : [],
    };
  } catch {
    return { ...DEFAULT_METRICS, barrierCounts: { ...DEFAULT_METRICS.barrierCounts } };
  }
}

export function savePilotMetrics(metrics: PilotMetricsStore): void {
  try {
    localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
  } catch {
    // ignore
  }
}

export function setPilotConsent(consent: boolean): PilotMetricsStore {
  const current = loadPilotMetrics();
  const updated: PilotMetricsStore = {
    ...current,
    consentGiven: consent,
    consentUpdatedAt: new Date().toISOString(),
  };
  savePilotMetrics(updated);
  return updated;
}

export function recordMetricEvent(
  event:
    | { type: 'experience_completed'; barrier: ComBPrimaryResult }
    | { type: 'control_consulted'; controlId: string }
    | { type: 'commercial_click' }
    | { type: 'commitment_defined'; intentionShifted: boolean }
): PilotMetricsStore {
  const current = loadPilotMetrics();
  if (!current.consentGiven) return current;

  if (event.type === 'experience_completed') {
    current.experiencesCompleted += 1;
    current.barrierCounts[event.barrier] = (current.barrierCounts[event.barrier] ?? 0) + 1;
  } else if (event.type === 'control_consulted') {
    if (!current.controlsConsultedIds.includes(event.controlId)) {
      current.controlsConsultedIds = [...current.controlsConsultedIds, event.controlId];
    }
  } else if (event.type === 'commercial_click') {
    current.commercialLinkClicks += 1;
  } else if (event.type === 'commitment_defined') {
    current.commitmentsDefined += 1;
    if (event.intentionShifted) {
      current.intentionShifts += 1;
    }
  }

  savePilotMetrics(current);
  return current;
}

export function resetPilotMetrics(): PilotMetricsStore {
  const fresh: PilotMetricsStore = {
    ...DEFAULT_METRICS,
    barrierCounts: { ...DEFAULT_METRICS.barrierCounts },
  };
  savePilotMetrics(fresh);
  return fresh;
}

export function buildCalendarReminder(commitment: ActionCommitment): {
  googleCalendarUrl: string;
  icsDataUri: string;
  icsFilename: string;
} {
  const dateStr = (commitment.targetDate || new Date().toISOString().slice(0, 10)).replace(/-/g, '');
  const title = `ENTRE NOS: ${commitment.firstStep} (${commitment.selectedControl.name})`;
  const details = [
    `Empresa: ${commitment.companyName || 'Mi empresa'}`,
    `Responsable: ${commitment.responsiblePerson}`,
    `Primer paso: ${commitment.firstStep}`,
    `Control explorado: ${commitment.selectedControl.name}`,
    'Recordatorio voluntario generado en ENTRE NOS — La confianza también nos protege.',
  ].join('\n');

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${dateStr}T090000/${dateStr}T093000&details=${encodeURIComponent(details)}`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ENTRE NOS//Ruta COM-B//ES',
    'BEGIN:VEVENT',
    `UID:${commitment.id}@entrenos.local`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${dateStr}T090000`,
    `DTEND:${dateStr}T093000`,
    `SUMMARY:${title.replace(/[\r\n]/g, ' ')}`,
    `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const icsDataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsLines)}`;
  const icsFilename = `recordatorio-entre-nos-${dateStr}.ics`;

  return { googleCalendarUrl, icsDataUri, icsFilename };
}
