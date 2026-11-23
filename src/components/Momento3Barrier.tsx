import React from 'react';
import { ArrowLeft, ArrowRight, Compass, Lightbulb, ShieldAlert, Wrench } from 'lucide-react';
import { isSevereHazardContext } from '../engine/combRules';
import { BusinessContext, ComBAssessment } from '../types/entreNos';

interface Momento3BarrierProps {
  business: BusinessContext;
  assessment: ComBAssessment;
  onBack: () => void;
  onNext: () => void;
}

const BARRIER_HUMAN_LABEL: Record<ComBAssessment['primaryBarrier'], string> = {
  motivation: 'Prioridad y percepción frente a la rutina diaria',
  capability: 'Claridad sobre qué control elegir y cómo verificarlo',
  opportunity: 'Condiciones prácticas, proveedores, tiempo o recursos',
  combined: 'Combinación de obstáculos cotidianos',
};

export const Momento3Barrier: React.FC<Momento3BarrierProps> = ({
  business,
  assessment,
  onBack,
  onNext,
}) => {
  const severeActive = isSevereHazardContext(business);

  const conditions = [
    {
      key: 'motivation' as const,
      title: 'Querer proteger en medio del día a día',
      level: assessment.internalLevels.motivation,
      icon: Compass,
      humanStatus:
        assessment.internalLevels.motivation === 'high_friction'
          ? 'Necesita impulso frente a la rutina o la confianza pasiva'
          : assessment.internalLevels.motivation === 'moderate_friction'
            ? 'Existe interés, aunque las urgencias compiten por atención'
            : 'Disposición sólida para proteger al equipo',
    },
    {
      key: 'capability' as const,
      title: 'Saber qué control usar y qué revisar',
      level: assessment.internalLevels.capability,
      icon: Lightbulb,
      humanStatus:
        assessment.internalLevels.capability === 'high_friction'
          ? 'Principal punto de apoyo: claridad práctica de soluciones'
          : assessment.internalLevels.capability === 'moderate_friction'
            ? 'Ayudará revisar qué comprobar antes de comprar'
            : 'Tienes buena noción de qué tipo de protección aplica',
    },
    {
      key: 'opportunity' as const,
      title: 'Tener cómo conseguirlo e instalarlo',
      level: assessment.internalLevels.opportunity,
      icon: Wrench,
      humanStatus:
        assessment.internalLevels.opportunity === 'high_friction'
          ? 'Principal punto de apoyo: destrabar proveedores, tiempo o recursos'
          : assessment.internalLevels.opportunity === 'moderate_friction'
            ? 'Conviene facilitar búsqueda comercial o apoyo técnico'
            : 'Cuentas con margen razonable para gestionarlo',
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-blue-800 mb-1.5">
          Momento 3 · Identificamos la barrera principal
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
          Esto es lo que hoy está dificultando avanzar
        </h1>
      </div>

      {/* Tarjeta interpretativa principal sin etiquetas negativas ni puntajes clínicos */}
      <div className="bg-blue-950 text-white rounded-2xl p-6 sm:p-8 mb-6 border border-blue-900">
        <p className="text-xs font-semibold text-yellow-300 mb-2">
          Lectura principal · {BARRIER_HUMAN_LABEL[assessment.primaryBarrier]}
        </p>
        <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug text-balance">
          {assessment.interpretationHeadline}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed max-w-3xl">
          «{assessment.interpretationBody}»
        </p>
      </div>

      {/* Alerta si hay peligro grave o inminente */}
      {severeActive && (
        <div
          role="alert"
          className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-400 p-5 text-slate-900"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm leading-relaxed">
              <p className="font-bold text-slate-950">
                Prioridad técnica inmediata por indicios de peligro grave o inminente
              </p>
              <p className="mt-1">
                Mientras gestionas la solución definitiva, <strong>evita la exposición directa sin resguardo y solicita una evaluación técnica competente antes de continuar esa tarea</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Las 3 condiciones humanas (sin puntaje clínico) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-display text-base font-bold text-slate-900 mb-1">
            ¿Dónde conviene enfocar el apoyo ahora?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-5">
            Esta lectura orienta el siguiente paso según lo que nos compartiste, sin calificarte ni juzgarte.
          </p>

          <div className="space-y-4">
            {conditions.map((cond) => {
              const Icon = cond.icon;
              const isFocus =
                cond.key === assessment.primaryBarrier ||
                (assessment.primaryBarrier === 'combined' &&
                  (cond.level === 'high_friction' || cond.key === assessment.secondaryBarrier));

              return (
                <div
                  key={cond.key}
                  className={`rounded-xl p-4 border ${
                    isFocus
                      ? 'bg-yellow-50/70 border-yellow-400'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isFocus ? 'bg-blue-900 text-yellow-300' : 'bg-white border border-slate-200 text-blue-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900">{cond.title}</p>
                        <span className="text-xs font-semibold text-blue-900">
                          {isFocus ? 'Foco de apoyo' : 'Base favorable'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                        {cond.humanStatus}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complementariedad con la Matriz de Eisenhower */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900">
            Lo que muestra tu prioridad en la Matriz de Eisenhower
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {assessment.eisenhowerInsight}
          </p>
          <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800 mb-1">Nota de alcance técnico</p>
            <p>
              ENTRE NOS te orienta a superar la postergación y encontrar alternativas. Esta lectura no reemplaza una identificación formal de peligros ni la revisión técnica en tu lugar de trabajo.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Revisar mis respuestas
        </button>

        <button
          type="button"
          onClick={onNext}
          className="min-h-[48px] px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-base font-semibold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          Continuar al Momento 4
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
