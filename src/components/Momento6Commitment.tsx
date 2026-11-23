import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { FIRST_STEP_OPTIONS, RESPONSIBLE_OPTIONS } from '../data/sectorsAndQuestions';
import { isSevereHazardContext } from '../engine/combRules';
import { buildCalendarReminder } from '../services/localPersistence';
import {
  ActionCommitment,
  BusinessContext,
  ComBAssessment,
  PhysicalControlItem,
} from '../types/entreNos';
import { PrintableRouteSheet } from './PrintableRouteSheet';

interface Momento6CommitmentProps {
  business: BusinessContext;
  assessment: ComBAssessment;
  selectedControl: PhysicalControlItem;
  alternativeControls: PhysicalControlItem[];
  savedCommitment: ActionCommitment | null;
  onSaveCommitment: (commitment: ActionCommitment, intentionShifted: boolean) => void;
  onOpenFollowUp: () => void;
  onBack: () => void;
}

export const Momento6Commitment: React.FC<Momento6CommitmentProps> = ({
  business,
  assessment,
  selectedControl,
  alternativeControls,
  savedCommitment,
  onSaveCommitment,
  onOpenFollowUp,
  onBack,
}) => {
  const severeActive = isSevereHazardContext(business);
  const todayStr = new Date().toISOString().slice(0, 10);

  const [firstStep, setFirstStep] = useState<string>(
    savedCommitment?.firstStep ?? FIRST_STEP_OPTIONS[0]
  );
  const [responsibleRole, setResponsibleRole] = useState<string>(
    savedCommitment?.responsiblePerson ?? RESPONSIBLE_OPTIONS[0]
  );
  const [customPersonName, setCustomPersonName] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(
    savedCommitment?.targetDate ?? todayStr
  );
  const [intentionBefore, setIntentionBefore] = useState<
    'postergando' | 'pensandolo' | 'listo'
  >(savedCommitment?.intentionBefore ?? 'postergando');
  const [intentionAfter, setIntentionAfter] = useState<
    'comprometido_hoy' | 'necesita_evaluacion_previa'
  >(
    severeActive
      ? 'necesita_evaluacion_previa'
      : savedCommitment?.intentionAfter ?? 'comprometido_hoy'
  );
  const [reminderAuthorized, setReminderAuthorized] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [dateWarning, setDateWarning] = useState<string | null>(null);

  const handleDateChange = (val: string) => {
    if (severeActive && val > todayStr) {
      // No autoriza postergación ante peligro grave o inminente
      setDateWarning(
        'Ante peligro grave o inminente no es seguro aplazar la acción a una fecha futura. Ajustamos la fecha a hoy para evitar la exposición y solicitar revisión técnica inmediata.'
      );
      setTargetDate(todayStr);
      return;
    }
    setDateWarning(null);
    setTargetDate(val);
  };

  const handleConfirmStep = () => {
    const finalPerson =
      responsibleRole === 'Otra persona' && customPersonName.trim()
        ? customPersonName.trim()
        : responsibleRole;

    const commitment: ActionCommitment = {
      id: savedCommitment?.id ?? `comp_${Date.now()}`,
      createdAt: savedCommitment?.createdAt ?? new Date().toISOString(),
      companyName: business.companyName || 'Mi empresa',
      sectorName: business.sectorName,
      activityLabel: business.activityLabel || business.customProcessDescription || business.sectorName,
      riskEvaluated:
        business.riskEvaluated ||
        selectedControl.hazardReduced,
      severeHazardActive: severeActive,
      primaryBarrier: assessment.primaryBarrier,
      interpretationBody: assessment.interpretationBody,
      personalizedMessage: assessment.interventionMessage,
      selectedControl,
      alternativeControls,
      firstStep,
      responsiblePerson: finalPerson,
      targetDate: severeActive ? todayStr : targetDate || todayStr,
      reminderConfigured: reminderAuthorized,
      intentionBefore,
      intentionAfter,
      followUpStatus: savedCommitment?.followUpStatus ?? 'not_started',
      followUpUpdatedAt: new Date().toISOString(),
    };

    const intentionShifted =
      intentionBefore !== 'listo' && intentionAfter === 'comprometido_hoy';

    onSaveCommitment(commitment, intentionShifted);
  };

  const handleCopyShareText = async () => {
    if (!savedCommitment) return;
    const summary = [
      `ENTRE NOS — Mi ruta para cuidarnos`,
      `Empresa: ${savedCommitment.companyName}`,
      `Alternativa a evaluar: ${savedCommitment.selectedControl.name}`,
      `Primer paso: ${savedCommitment.firstStep}`,
      `Encargado: ${savedCommitment.responsiblePerson}`,
      `Fecha: ${savedCommitment.targetDate}`,
      `"La confianza también nos protege cuando se convierte en acción."`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 3000);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const calendarLinks = savedCommitment ? buildCalendarReminder(savedCommitment) : null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div className="no-print">
        <p className="text-xs font-semibold tracking-wide text-blue-800 mb-1.5">
          Momento 6 · Hagámoslo realidad
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
          «Ya encontraste una alternativa. ¿Cuál será tu primer paso para proteger a tu equipo?»
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Alternativa seleccionada para evaluar:{' '}
          <span className="font-semibold text-blue-950">{selectedControl.name}</span>
        </p>
      </div>

      {severeActive && (
        <div
          role="alert"
          className="no-print rounded-2xl bg-yellow-50 border border-yellow-400 p-5 text-sm text-slate-900 flex items-start gap-3"
        >
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-bold text-slate-950">
              Restricción preventiva por peligro grave o inminente
            </p>
            <p className="mt-1 leading-relaxed">
              Puedes definir tu primer paso de gestión hoy mismo, pero{' '}
              <strong>este compromiso no autoriza operar el equipo o proceso mientras persista la exposición sin resguardo</strong>. Evita la exposición y solicita evaluación técnica competente.
            </p>
          </div>
        </div>
      )}

      {/* Formulario de planificación de acciones */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 mb-3">
            1. ¿Cuál será tu primer paso concreto?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {FIRST_STEP_OPTIONS.map((stepOpt) => {
              const active = firstStep === stepOpt;
              return (
                <button
                  key={stepOpt}
                  type="button"
                  onClick={() => setFirstStep(stepOpt)}
                  className={`min-h-[48px] text-left px-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-blue-900 bg-blue-50 text-blue-950 font-semibold ring-1 ring-blue-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{stepOpt}</span>
                  {active && <Check className="w-4 h-4 text-blue-900 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 mb-3">
              2. ¿Quién dará ese primer paso?
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {RESPONSIBLE_OPTIONS.map((person) => {
                const active = responsibleRole === person;
                return (
                  <button
                    key={person}
                    type="button"
                    onClick={() => setResponsibleRole(person)}
                    className={`min-h-[44px] px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-blue-900 bg-blue-900 text-white font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {person}
                  </button>
                );
              })}
            </div>
            {responsibleRole === 'Otra persona' && (
              <input
                type="text"
                value={customPersonName}
                onChange={(e) => setCustomPersonName(e.target.value)}
                placeholder="Nombre o cargo de quien ejecutará el primer paso"
                aria-label="Nombre de la persona encargada"
                className="mt-3 w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-2 focus:outline-blue-700"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="commitmentDate"
                className="block font-display text-base font-bold text-slate-900 mb-2"
              >
                3. ¿Cuándo lo harás?
              </label>
              <input
                id="commitmentDate"
                type="date"
                min={todayStr}
                max={severeActive ? todayStr : undefined}
                value={targetDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 font-mono-tabular text-sm text-slate-900 focus:outline-2 focus:outline-blue-700"
              />
              {dateWarning && (
                <p className="mt-2 text-xs text-amber-800 bg-yellow-50 border border-yellow-300 rounded-lg p-2.5">
                  {dateWarning}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="intentionBefore"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Antes de hacer este recorrido, ¿en qué punto estabas frente a esta mejora?
              </label>
              <select
                id="intentionBefore"
                value={intentionBefore}
                onChange={(e) =>
                  setIntentionBefore(e.target.value as 'postergando' | 'pensandolo' | 'listo')
                }
                className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900"
              >
                <option value="postergando">Lo venía postergando sin fecha</option>
                <option value="pensandolo">Lo estaba pensando pero sin claridad</option>
                <option value="listo">Ya quería hacerlo pero me faltaba un paso</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Explorar otra solución
          </button>

          <button
            type="button"
            onClick={handleConfirmStep}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-base font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            {savedCommitment ? 'Actualizar mi primer paso' : 'Confirmar mi primer paso'}
          </button>
        </div>
      </div>

      {/* Confirmación positiva + Recordatorios reales + Ficha PDF */}
      {savedCommitment && (
        <div className="space-y-6">
          <div className="no-print rounded-2xl bg-blue-900 text-white p-6 sm:p-8 border border-blue-800 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-yellow-300 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold">
                  «La protección empieza con una decisión. Ya tienes un primer paso definido.»
                </h2>
                <p className="mt-1.5 text-sm text-blue-100 leading-relaxed">
                  Definir este compromiso es el inicio del camino; recuerda registrar tu avance cuando consultes proveedores, cotices o verifiques la instalación. Este compromiso aún no equivale a tener el control físico instalado.
                </p>
              </div>
            </div>

            {/* Recordatorio real con autorización explícita del usuario */}
            <div className="bg-blue-950/60 border border-blue-800 rounded-xl p-4 space-y-3">
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderAuthorized}
                  onChange={(e) => setReminderAuthorized(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-yellow-400"
                />
                <span>
                  Quiero generar un recordatorio real en mi calendario para cumplir este primer paso el{' '}
                  <strong className="font-mono-tabular text-yellow-300">
                    {savedCommitment.targetDate}
                  </strong>
                  .
                </span>
              </label>

              {reminderAuthorized && calendarLinks && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={calendarLinks.icsDataUri}
                    download={calendarLinks.icsFilename}
                    className="min-h-[40px] px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Descargar evento (.ics)
                  </a>
                  <a
                    href={calendarLinks.googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-4 py-2 rounded-lg bg-white hover:bg-blue-50 text-blue-950 text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    Abrir en Google Calendar
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyShareText}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-blue-700 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" aria-hidden="true" />
                {copiedMsg ? 'Resumen copiado' : 'Copiar resumen para compartir'}
              </button>

              <button
                type="button"
                onClick={onOpenFollowUp}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                Ir al seguimiento voluntario de avances
              </button>
            </div>
          </div>

          <PrintableRouteSheet commitment={savedCommitment} />
        </div>
      )}
    </section>
  );
};
