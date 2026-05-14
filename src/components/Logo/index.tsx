import type { LogoProps } from './Logo.interfaces';

export const Logo = ({ variant = 'header' }: LogoProps) => {
  return (
    <div className="flex items-center gap-3 group">
      {/* Icon */}
      <div className="relative flex-shrink-0">
        <svg
          width={variant === 'footer' ? 44 : 36}
          height={variant === 'footer' ? 44 : 36}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 group-hover:scale-110"
        >
          {/* Film frame bg */}
          <rect x="2" y="4" width="40" height="30" rx="3" fill="url(#logo-gold)" />
          {/* Clapperboard top */}
          <path
            d="M2 12h40v-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4Z"
            fill="#1a1a26"
            stroke="url(#logo-gold)"
            strokeWidth="1.5"
          />
          {/* Clapperboard stripes */}
          <path d="M10 12 6 6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 12 14 6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 12 22 6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          <path d="M34 12 30 6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          {/* Film sprocket holes */}
          <rect x="7" y="18" width="4" height="3" rx="0.5" fill="#1a1a26" opacity="0.4" />
          <rect x="14" y="18" width="4" height="3" rx="0.5" fill="#1a1a26" opacity="0.4" />
          <rect x="21" y="18" width="4" height="3" rx="0.5" fill="#1a1a26" opacity="0.4" />
          <rect x="28" y="18" width="4" height="3" rx="0.5" fill="#1a1a26" opacity="0.4" />
          <rect x="35" y="18" width="4" height="3" rx="0.5" fill="#1a1a26" opacity="0.4" />
          {/* Projector beam */}
          <path
            d="M22 34c8 0 14-2 14-2s-4-3-14-3-14 3-14 3 6 2 14 2Z"
            fill="url(#logo-beam)"
            opacity="0.6"
          />
          {/* Star accent */}
          <circle cx="22" cy="22" r="3" fill="#0a0a0f" opacity="0.3" />
          <text x="22" y="24" textAnchor="middle" fill="#FFD700" fontSize="4" fontWeight="bold" fontFamily="Bebas Neue">FN</text>
          {/* Gradients */}
          <defs>
            <linearGradient id="logo-gold" x1="0" y1="0" x2="44" y2="44">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#CCA800" />
            </linearGradient>
            <linearGradient id="logo-beam" x1="22" y1="34" x2="22" y2="38">
              <stop stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-['Bebas_Neue'] tracking-wider text-gold-500 group-hover:text-gold-600 transition-colors ${
            variant === 'footer' ? 'text-3xl' : 'text-xl'
          }`}
        >
          FILMES
        </span>
        <span
          className={`font-['Bebas_Neue'] tracking-widest text-white/80 group-hover:text-white transition-colors ${
            variant === 'footer' ? 'text-xl -mt-1' : 'text-sm -mt-0.5'
          }`}
        >
          NOVOS
        </span>
      </div>
    </div>
  );
};
