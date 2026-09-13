import React from 'react';

interface AcademiaLogoProps {
  size?: number;
  showText?: boolean;
}

export const AcademiaLogo: React.FC<AcademiaLogoProps> = ({ size = 36, showText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Brand Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          <linearGradient id="academiaPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          <linearGradient id="academiaAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366F1" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Hexagonal Shield Ring */}
        <polygon
          points="32,4 58,19 58,45 32,60 6,45 6,19"
          stroke="url(#academiaPrimary)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />

        {/* Geometric Mortarboard Peak */}
        <path
          d="M32 12L54 24L32 36L10 24L32 12Z"
          fill="url(#academiaPrimary)"
          filter="url(#glow)"
        />

        {/* Mortarboard Underbody / Pedestal */}
        <path
          d="M17 31V41C17 41 23 47 32 47C41 47 47 41 47 41V31L32 39L17 31Z"
          fill="#3730A3"
        />

        {/* Dynamic Verification Tassel & Node */}
        <path
          d="M48 27.5V43"
          stroke="url(#academiaAccent)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="48" cy="45.5" r="3.5" fill="url(#academiaAccent)" />

        {/* Central Credential Core Node */}
        <circle cx="32" cy="24" r="3" fill="#FFFFFF" />
      </svg>

      {/* Brand Typographic Wordmark */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center tracking-tight font-black text-2xl">
            <span className="text-slate-900 dark:text-white transition-colors">Academ</span>
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">ia</span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.22em] text-slate-400 dark:text-slate-500 uppercase mt-0.5">
            Capacity Engine
          </span>
        </div>
      )}
    </div>
  );
};

export default AcademiaLogo;