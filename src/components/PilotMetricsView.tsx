import React from 'react';
import { Download, RotateCcw, ShieldCheck } from 'lucide-react';
import { PilotMetricsStore } from '../types/entreNos';

interface PilotMetricsViewProps {
  metrics: PilotMetricsStore;
  onToggleConsent: (consent: boolean) => void;
  onResetMetrics: () => void;
}

export const PilotMetricsView: React.FC<PilotMetricsViewProps> = ({
  metrics,
  onToggleConsent,
  onResetMetrics,
}) => {
  const handleExportJson = () => {
    const dataStr = JSON.stringify(metrics, null, 2);
    const uri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const link = document.createElement('a');
    link.href = uri;
    link.download = `entre-nos-indicadores-piloto-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const kpis = [
    { label: 'Experiencias completadas', value: metrics.experiencesCompleted },
    { label: 'Cambios en intención de actuar', value: metrics.intentionShifts },
    { label: 'Controles distintos consultados', value: metrics.controlsConsultedIds.length },
    { label: 'Clics en enlaces comerciales', value: metrics.commercialLinkClicks },
    { label: 'Compromisos definidos', value: metrics.commitmentsDefined },
    { label: 'Avances declarados', value: metrics.progressDeclaredCount },
    { label: 'Controles verificados técnicamente', value: metrics.technicallyVerifiedCount },
  ];

  const barrierRows = [
    { label: 'Motivación (prioridad / confianza pasiva)', count: metrics.barrierCounts.motivation },
    { label: 'Capacidad (claridad de solución / verificación)', count: metrics.barrierCounts.capability },
    { label: 'Oportunidad (proveedores / recursos / tiempo)', count: metrics.barrierCounts.opportunity },
    { label: 'Combinación de componentes', count: metrics.barrierCounts.combined },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-800 mb-1">
          Indicadores del prototipo (validación piloto)
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Medición local con consentimiento y sin datos ficticios
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl">
          Todos los contadores inician en cero y registran únicamente acciones reales ocurridas en este navegador cuando el usuario autoriza el registro del piloto.
        </p>
      </div>

      {/* Control de consentimiento */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-slate-900">
              Consentimiento para registro local de indicadores piloto
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Los datos permanecen exclusivamente en este navegador (`localStorage`). No se envían a servidores externos ni se muestran cifras simuladas.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={metrics.consentGiven}
          onClick={() => onToggleConsent(!metrics.consentGiven)}
          className={`min-h-[44px] px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            metrics.consentGiven
              ? 'bg-blue-900 text-white hover:bg-blue-800'
              : 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200'
          }`}
        >
          {metrics.consentGiven ? 'Registro autorizado: Activo' : 'Autorizar registro piloto'}
        </button>
      </div>

      {/* Métricas reales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between"
          >
            <p className="text-xs font-medium text-slate-600">{kpi.label}</p>
            <p className="font-mono-tabular text-3xl font-bold text-blue-950 mt-2">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Distribución de barreras COM-B */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Barreras COM-B observadas en el piloto
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="min-h-[40px] px-4 py-2 rounded-lg border border-blue-900 text-blue-950 hover:bg-blue-50 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Exportar JSON
            </button>
            <button
              type="button"
              onClick={onResetMetrics}
              className="min-h-[40px] px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reiniciar contadores
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {barrierRows.map((row) => (
            <div key={row.label} className="py-3 flex items-center justify-between gap-4">
              <span className="text-sm text-slate-800">{row.label}</span>
              <span className="font-mono-tabular text-base font-bold text-blue-950">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
