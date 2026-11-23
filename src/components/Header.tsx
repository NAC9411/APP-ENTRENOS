import React from 'react';
import { AppView } from '../types/entreNos';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onResetJourney: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onResetJourney,
}) => {
  const navItems: { id: AppView; label: string }[] = [
    { id: 'journey', label: 'Recorrido' },
    { id: 'followup', label: 'Seguimiento' },
    { id: 'metrics', label: 'Indicadores' },
    { id: 'deploy', label: 'Publicación' },
  ];

  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => onSelectView('journey')}
          className="text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded-md shrink-0 cursor-pointer"
        >
          <BrandLogo compact />
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`py-2 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-800 text-blue-950'
                    : 'border-transparent text-slate-600 hover:text-blue-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onResetJourney}
            className="min-h-[40px] px-4 py-2 text-xs sm:text-sm font-semibold text-blue-950 bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            Nuevo recorrido
          </button>
        </div>
      </div>

      {/* Navegación compacta para celular debajo del header sin exceder altura */}
      <nav
        className="md:hidden border-t border-slate-100 px-2 flex items-center justify-around bg-white"
        aria-label="Navegación móvil"
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`min-h-[44px] px-2 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-800 text-blue-950 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
