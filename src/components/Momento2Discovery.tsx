import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { COMB_QUESTIONS } from '../data/sectorsAndQuestions';
import { BusinessContext } from '../types/entreNos';

interface Momento2DiscoveryProps {
  business: BusinessContext;
  answers: Record<string, string>;
  contextualNotes: Record<string, string>;
  onChangeAnswer: (questionId: string, optionId: string) => void;
  onChangeContextualNote: (questionId: string, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const GROUP_SECTIONS = [
  {
    title: 'Cómo se vive la seguridad en tu rutina diaria',
    subtitle: 'Queremos entender qué pasa entre las urgencias del trabajo y el cuidado del equipo.',
    ids: ['m1_experience', 'm2_closeness', 'm3_production', 'm4_wellbeing'],
  },
  {
    title: 'Qué tan clara está la solución técnica',
    subtitle: 'No necesitas ser experto; solo queremos saber qué información te haría falta.',
    ids: ['c1_know_control', 'c2_what_to_search', 'c3_verify'],
  },
  {
    title: 'Condiciones prácticas para conseguirlo e instalarlo',
    subtitle: 'Tiempo, proveedores, presupuesto y quién puede ayudarte a dar el paso.',
    ids: ['o1_suppliers', 'o2_resources_time', 'o3_support_authority'],
  },
];

export const Momento2Discovery: React.FC<Momento2DiscoveryProps> = ({
  business,
  answers,
  contextualNotes,
  onChangeAnswer,
  onChangeContextualNote,
  onBack,
  onNext,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const answeredCount = COMB_QUESTIONS.filter((q) => Boolean(answers[q.id])).length;
  const totalCount = COMB_QUESTIONS.length;
  const allAnswered = answeredCount === totalCount;

  const handleContinue = () => {
    if (!allAnswered) {
      const missingCount = totalCount - answeredCount;
      setErrorMsg(
        `Te ${missingCount === 1 ? 'falta 1 pregunta' : `faltan ${missingCount} preguntas`} por responder para darte una orientación acertada.`
      );
      return;
    }
    setErrorMsg(null);
    onNext();
  };

  const contextualQuestions = business.aiSectorAnalysis?.contextualQuestions ?? [];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-wide text-blue-800 mb-1.5">
          Momento 2 · Descubrimos qué te está frenando
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
          Conversemos sobre lo que hoy dificulta actuar en {business.companyName || 'tu negocio'}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Son {totalCount} preguntas breves sobre tu realidad en{' '}
          <span className="font-semibold text-slate-800">
            {business.activityLabel || business.sectorName}
          </span>
          . No hay respuestas buenas ni malas.
        </p>

        {/* Barra de progreso simple y limpia */}
        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-4">
          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-800 h-full transition-all duration-200"
              style={{ width: `${Math.round((answeredCount / totalCount) * 100)}%` }}
            />
          </div>
          <span className="font-mono-tabular text-xs font-semibold text-blue-950 whitespace-nowrap">
            {answeredCount} / {totalCount} respondidas
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {GROUP_SECTIONS.map((group) => {
          const groupQuestions = COMB_QUESTIONS.filter((q) => group.ids.includes(q.id));
          return (
            <div key={group.title} className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="font-display text-lg font-bold text-blue-950">{group.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600">{group.subtitle}</p>
              </div>

              <div className="space-y-4">
                {groupQuestions.map((q) => {
                  const currentChoice = answers[q.id];
                  const qIndex = COMB_QUESTIONS.findIndex((item) => item.id === q.id) + 1;

                  return (
                    <fieldset
                      key={q.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6"
                    >
                      <legend className="text-sm sm:text-base font-semibold text-slate-900 leading-snug mb-3.5">
                        <span className="font-mono-tabular text-blue-800 mr-2">
                          {qIndex < 10 ? `0${qIndex}.` : `${qIndex}.`}
                        </span>
                        {q.question}
                      </legend>

                      <div className="space-y-2.5">
                        {q.options.map((opt) => {
                          const selected = currentChoice === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                onChangeAnswer(q.id, opt.id);
                                if (errorMsg) setErrorMsg(null);
                              }}
                              aria-pressed={selected}
                              className={`w-full text-left min-h-[48px] px-4 py-3 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                                selected
                                  ? 'border-blue-800 bg-blue-50 text-blue-950 font-medium ring-1 ring-blue-800'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <span className="text-sm leading-snug">{opt.label}</span>
                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                  selected
                                    ? 'bg-blue-900 border-blue-900 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                                aria-hidden="true"
                              >
                                {selected && <Check className="w-3.5 h-3.5" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Preguntas adaptadas cuando viene del Modo Inteligente */}
        {contextualQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="font-display text-lg font-bold text-blue-950">
                Preguntas adaptadas a tu actividad específica
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Opcional: estas notas nos ayudan a afinar la recomendación para tu proceso.
              </p>
            </div>
            {contextualQuestions.map((cq) => (
              <div key={cq.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                <label
                  htmlFor={`ctx_${cq.id}`}
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  {cq.prompt}
                </label>
                <input
                  id={`ctx_${cq.id}`}
                  type="text"
                  value={contextualNotes[cq.id] ?? ''}
                  onChange={(e) => onChangeContextualNote(cq.id, e.target.value)}
                  placeholder="Escribe una respuesta breve si deseas añadir contexto..."
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-2 focus:outline-blue-700"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {errorMsg && (
        <p
          role="alert"
          className="mt-6 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
        >
          {errorMsg}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver al Momento 1
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="min-h-[48px] px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-base font-semibold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          Ver qué nos está frenando
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
