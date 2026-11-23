import React, { useState } from 'react';

interface BrandLogoProps {
  compact?: boolean;
}

const OFFICIAL_LOGO_PATH =
  '/assets/aistudio/Entre_manos__la_confianza_nos_protege_362cf000.png';

/**
 * Logotipo oficial de ENTRE NOS ("La confianza también nos protege").
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2.5 shrink-0">
        {!imgFailed ? (
          <img
            src={OFFICIAL_LOGO_PATH}
            alt="Logo oficial de ENTRE NOS"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-11 w-auto object-contain shrink-0 rounded-md bg-white"
          />
        ) : (
          <svg
            width={32}
            height={32}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect width="40" height="40" rx="10" fill="#0F3D8A" />
            <path
              d="M20 7L31 11.6V19.6C31 26.2 26.3 31.6 20 33.4C13.7 31.6 9 26.2 9 19.6V11.6L20 7Z"
              fill="#1D4ED8"
              stroke="#FACC15"
              strokeWidth="2"
            />
          </svg>
        )}
        <span className="font-display font-extrabold tracking-tight text-blue-950 text-lg whitespace-nowrap shrink-0">
          ENTRE <span className="text-amber-500">NOS</span>
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center shrink-0">
      {!imgFailed ? (
        <img
          src={OFFICIAL_LOGO_PATH}
          alt="ENTRE NOS — La confianza también nos protege."
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="h-20 sm:h-24 w-auto object-contain bg-white rounded-xl p-1.5"
        />
      ) : (
        <div className="flex flex-col leading-none">
          <span className="font-display font-extrabold tracking-tight text-blue-950 text-xl whitespace-nowrap">
            ENTRE <span className="text-amber-500">NOS</span>
          </span>
          <span className="text-xs font-medium text-blue-800 whitespace-nowrap mt-1">
            La confianza también nos protege.
          </span>
        </div>
      )}
    </div>
  );
};
