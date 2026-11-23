import React, { useState } from 'react';
import { CheckCircle2, FileText, Info } from 'lucide-react';
import { FOLLOW_UP_STATES } from '../data/sectorsAndQuestions';
import { ActionCommitment, FollowUpStatus } from '../types/entreNos';
import { PrintableRouteSheet } from './PrintableRouteSheet';

interface FollowUpViewProps {
  commitments: ActionCommitment[];
  onUpdateStatus: (commitmentId: string, status: FollowUpStatus, note?: string) => void;
  onStartNewJourney: () => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({
  commitments,
  onUpdateStatus,
  onStartNewJourney,
}) => {
  const [selectedPrintId, setSelectedPrintId] = useState<string | null>(null);

  const activePrintItem = commitments.find((c) => c.id === selectedPrintId) ?? null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="no-print">
        <p className="text-xs font-semibold tracking-wide text-blue-800 mb-1">
          Seguimiento voluntario y cambio de comportamiento
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Tus compromisos guardados y avance real
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl">
          Actualiza manualmente en qué paso vas. Abrir un enlace comercial o descargar la ficha no marca el control como instalado: tú decides cuándo registrar cada avance real.
        </p>
      </div>

      {commitments.length === 0 ? (
        <div className="no-print bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <p className="font-display text-lg font-bold text-slate-900">
            Aún no tienes compromisos guardados en este navegador
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Completa los 6 momentos del recorrido para definir un primer paso y hacer seguimiento voluntario desde aquí.
          </p>
          <button
            type="button"
            onClick={onStartNewJourney}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
          >
            Iniciar recorrido
          </button>
        </div>
      ) : (
        <div className="no-print space-y-6">
          {commitments.map((item) => {
            const currentMeta = FOLLOW_UP_STATES.find((s) => s.id === item.followUpStatus);
            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-950">{item.companyName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.sectorName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">Meta: {item.targetDate}</span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-slate-900 mt-1">
                      {item.selectedControl.name}
                    </h2>
                    <p className="text-sm text-slate-700 mt-1">
                      <strong>Primer paso:</strong> {item.firstStep} ·{' '}
                      <strong>Encargado:</strong> {item.responsiblePerson}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPrintId(selectedPrintId === item.id ? null : item.id)
                    }
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-blue-900 text-blue-950 hover:bg-blue-50 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    {selectedPrintId === item.id ? 'Ocultar ficha PDF' : 'Ver / imprimir ficha PDF'}
                  </button>
                </div>

                <div>
                  <p className="text-xs font-bold text-blue-950 mb-3">
                    Estado actual declarado ({currentMeta?.label}):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {FOLLOW_UP_STATES.map((stateOpt) => {
                      const active = item.followUpStatus === stateOpt.id;
                      return (
                        <button
                          key={stateOpt.id}
                          type="button"
                          onClick={() => onUpdateStatus(item.id, stateOpt.id)}
                          className={`text-left p-3.5 rounded-xl border transition-colors min-h-[68px] cursor-pointer ${
                            active
                              ? 'border-blue-900 bg-yellow-50/80 ring-1 ring-blue-900'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono-tabular text-[11px] font-bold text-blue-900">
                              0{stateOpt.stepOrder}
                            </span>
                            {active && (
                              <CheckCircle2
                                className="w-4 h-4 text-blue-900 shrink-0"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">
                            {stateOpt.label}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                            {stateOpt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Info className="w-4 h-4 text-blue-800 shrink-0" aria-hidden="true" />
                  <span>
                    Última actualización declarada:{' '}
                    <span className="font-mono-tabular">
                      {new Date(item.followUpUpdatedAt).toLocaleString('es-CO')}
                    </span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {activePrintItem && (
        <div className="pt-2">
          <PrintableRouteSheet commitment={activePrintItem} />
        </div>
      )}
    </section>
  );
};
