import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { personalizeInterventionWithAi } from '../services/geminiClient';
import { BusinessContext, ComBAssessment } from '../types/entreNos';

interface Momento4InterventionProps {
  business: BusinessContext;
  assessment: ComBAssessment;
  onUpdateAssessment: (updated: ComBAssessment) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Momento4Intervention: React.FC<Momento4InterventionProps> = ({
  business,
  assessment,
  onUpdateAssessment,
  onBack,
  onNext,
}) => {
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [imgError, setImgError] = useState(false);

  const isCapabilityFocused =
    assessment.primaryBarrier === 'capability' ||
    (assessment.primaryBarrier === 'combined' &&
      assessment.internalLevels.capability === 'high_friction' &&
      assessment.internalLevels.motivation !== 'high_friction');

  const isOpportunityFocused =
    assessment.primaryBarrier === 'opportunity' ||
    (assessment.primaryBarrier === 'combined' &&
      assessment.internalLevels.opportunity === 'high_friction' &&
      assessment.internalLevels.motivation !== 'high_friction');

  // Enriquecimiento opcional con Gemini basado únicamente en respuestas reales del empresario
  useEffect(() => {
    let active = true;
    if (assessment.aiPersonalizedUsed) return;

    const enrich = async () => {
      setAiStatus('loading');
      const res = await personalizeInterventionWithAi(business, assessment);
      if (!active) return;

      if (res.usedAi) {
        onUpdateAssessment({
          ...assessment,
          interventionTitle: res.headline,
          interventionMessage: res.empatheticMessage,
          reflectiveQuestion: res.reflectiveQuestion,
          actionBridge: res.actionBridge,
          aiPersonalizedUsed: true,
        });
      }
      setAiStatus('done');
    };

    enrich();
    return () => {
      active = false;
    };
    // Solo se ejecuta al entrar con una evaluación nueva
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.primaryBarrier, assessment.dominantSubBarrier]);

  const visualAsset = isCapabilityFocused
    ? {
        src: '/src/assets/images/workshop_safe_guard_1795458138524.jpg',
        alt: 'Máquinas de taller equipadas con guardas protectoras amarillas visibles que permiten trabajar con seguridad',
        caption: 'Ejemplo visual: un resguardo físico visible protege las manos sin detener la producción.',
      }
    : isOpportunityFocused
      ? {
          src: '/src/assets/images/electrical_lockout_control_1795458138069.jpg',
          alt: 'Tablero eléctrico organizado con dispositivo de bloqueo amarillo y etiqueta de seguridad',
          caption: 'Ejemplo visual: soluciones concretas y accesibles para instalar por etapas.',
        }
      : {
          src: '/src/assets/images/team_trust_ppe_1795458138158.jpg',
          alt: 'Equipo de trabajo en un taller organizado usando gafas de protección y cuidándose mutuamente',
          caption: 'Cuando la cercanía y la experiencia se acompañan de protección física, todo el equipo gana.',
        };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-blue-800 mb-1.5">
          Momento 4 · Transformamos la percepción
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
          {assessment.interventionTitle}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Columna principal: Identificación -> Reflexión -> Confianza para actuar */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>Para {business.companyName || 'tu equipo'}</span>
              {aiStatus === 'loading' ? (
                <span className="inline-flex items-center gap-1.5 text-blue-800 font-medium">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  Adaptando mensaje a tu respuesta...
                </span>
              ) : assessment.aiPersonalizedUsed ? (
                <span className="inline-flex items-center gap-1.5 text-blue-800 font-medium">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  Adaptado a tu realidad
                </span>
              ) : null}
            </div>

            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
              {assessment.interventionMessage}
            </p>

            {/* En Capacidad: explicación sencilla del riesgo y qué verificar */}
            {isCapabilityFocused && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2 text-sm text-slate-800">
                <p className="font-bold text-blue-950">
                  ¿Cómo funciona un control físico en la práctica?
                </p>
                <p className="leading-relaxed">
                  A diferencia de recordar «ten cuidado», una protección física (como una guarda, rejilla con microswitch, baranda o bloqueo eléctrico) reduce la posibilidad de lesión incluso si alguien se distrae por un segundo durante {business.activityLabel || 'el trabajo'}.
                </p>
              </div>
            )}

            {/* En Oportunidad: rutas específicas para destrabar obstáculos */}
            {assessment.opportunityRoutes.length > 0 && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm font-bold text-blue-950 mb-2.5">
                  Caminos concretos que puedes tomar hoy según tus recursos:
                </p>
                <ul className="space-y-2">
                  {assessment.opportunityRoutes.map((route) => (
                    <li key={route} className="flex items-center gap-2.5 text-sm text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0" aria-hidden="true" />
                      <span>{route}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pregunta reflexiva interactiva */}
          <div className="rounded-xl bg-yellow-50/80 border border-yellow-300 p-5 space-y-3">
            <p className="text-sm sm:text-base font-bold text-blue-950">
              {assessment.reflectiveQuestion}
            </p>
            <textarea
              rows={2}
              value={assessment.userReflectionNote}
              onChange={(e) =>
                onUpdateAssessment({ ...assessment, userReflectionNote: e.target.value })
              }
              placeholder="Opcional: escribe en una frase qué te gustaría ajustar o revisar primero..."
              aria-label="Tu reflexión personal"
              className="w-full px-3.5 py-2.5 rounded-lg border border-yellow-400 bg-white text-sm text-slate-900 focus:outline-2 focus:outline-blue-800"
            />
            <p className="text-xs text-slate-700">
              {assessment.actionBridge}
            </p>
          </div>
        </div>

        {/* Columna visual empática (sin accidentes ni miedo extremo) */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="relative aspect-[4/3] lg:flex-1 bg-blue-50">
            {!imgError ? (
              <img
                src={visualAsset.src}
                alt={visualAsset.alt}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-blue-50 to-yellow-50">
                <ShieldCheck className="w-12 h-12 text-blue-900 mb-3" aria-hidden="true" />
                <p className="text-sm font-semibold text-blue-950">
                  La confianza también nos protege
                </p>
              </div>
            )}
          </div>
          <div className="p-5 border-t border-slate-200 bg-white">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {visualAsset.caption}
            </p>
            <p className="mt-2 text-xs font-semibold text-blue-900">
              Identificación personal → Reflexión → Confianza para actuar → Primer paso
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
          Volver al Momento 3
        </button>

        <button
          type="button"
          onClick={onNext}
          className="min-h-[48px] px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-base font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          Explorar soluciones físicas posibles
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
