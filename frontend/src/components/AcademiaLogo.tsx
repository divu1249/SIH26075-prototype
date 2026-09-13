import React from 'react';

interface AcademiaLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const AcademiaLogo: React.FC<AcademiaLogoProps> = ({
  size = 36,
  className = '',
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="academiaPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          <linearGradient id="academiaCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>

        {/* Outer Shield Hexagon */}
        <polygon
          points="32,4 58,19 58,45 32,60 6,45 6,19"
          stroke="url(#academiaPrimaryGrad)"
          strokeWidth="3"
          fill="none"
          opacity="0.3"
        />

        {/* Mortarboard Upper Diamond */}
        <path
          d="M32 12L54 24L32 36L10 24L32 12Z"
          fill="url(#academiaPrimaryGrad)"
        />

        {/* Lower Arch */}
        <path
          d="M18 31V41C18 41 24 47 32 47C40 47 46 41 46 41V31L32 39L18 31Z"
          fill="#3730A3"
        />

        {/* Verification Tassel & Indicator Node */}
        <path
          d="M48 27V42"
          stroke="url(#academiaCyanGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="48" cy="44.5" r="3" fill="#06B6D4" />
        <circle cx="32" cy="24" r="2.5" fill="#FFFFFF" />
      </svg>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Academ<span className="text-indigo-600 dark:text-cyan-400">ia</span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
            Capacity Engine
          </span>
        </div>
      )}
    </div>
  );
};

export default AcademiaLogo;