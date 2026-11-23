import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  ShieldAlert,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { isSevereHazardContext } from '../engine/combRules';
import { buildSupplierSearchLinks, getPrioritizedControls } from '../engine/selectControls';
import { explainControlWithAi } from '../services/geminiClient';
import { BusinessContext, PhysicalControlItem } from '../types/entreNos';

interface Momento5SolutionsProps {
  business: BusinessContext;
  selectedControlId: string | null;
  onConsultControl: (control: PhysicalControlItem) => void;
  onCommercialClick: () => void;
  onChooseFirstStep: (control: PhysicalControlItem, allPrimary: PhysicalControlItem[]) => void;
  onBack: () => void;
}

export const Momento5Solutions: React.FC<Momento5SolutionsProps> = ({
  business,
  selectedControlId,
  onConsultControl,
  onCommercialClick,
  onChooseFirstStep,
  onBack,
}) => {
  const { primaryControls, otherControls } = getPrioritizedControls(business);
  const [expandedControlId, setExpandedControlId] = useState<string | null>(
    selectedControlId ?? primaryControls[0]?.id ?? null
  );
  const [supplierOpenId, setSupplierOpenId] = useState<string | null>(null);
  const [showOtherControls, setShowOtherControls] = useState(false);
  const [aiExplanations, setAiExplanations] = useState<
    Record<string, { plainExplanation: string; technicalChecks: string[]; technicalNote: string }>
  >({});
  const [loadingExplainId, setLoadingExplainId] = useState<string | null>(null);

  const severeActive = isSevereHazardContext(business);

  const handleExplore = async (control: PhysicalControlItem) => {
    const isOpening = expandedControlId !== control.id;
    setExpandedControlId(isOpening ? control.id : null);
    if (!isOpening) return;

    onConsultControl(control);

    if (!aiExplanations[control.id]) {
      setLoadingExplainId(control.id);
      const res = await explainControlWithAi(control, business);
      setAiExplanations((prev) => ({
        ...prev,
        [control.id]: {
          plainExplanation: res.plainExplanation,
          technicalChecks: res.technicalChecks,
          technicalNote: res.technicalNote,
        },
      }));
      setLoadingExplainId(null);
    }
  };

  const handleToggleSuppliers = (control: PhysicalControlItem) => {
    const next = supplierOpenId === control.id ? null : control.id;
    setSupplierOpenId(next);
    if (next) {
      onConsultControl(control);
    }
  };

  const renderControlCard = (control: PhysicalControlItem, isPriority: boolean) => {
    const isExpanded = expandedControlId === control.id;
    const isSupplierOpen = supplierOpenId === control.id;
    const aiDetail = aiExplanations[control.id];
    const isLoadingDetail = loadingExplainId === control.id;

    return (
      <article
        key={control.id}
        className={`bg-white rounded-2xl border p-6 transition-colors ${
          isPriority ? 'border-blue-200' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-blue-900">{control.category}</span>
              <span aria-hidden="true">·</span>
              <span>
                {isPriority ? 'Alternativa prioritaria para evaluar' : 'Alternativa complementaria'}
              </span>
              {control.isAiSuggested && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-blue-800 font-medium">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    Sugerencia según tu actividad
                  </span>
                </>
              )}
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              {control.name}
            </h2>
          </div>
        </div>

        {/* Las 5 preguntas clave requeridas por cada ficha */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <div>
            <dt className="font-bold text-blue-950 text-xs mb-1">1. ¿Qué peligro busca reducir?</dt>
            <dd className="text-slate-700 leading-relaxed">{control.hazardReduced}</dd>
          </div>
          <div>
            <dt className="font-bold text-blue-950 text-xs mb-1">2. ¿Cómo funciona?</dt>
            <dd className="text-slate-700 leading-relaxed">{control.howItWorks}</dd>
          </div>
          <div>
            <dt className="font-bold text-blue-950 text-xs mb-1">
              3. ¿Para qué procesos puede resultar adecuada?
            </dt>
            <dd className="text-slate-700 leading-relaxed">{control.suitableProcesses}</dd>
          </div>
          <div>
            <dt className="font-bold text-blue-950 text-xs mb-1">
              4. ¿Qué debo verificar antes de adquirirla?
            </dt>
            <dd className="text-slate-700 leading-relaxed">{control.verifyBeforeBuying}</dd>
          </div>
          <div className="md:col-span-2 pt-2 border-t border-slate-200">
            <dt className="font-bold text-blue-950 text-xs mb-1">
              5. ¿Dónde puedo encontrar proveedores?
            </dt>
            <dd className="text-slate-700">
              Ferreterías industriales, distribuidores de seguridad industrial o búsqueda comercial directa por término genérico:{' '}
              <span className="font-medium text-slate-900">
                «{control.supplierSearchTerms[0]}»
              </span>
              .
            </dd>
          </div>
        </dl>

        {/* Botones funcionales obligatorios */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleExplore(control)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-blue-900 text-blue-950 hover:bg-blue-50 text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Wrench className="w-4 h-4" aria-hidden="true" />
            Explorar esta solución
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleToggleSuppliers(control)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Consultar proveedores
          </button>

          <button
            type="button"
            onClick={() => onChooseFirstStep(control, primaryControls)}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer sm:ml-auto shadow-xs"
          >
            Quiero dar el primer paso
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Panel expandible: Explorar esta solución */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-blue-950">
              Guía de verificación técnica previa a la compra
            </h3>
            {isLoadingDetail ? (
              <p className="text-xs text-slate-600">Preparando explicación sencilla para tu proceso...</p>
            ) : (
              <>
                {aiDetail?.plainExplanation && (
                  <p className="text-sm text-slate-700 leading-relaxed">{aiDetail.plainExplanation}</p>
                )}
                <ul className="space-y-1.5 text-sm text-slate-800 list-disc list-inside">
                  {(aiDetail?.technicalChecks ?? control.technicalChecks).map((chk) => (
                    <li key={chk}>{chk}</li>
                  ))}
                </ul>
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {aiDetail?.technicalNote ??
                    'ENTRE NOS sugiere nombres genéricos de controles; valida medidas y compatibilidad directamente con un técnico o fabricante.'}
                </p>
              </>
            )}
          </div>
        )}

        {/* Panel expandible: Consultar proveedores reales sin inventar precios/stock */}
        {isSupplierOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200 bg-blue-50/50 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-blue-950">
                Búsqueda comercial real (sin intermediación ni precios inventados)
              </h3>
              <span className="text-xs text-slate-600">
                Abrir un enlace no equivale a adquirir o instalar el control.
              </span>
            </div>

            <div className="space-y-2.5">
              {control.supplierSearchTerms.map((term) => {
                const queryWithLoc = business.location ? `${term} ${business.location}` : term;
                const links = buildSupplierSearchLinks(queryWithLoc);
                return (
                  <div
                    key={term}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg p-3"
                  >
                    <span className="text-xs sm:text-sm font-medium text-slate-800">
                      Término: «{queryWithLoc}»
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={links.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onCommercialClick}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        Buscar en Google
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                      <a
                        href={links.mercadoLibreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onCommercialClick}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        Ver catálogo comercial
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    );
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-blue-800 mb-1.5">
          Momento 5 · Hacemos posible la solución
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
          Alternativas físicas más pertinentes para tu proceso
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl">
          En lugar de mostrarte una lista interminable, priorizamos las opciones clave para{' '}
          <span className="font-semibold text-slate-800">
            {business.activityLabel || business.sectorName}
          </span>
          . Elige una para definir tu primer paso.
        </p>
      </div>

      {severeActive && (
        <div
          role="alert"
          className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-400 p-4 text-sm text-slate-900 flex items-start gap-3"
        >
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <strong>Recuerda:</strong> ante exposición a peligro grave o inminente, evita realizar la actividad sin resguardo y solicita evaluación técnica competente antes de poner el equipo en marcha.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {primaryControls.map((ctrl) => renderControlCard(ctrl, true))}
      </div>

      {otherControls.length > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowOtherControls((prev) => !prev)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 inline-flex items-center gap-2 cursor-pointer"
          >
            {showOtherControls
              ? 'Ocultar otras opciones del catálogo'
              : `Ver otras ${otherControls.length} opciones del catálogo`}
            {showOtherControls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOtherControls && (
            <div className="mt-4 space-y-5">
              {otherControls.map((ctrl) => renderControlCard(ctrl, false))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver al Momento 4
        </button>
      </div>
    </section>
  );
};
