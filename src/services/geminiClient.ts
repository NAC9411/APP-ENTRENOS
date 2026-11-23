import {
  BusinessContext,
  ComBAssessment,
  ContextualQuestion,
  PhysicalControlItem,
} from '../types/entreNos';

interface ApiResponse<T> {
  fallback: boolean;
  result?: T;
  message?: string;
}

async function callGeminiEndpoint<T>(action: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
  const endpoints = ['/.netlify/functions/gemini', '/api/gemini'];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      });
      if (!res.ok) continue;
      const json = (await res.json()) as ApiResponse<T>;
      return json;
    } catch {
      // Intenta el siguiente endpoint o activa respaldo local
    }
  }
  return { fallback: true, message: 'Usando respaldo local.' };
}

export interface SectorAnalysisResult {
  sectorLabel: string;
  mainRiskSummary: string;
  possibleSevereHazard: boolean;
  severeWarningNote: string;
  contextualQuestions: ContextualQuestion[];
  suggestedControls: PhysicalControlItem[];
}

export async function analyzeCustomSectorWithAi(
  sectorName: string,
  processDescription: string
): Promise<{ usedAi: boolean; analysis: SectorAnalysisResult }> {
  interface RawAiSector {
    sectorLabel?: string;
    mainRiskSummary?: string;
    possibleSevereHazard?: boolean;
    severeWarningNote?: string;
    contextualQuestions?: { id?: string; component?: string; prompt?: string }[];
    suggestedControls?: {
      name?: string;
      hazardReduced?: string;
      howItWorks?: string;
      suitableProcesses?: string;
      verifyBeforeBuying?: string;
      searchTerms?: string[];
    }[];
  }

  const res = await callGeminiEndpoint<RawAiSector>('analyze_sector', {
    sectorName,
    processDescription,
  });

  if (!res.fallback && res.result && res.result.mainRiskSummary) {
    const raw = res.result;
    const mappedControls: PhysicalControlItem[] = (raw.suggestedControls ?? []).map((c, idx) => ({
      id: `ai_ctrl_${idx + 1}`,
      name: c.name || 'Control físico preventivo sugerido',
      category: 'Sugerencia orientada por actividad',
      sectorIds: ['custom'],
      hazardReduced: c.hazardReduced || raw.mainRiskSummary || 'Exposición física operativa.',
      howItWorks: c.howItWorks || 'Genera una barrera física o aislamiento entre la persona y la fuente de riesgo.',
      suitableProcesses: c.suitableProcesses || processDescription || sectorName,
      verifyBeforeBuying:
        c.verifyBeforeBuying ||
        'Confirmar medidas exactas del equipo, capacidad eléctrica/mecánica y evaluación técnica antes de instalar.',
      technicalChecks: [
        c.verifyBeforeBuying || 'Validar compatibilidad física con tu máquina o puesto de trabajo.',
        'Confirmar quién realizará la instalación segura y prueba inicial.',
      ],
      supplierSearchTerms:
        c.searchTerms && c.searchTerms.length > 0
          ? c.searchTerms
          : [`${c.name || 'proteccion seguridad industrial'} ${sectorName}`],
      isAiSuggested: true,
    }));

    return {
      usedAi: true,
      analysis: {
        sectorLabel: raw.sectorLabel || sectorName,
        mainRiskSummary: raw.mainRiskSummary || `Exposición operativa asociada a ${processDescription || sectorName}.`,
        possibleSevereHazard: Boolean(raw.possibleSevereHazard),
        severeWarningNote:
          raw.severeWarningNote ||
          'Si existen partes móviles expuestas, altura sin protección o energía viva, evita la exposición hasta contar con revisión técnica.',
        contextualQuestions: (raw.contextualQuestions ?? []).slice(0, 2).map((q, i) => ({
          id: q.id || `ctx_${i + 1}`,
          component: q.component || 'context',
          prompt: q.prompt || '¿Qué condición del puesto dificulta hoy implementar una barrera física?',
        })),
        suggestedControls: mappedControls,
      },
    };
  }

  // Respaldo determinista local si la IA no está disponible
  const lower = `${sectorName} ${processDescription}`.toLowerCase();
  const severeHints = /(sierra|prensa|cuchilla|altura|andamio|techo|tablero|alta tension|soldadura|torno|molino|caldera|quimico|gas)/.test(
    lower
  );

  return {
    usedAi: false,
    analysis: {
      sectorLabel: sectorName || 'Actividad económica personalizada',
      mainRiskSummary: `Exposición operativa asociada a ${processDescription || sectorName || 'tu proceso diario'}, donde una barrera física adecuada ayuda a reducir accidentes sin frenar el oficio.`,
      possibleSevereHazard: severeHints,
      severeWarningNote: severeHints
        ? 'Tu descripción menciona equipos o condiciones que pueden representar peligro grave o inminente. Evita la exposición directa y solicita valoración técnica competente antes de operar.'
        : '',
      contextualQuestions: [
        {
          id: 'ctx_1',
          component: 'capability',
          prompt: `En "${processDescription || sectorName}", ¿tienen identificado en qué punto exacto se requiere una barrera física o resguardo?`,
        },
        {
          id: 'ctx_2',
          component: 'opportunity',
          prompt: '¿El horario de trabajo o el espacio disponible en el local dificultan instalar una mejora?',
        },
      ],
      suggestedControls: [
        {
          id: 'fallback_ai_1',
          name: 'Resguardo físico perimetral o cubierta de protección en punto de operación',
          category: 'Barrera física preventiva',
          sectorIds: ['custom'],
          hazardReduced: `Contacto accidental durante ${processDescription || 'la tarea principal'}.`,
          howItWorks:
            'Interpone una barrera fija o abatible entre la zona de peligro (corte, atrapamiento o proyección) y las manos del trabajador.',
          suitableProcesses: processDescription || sectorName,
          verifyBeforeBuying:
            'Medidas exactas del equipo o estación de trabajo y espacio necesario para alimentación segura de material.',
          technicalChecks: [
            'Medir la zona de acceso antes de fabricar o comprar la guarda.',
            'Verificar con un técnico que no genere nuevos puntos de pellizco.',
          ],
          supplierSearchTerms: [
            `guarda de seguridad industrial ${sectorName}`,
            `resguardo protector maquinaria ${sectorName}`,
          ],
          isAiSuggested: true,
        },
        {
          id: 'fallback_ai_2',
          name: 'Dispositivo de corte rápido / parada de emergencia y señalización física',
          category: 'Control de emergencia y energía',
          sectorIds: ['custom'],
          hazardReduced: 'Demora en detener un equipo ante atascamiento o falla repentina.',
          howItWorks:
            'Permite interrumpir la energía de forma inmediata al alcance del operador y delimita físicamente el área segura.',
          suitableProcesses: processDescription || sectorName,
          verifyBeforeBuying:
            'Especificación eléctrica del equipo (voltaje y amperaje) revisada por personal competente.',
          technicalChecks: [
            'Validar especificaciones eléctricas antes de adquirir interruptores.',
          ],
          supplierSearchTerms: [
            'boton parada emergencia industrial con caja',
            'senalamiento y barrera fisica seguridad taller',
          ],
          isAiSuggested: true,
        },
      ],
    },
  };
}

export async function personalizeInterventionWithAi(
  business: BusinessContext,
  assessment: ComBAssessment
): Promise<{
  usedAi: boolean;
  headline: string;
  empatheticMessage: string;
  reflectiveQuestion: string;
  actionBridge: string;
}> {
  interface RawReflection {
    headline?: string;
    empatheticMessage?: string;
    reflectiveQuestion?: string;
    actionBridge?: string;
  }

  const res = await callGeminiEndpoint<RawReflection>('personalize_reflection', {
    companyName: business.companyName,
    sectorName: business.sectorName,
    activity: business.activityLabel || business.customProcessDescription,
    primaryBarrier: assessment.primaryBarrier,
    subBarrier: assessment.dominantSubBarrier,
    eisenhowerQuadrant: business.eisenhowerQuadrant,
    statedFacts: assessment.statedFacts.join('; '),
  });

  if (!res.fallback && res.result?.empatheticMessage) {
    return {
      usedAi: true,
      headline: res.result.headline || assessment.interventionTitle,
      empatheticMessage: res.result.empatheticMessage,
      reflectiveQuestion: res.result.reflectiveQuestion || assessment.reflectiveQuestion,
      actionBridge: res.result.actionBridge || assessment.actionBridge,
    };
  }

  return {
    usedAi: false,
    headline: assessment.interventionTitle,
    empatheticMessage: assessment.interventionMessage,
    reflectiveQuestion: assessment.reflectiveQuestion,
    actionBridge: assessment.actionBridge,
  };
}

export async function explainControlWithAi(
  control: PhysicalControlItem,
  business: BusinessContext
): Promise<{
  usedAi: boolean;
  plainExplanation: string;
  technicalChecks: string[];
  technicalNote: string;
}> {
  interface RawControlExplain {
    plainExplanation?: string;
    technicalChecks?: string[];
    technicalNote?: string;
  }

  const res = await callGeminiEndpoint<RawControlExplain>('explain_control', {
    controlName: control.name,
    sectorName: business.sectorName,
    activity: business.activityLabel || business.customProcessDescription,
  });

  if (!res.fallback && res.result?.plainExplanation) {
    return {
      usedAi: true,
      plainExplanation: res.result.plainExplanation,
      technicalChecks:
        res.result.technicalChecks && res.result.technicalChecks.length > 0
          ? res.result.technicalChecks
          : control.technicalChecks,
      technicalNote:
        res.result.technicalNote ||
        'Recuerda: esta guía es orientativa. Verifica medidas reales y compatibilidad con personal técnico competente antes de instalar.',
    };
  }

  return {
    usedAi: false,
    plainExplanation: control.howItWorks,
    technicalChecks: control.technicalChecks,
    technicalNote:
      'Orientación preventiva: valida medidas físicas y compatibilidad eléctrica o mecánica directamente en tu equipo antes de comprar.',
  };
}
