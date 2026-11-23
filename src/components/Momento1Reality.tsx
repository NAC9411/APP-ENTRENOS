import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { EISENHOWER_OPTIONS, SECTORS_CATALOG } from '../data/sectorsAndQuestions';
import { analyzeCustomSectorWithAi } from '../services/geminiClient';
import { BusinessContext, EisenhowerQuadrant } from '../types/entreNos';
import { BrandLogo } from './BrandLogo';

interface Momento1RealityProps {
  business: BusinessContext;
  onChange: (updated: BusinessContext) => void;
  onNext: () => void;
}

export const Momento1Reality: React.FC<Momento1RealityProps> = ({
  business,
  onChange,
  onNext,
}) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedbackNote, setAiFeedbackNote] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedSector = SECTORS_CATALOG.find((s) => s.id === business.sectorId);
  const isCustomSector = business.sectorId === 'custom';

  const handleSectorSelect = (sectorId: string) => {
    const sector = SECTORS_CATALOG.find((s) => s.id === sectorId);
    if (!sector) return;

    if (sectorId === 'custom') {
      onChange({
        ...business,
        sectorId,
        sectorName: business.sectorId === 'custom' ? business.sectorName : '',
        activityId: 'custom_activity',
        activityLabel: '',
        riskEvaluated: '',
      });
      return;
    }

    const firstActivity = sector.activities[0];
    onChange({
      ...business,
      sectorId,
      sectorName: sector.name,
      activityId: firstActivity?.id ?? '',
      activityLabel: firstActivity?.label ?? '',
      riskEvaluated: firstActivity?.typicalRisk ?? '',
      aiSectorAnalysis: undefined,
    });
    setAiFeedbackNote(null);
  };

  const handleActivitySelect = (activityId: string) => {
    const act = selectedSector?.activities.find((a) => a.id === activityId);
    if (!act) return;
    onChange({
      ...business,
      activityId: act.id,
      activityLabel: act.label,
      riskEvaluated: act.typicalRisk,
    });
  };

  const handleAnalyzeCustomSector = async () => {
    if (!business.sectorName.trim() && !business.customProcessDescription.trim()) {
      setValidationError('Cuéntanos brevemente a qué se dedica tu negocio o qué tareas realizan.');
      return;
    }
    setValidationError(null);
    setAiLoading(true);
    setAiFeedbackNote(null);

    const { usedAi, analysis } = await analyzeCustomSectorWithAi(
      business.sectorName || 'Mi negocio',
      business.customProcessDescription || business.sectorName
    );

    onChange({
      ...business,
      sectorName: analysis.sectorLabel || business.sectorName,
      activityLabel: business.customProcessDescription || analysis.sectorLabel,
      riskEvaluated: analysis.mainRiskSummary,
      aiSectorAnalysis: analysis,
      severeHazardResponse:
        analysis.possibleSevereHazard && business.severeHazardResponse === 'no'
          ? 'unsure'
          : business.severeHazardResponse,
    });

    setAiFeedbackNote(
      usedAi
        ? 'Adaptamos preguntas y controles sugeridos según tu proceso.'
        : 'Adaptamos la guía con nuestro respaldo preventivo local para tu actividad.'
    );
    setAiLoading(false);
  };

  const handleContinue = async () => {
    if (!business.sectorId) {
      setValidationError('Elige el sector económico que más se parezca a tu negocio.');
      return;
    }
    if (isCustomSector && !business.customProcessDescription.trim() && !business.sectorName.trim()) {
      setValidationError('Describe brevemente tu actividad o proceso para poder orientarte mejor.');
      return;
    }

    if (isCustomSector && !business.aiSectorAnalysis) {
      await handleAnalyzeCustomSector();
    }

    setValidationError(null);
    onNext();
  };

  const showSevereAlert =
    business.severeHazardResponse === 'yes' ||
    Boolean(business.aiSectorAnalysis?.possibleSevereHazard);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Encabezado cercano de bienvenida */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 sm:p-8 mb-8 border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-wide text-yellow-300 mb-2">
            Momento 1 · Conectamos con tu realidad
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-balance">
            «Sabemos que sacar adelante tu negocio es una prioridad. Queremos ayudarte a que proteger a tu equipo también lo sea.»
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
            Este espacio no busca evaluarte ni señalarte. En unos 3 a 5 minutos identificaremos qué está frenando una mejora de seguridad física y te ayudaremos a elegir un primer paso realista.
          </p>
        </div>
        <div className="shrink-0 self-start md:self-center">
          <BrandLogo />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna izquierda: Datos del negocio y sector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display text-lg font-bold text-slate-900 mb-1">
              1. Sobre tu negocio
            </h2>
            <p className="text-sm text-slate-600 mb-5">
              Usaremos estos datos únicamente para personalizar tus recomendaciones y tu ficha final.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Nombre de tu empresa o taller
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={business.companyName}
                  onChange={(e) => onChange({ ...business, companyName: e.target.value })}
                  placeholder="Ej. Maderas San José"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-2 focus:outline-blue-700"
                />
              </div>

              <div>
                <label htmlFor="ownerRole" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Tu rol en el negocio
                </label>
                <select
                  id="ownerRole"
                  value={business.ownerRole}
                  onChange={(e) => onChange({ ...business, ownerRole: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-2 focus:outline-blue-700"
                >
                  <option value="Propietario / Gerente">Propietario / Gerente</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Encargado de producción o taller">Encargado de producción o taller</option>
                  <option value="Responsable de SST">Responsable de SST</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="location" className="block text-sm font-medium text-slate-800 mb-1.5">
                Ciudad o país (opcional, útil para buscar proveedores cercanos)
              </label>
              <input
                id="location"
                type="text"
                value={business.location}
                onChange={(e) => onChange({ ...business, location: e.target.value })}
                placeholder="Ej. Medellín, Bogotá, Lima, Ciudad de México"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-2 focus:outline-blue-700"
              />
            </div>
          </div>

          {/* Selección de sector económico y actividad */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display text-lg font-bold text-slate-900 mb-1">
              2. Sector económico y actividad principal
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Selecciona tu actividad o describe un sector personalizado con nuestro modo inteligente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTORS_CATALOG.map((sector) => {
                const active = business.sectorId === sector.id;
                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => handleSectorSelect(sector.id)}
                    className={`text-left p-3.5 rounded-xl border transition-colors min-h-[68px] cursor-pointer ${
                      active
                        ? 'border-blue-800 bg-blue-50/80 ring-1 ring-blue-800'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-900">
                        {sector.name}
                      </span>
                      {sector.id === 'custom' && (
                        <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {sector.shortDesc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Actividades del sector estándar */}
            {!isCustomSector && selectedSector && selectedSector.activities.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200">
                <label className="block text-sm font-semibold text-slate-900 mb-2.5">
                  ¿En cuál proceso quieres enfocarte hoy?
                </label>
                <div className="space-y-2.5">
                  {selectedSector.activities.map((act) => {
                    const active = business.activityId === act.id;
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleActivitySelect(act.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-colors min-h-[48px] cursor-pointer ${
                          active
                            ? 'border-blue-800 bg-blue-50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-900">{act.label}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{act.typicalRisk}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modo inteligente para sector personalizado */}
            {isCustomSector && (
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-4">
                <div>
                  <label htmlFor="customSectorName" className="block text-sm font-medium text-slate-800 mb-1.5">
                    ¿Cuál es tu sector o tipo de negocio?
                  </label>
                  <input
                    id="customSectorName"
                    type="text"
                    value={business.sectorName}
                    onChange={(e) =>
                      onChange({ ...business, sectorName: e.target.value, aiSectorAnalysis: undefined })
                    }
                    placeholder="Ej. Lavandería industrial, taller de vidrio, litografía, agroindustria..."
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-2 focus:outline-blue-700"
                  />
                </div>

                <div>
                  <label htmlFor="customProcess" className="block text-sm font-medium text-slate-800 mb-1.5">
                    Describe brevemente la tarea, máquina o situación que te preocupa
                  </label>
                  <textarea
                    id="customProcess"
                    rows={3}
                    value={business.customProcessDescription}
                    onChange={(e) =>
                      onChange({
                        ...business,
                        customProcessDescription: e.target.value,
                        aiSectorAnalysis: undefined,
                      })
                    }
                    placeholder="Ej. Cortamos láminas de acrílico y vidrio en mesa manual, o manipulamos calderas de vapor y planchas industriales..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-2 focus:outline-blue-700"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAnalyzeCustomSector}
                    disabled={aiLoading}
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" aria-hidden="true" />
                    {aiLoading ? 'Analizando tu actividad...' : 'Adaptar guía con Modo Inteligente'}
                  </button>

                  {aiFeedbackNote && (
                    <span className="text-xs font-medium text-blue-900 inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-700" aria-hidden="true" />
                      {aiFeedbackNote}
                    </span>
                  )}
                </div>

                {business.aiSectorAnalysis && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm">
                    <p className="font-semibold text-blue-950">
                      Situación identificada: {business.aiSectorAnalysis.sectorLabel}
                    </p>
                    <p className="text-slate-700 mt-1">
                      {business.aiSectorAnalysis.mainRiskSummary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha: Matriz de Eisenhower + Verificación de peligro grave */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display text-lg font-bold text-slate-900 mb-1">
              3. Tu percepción de prioridad hoy (Matriz de Eisenhower)
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Sin juzgarte: ¿en qué lugar sientes hoy esta mejora de seguridad frente a las demandas del negocio?
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {EISENHOWER_OPTIONS.map((opt) => {
                const active = business.eisenhowerQuadrant === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...business,
                        eisenhowerQuadrant: opt.id as EisenhowerQuadrant,
                      })
                    }
                    className={`text-left p-3.5 rounded-xl border transition-colors min-h-[56px] cursor-pointer ${
                      active
                        ? 'border-blue-800 bg-yellow-50/70 ring-1 ring-blue-800'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{opt.title}</p>
                    <p className="text-xs font-medium text-blue-900 mt-0.5">{opt.subtitle}</p>
                    <p className="text-xs text-slate-600 mt-1">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verificación obligatoria de peligro grave o inminente */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display text-base font-bold text-slate-900 mb-1">
              4. Chequeo rápido de seguridad inmediata
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              En esta tarea, ¿hay exposición directa a partes en movimiento sin resguardo, trabajo en altura sin baranda/arnés, cables vivos o riesgo inmediato grave?
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'yes', label: 'Sí, ocurre hoy' },
                { id: 'unsure', label: 'No estoy seguro' },
                { id: 'no', label: 'No, es prevenible' },
              ].map((choice) => {
                const active = business.severeHazardResponse === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...business,
                        severeHazardResponse: choice.id as 'yes' | 'unsure' | 'no',
                      })
                    }
                    className={`min-h-[44px] px-2 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'border-blue-900 bg-blue-900 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>

            {showSevereAlert && (
              <div
                role="alert"
                className="mt-4 rounded-xl bg-yellow-50 border border-yellow-400 p-4 text-xs sm:text-sm text-slate-900"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-slate-950">
                      Advertencia de peligro grave o inminente
                    </p>
                    <p className="mt-1 leading-relaxed text-slate-800">
                      Cuando hay exposición directa sin protección, <strong>se recomienda detener o evitar esa exposición y solicitar una evaluación técnica competente antes de continuar la actividad</strong>. Ninguna clasificación de prioridad ni fecha futura autoriza trabajar en condiciones peligrosas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {validationError && (
            <p role="alert" className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {validationError}
            </p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            Continuar al Momento 2
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
