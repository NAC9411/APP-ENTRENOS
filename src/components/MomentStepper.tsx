import React from 'react';
import { MomentStep } from '../types/entreNos';

interface MomentStepperProps {
  currentStep: MomentStep;
  maxReachedStep: MomentStep;
  onSelectStep: (step: MomentStep) => void;
}

const MOMENT_LABELS: { step: MomentStep; short: string }[] = [
  { step: 1, short: 'Tu realidad' },
  { step: 2, short: 'Qué frena' },
  { step: 3, short: 'Barrera clave' },
  { step: 4, short: 'Percepción' },
  { step: 5, short: 'Soluciones' },
  { step: 6, short: 'Primer paso' },
];

export const MomentStepper: React.FC<MomentStepperProps> = ({
  currentStep,
  maxReachedStep,
  onSelectStep,
}) => {
  return (
    <div className="no-print bg-blue-950 text-white border-b border-blue-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="text-xs font-medium text-blue-100">
            La confianza también nos protege
          </p>
          <span className="font-mono-tabular text-xs font-semibold text-yellow-300 whitespace-nowrap">
            Momento {currentStep} de 6
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {MOMENT_LABELS.map(({ step, short }) => {
            const isCurrent = step === currentStep;
            const isAccessible = step <= maxReachedStep;
            const isDone = step < currentStep;

            return (
              <button
                key={step}
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onSelectStep(step)}
                className={`text-left rounded-md px-2 py-1.5 transition-colors min-h-[40px] flex flex-col justify-center ${
                  isCurrent
                    ? 'bg-yellow-400 text-blue-950 font-bold'
                    : isDone
                      ? 'bg-blue-800/80 text-white hover:bg-blue-800 cursor-pointer'
                      : isAccessible
                        ? 'bg-blue-900/70 text-blue-100 hover:bg-blue-800 cursor-pointer'
                        : 'bg-blue-900/40 text-blue-300/60 cursor-not-allowed'
                }`}
              >
                <span className="font-mono-tabular text-[10px] leading-tight block">
                  0{step}
                </span>
                <span className="text-[11px] sm:text-xs truncate block leading-tight">
                  {short}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
