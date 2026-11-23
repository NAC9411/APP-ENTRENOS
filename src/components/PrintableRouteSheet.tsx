import React from 'react';
import { Printer } from 'lucide-react';
import { buildSupplierSearchLinks } from '../engine/selectControls';
import { ActionCommitment, ComBPrimaryResult } from '../types/entreNos';
import { BrandLogo } from './BrandLogo';

interface PrintableRouteSheetProps {
  commitment: ActionCommitment;
  onPrint?: () => void;
}

const BARRIER_LABEL_MAP: Record<ComBPrimaryResult, string> = {
  motivation: 'Prioridad diaria, percepción de urgencia o confianza pasiva',
  capability: 'Claridad práctica sobre qué control elegir y qué verificar',
  opportunity: 'Proveedores, presupuesto, tiempo o apoyo para implementar',
  combined: 'Combinación de obstáculos operativos y de claridad',
};

export const PrintableRouteSheet: React.FC<PrintableRouteSheetProps> = ({
  commitment,
  onPrint,
}) => {
  const triggerPrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 print-surface">
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div>
          <h3 className="font-display text-lg font-bold text-blue-950">
            Vista previa: Ficha «Mi ruta para cuidarnos»
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Al hacer clic en descargar, selecciona «Guardar como PDF» en la ventana de impresión.
          </p>
        </div>
        <button
          type="button"
          onClick={triggerPrint}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          Descargar ficha en PDF
        </button>
      </div>

      {/* Documento imprimible */}
      <div id="printable-route-sheet" className="space-y-6 text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900">
          <BrandLogo />
          <div className="sm:text-right">
            <p className="font-display text-base font-bold text-blue-950">
              Ficha personal: Mi ruta para cuidarnos
            </p>
            <p className="font-mono-tabular text-xs text-slate-600">
              Fecha de emisión: {new Date(commitment.createdAt).toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>

        {/* 1. Empresa, actividad y riesgo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div>
            <p className="text-xs font-bold text-blue-950">Empresa y actividad</p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {commitment.companyName || 'Mi empresa'} · {commitment.sectorName}
            </p>
            <p className="text-xs text-slate-700 mt-1">{commitment.activityLabel}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-950">Riesgo o situación evaluada</p>
            <p className="text-sm text-slate-800 mt-0.5 leading-snug">
              {commitment.riskEvaluated}
            </p>
          </div>
        </div>

        {commitment.severeHazardActive && (
          <div className="rounded-xl bg-yellow-50 border border-yellow-400 p-4 text-xs sm:text-sm text-slate-900">
            <strong>Atención prioritaria por peligro grave o inminente:</strong> este compromiso no autoriza operar bajo exposición directa sin resguardo. Evita la exposición y solicita evaluación técnica competente antes de continuar la tarea.
          </div>
        )}

        {/* 2. Barrera principal + resultado COM-B + mensaje personalizado */}
        <div className="space-y-3 border border-slate-200 rounded-xl p-4">
          <div>
            <p className="text-xs font-bold text-blue-950">
              Qué identificamos que hoy dificultaba avanzar
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {BARRIER_LABEL_MAP[commitment.primaryBarrier]}
            </p>
            <p className="text-sm text-slate-700 mt-1 leading-relaxed">
              {commitment.interpretationBody}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-bold text-blue-950">Mensaje para tu equipo</p>
            <p className="text-sm text-slate-800 mt-1 leading-relaxed">
              {commitment.personalizedMessage}
            </p>
          </div>
        </div>

        {/* 3. Alternativas de controles físicos y referencias comerciales */}
        <div className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-xs font-bold text-blue-950">
              Control físico priorizado para evaluación técnica
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {commitment.selectedControl.name}
            </p>
            <p className="text-xs text-slate-700 mt-1">
              <strong>Qué verificar antes de adquirirlo:</strong>{' '}
              {commitment.selectedControl.verifyBeforeBuying}
            </p>
          </div>

          {commitment.alternativeControls.length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-700">
                Otras alternativas compatibles para revisar
              </p>
              <ul className="mt-1 text-xs text-slate-700 list-disc list-inside space-y-0.5">
                {commitment.alternativeControls
                  .filter((c) => c.id !== commitment.selectedControl.id)
                  .map((alt) => (
                    <li key={alt.id}>{alt.name}</li>
                  ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-700">
              Referencias para consultar proveedores
            </p>
            <ul className="mt-1 space-y-1 text-xs text-blue-900">
              {commitment.selectedControl.supplierSearchTerms.map((term) => {
                const links = buildSupplierSearchLinks(term);
                return (
                  <li key={term}>
                    Término de búsqueda: «{term}» —{' '}
                    <a
                      href={links.googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline break-all"
                    >
                      Consultar opciones en línea
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* 4. Compromiso concreto (sin confundirlo con implementación) */}
        <div className="rounded-xl bg-blue-950 text-white p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-yellow-300">
              Mi compromiso de primer paso (por ejecutar)
            </p>
            <span className="text-[11px] text-blue-200">
              Nota: definir este paso es el inicio; aún no equivale a tener el control instalado.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <p className="text-[11px] text-blue-200">Primer paso elegido</p>
              <p className="text-sm font-bold text-white mt-0.5">{commitment.firstStep}</p>
            </div>
            <div>
              <p className="text-[11px] text-blue-200">Persona encargada</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {commitment.responsiblePerson}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-blue-200">Fecha del compromiso</p>
              <p className="font-mono-tabular text-sm font-bold text-yellow-300 mt-0.5">
                {commitment.severeHazardActive
                  ? `Atención inmediata (${commitment.targetDate})`
                  : commitment.targetDate}
              </p>
            </div>
          </div>
        </div>

        {/* Cierre oficial y aviso legal/técnico */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="font-display text-sm font-bold text-blue-950">
            «La confianza también nos protege cuando se convierte en acción.»
          </p>
          <p className="text-[11px] text-slate-500 max-w-md leading-snug">
            ENTRE NOS es una herramienta de orientación preventiva. No sustituye la evaluación formal de riesgos, la compatibilidad mecánica/eléctrica, la instalación por personal competente ni las obligaciones legales del SG-SST.
          </p>
        </div>
      </div>
    </div>
  );
};
