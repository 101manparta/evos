import React from 'react';

export interface EvosLogoProps {
  /** Display variant: horizontal lockup, icon only, standalone circular badge, or hero centerpiece */
  variant?: 'horizontal' | 'icon' | 'badge' | 'hero';
  /** Size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  /** Whether to show the EVOS wordmark */
  withText?: boolean;
  /** Whether to show "EV FLEET COST INTELLIGENCE" tagline */
  withSubtext?: boolean;
  /** Enable dynamic neon breathing, sheen sweep, and hover animations */
  animated?: boolean;
  /** Glow intensity preset */
  glow?: 'subtle' | 'high' | 'none';
  /** Additional container classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

export const EvosLogo: React.FC<EvosLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  withText = true,
  withSubtext = false,
  animated = true,
  glow = 'subtle',
  className = '',
  onClick,
}) => {
  // Dimensions mapping for emblem badge
  const sizeMap = {
    xs: { emblem: 'w-6 h-6', title: 'text-base', subtext: 'text-[8px]', spark: 'w-1 h-1' },
    sm: { emblem: 'w-8 h-8', title: 'text-lg', subtext: 'text-[9px]', spark: 'w-1.5 h-1.5' },
    md: { emblem: 'w-10 h-10', title: 'text-xl', subtext: 'text-[10px]', spark: 'w-2 h-2' },
    lg: { emblem: 'w-14 h-14', title: 'text-2xl', subtext: 'text-[11px]', spark: 'w-2.5 h-2.5' },
    xl: { emblem: 'w-20 h-20', title: 'text-3xl', subtext: 'text-xs', spark: 'w-3 h-3' },
    hero: { emblem: 'w-32 h-32 md:w-40 md:h-40', title: 'text-4xl md:text-5xl', subtext: 'text-xs md:text-sm', spark: 'w-4 h-4' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const glowStyles = {
    none: '',
    subtle: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]',
    high: 'drop-shadow-[0_0_24px_rgba(0,245,160,0.6)] drop-shadow-[0_0_40px_rgba(16,185,129,0.4)]',
  }[glow];

  const renderEmblem = () => (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 select-none group/emblem ${currentSize.emblem} ${
        animated ? 'transition-all duration-300 group-hover:scale-105' : ''
      }`}
    >
      {/* 1. Ambient Background Pulse Glow */}
      {glow !== 'none' && (
        <div
          className={`absolute -inset-1 rounded-full pointer-events-none blur-md opacity-70 transition-opacity duration-500 group-hover:opacity-100 ${
            animated ? 'animate-[evos-glow-pulse_5s_ease-in-out_infinite]' : ''
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(0,245,160,0.4) 0%, rgba(16,185,129,0.2) 60%, transparent 100%)',
          }}
        />
      )}

      {/* 2. Outer Rotating Neon Ring Flare */}
      {animated && (
        <div
          className="absolute -inset-[2px] rounded-full pointer-events-none opacity-40 group-hover:opacity-85 transition-opacity duration-300 animate-[evos-ring-rotate_14s_linear_infinite]"
          style={{
            background:
              'conic-gradient(from 0deg, #10B981 0deg, #00F5A0 60deg, transparent 130deg, transparent 230deg, #00F5A0 300deg, #10B981 360deg)',
          }}
        />
      )}

      {/* 3. Outer Glass Rim Frame */}
      <div className="absolute inset-0 rounded-full border border-emerald-400/40 group-hover:border-emerald-300 transition-colors duration-300 shadow-[inset_0_0_8px_rgba(16,185,129,0.3)] pointer-events-none z-10" />

      {/* 4. Core Emblem Badge Artwork */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#05080A] shadow-[0_4px_20px_rgba(0,0,0,0.8)] z-0">
        <img
          src="/evos_logo.png"
          alt="EVOS Neon Emblem"
          className={`w-full h-full object-cover rounded-full ${glowStyles} ${
            animated ? 'transition-transform duration-500 group-hover:scale-110' : ''
          }`}
          loading="eager"
          decoding="async"
        />

        {/* 5. Sweeping Specular Sheen Light Beam */}
        {animated && (
          <div
            className="absolute inset-0 pointer-events-none z-10 animate-[evos-sheen-sweep_7s_cubic-bezier(0.4,0,0.2,1)_infinite]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(0,245,160,0.35) 50%, rgba(255,255,255,0.15) 55%, transparent 75%)',
            }}
          />
        )}

        {/* 6. Subtle Energy Spark Highlight at core junction */}
        {animated && (
          <div
            className={`absolute top-[44%] left-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none bg-white blur-[1px] shadow-[0_0_8px_#00F5A0] z-20 animate-[evos-flare-pulse_3s_ease-in-out_infinite] ${currentSize.spark}`}
          />
        )}
      </div>
    </div>
  );

  // If icon-only variant
  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="EVOS Intelligence"
      >
        {renderEmblem()}
      </div>
    );
  }

  // If standalone badge (e.g. for hero, auth, or showcase modal)
  if (variant === 'badge' || variant === 'hero') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center group cursor-default ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <div className="relative mb-3">
          {renderEmblem()}
        </div>

        {withText && (
          <div className="space-y-0.5">
            <span
              className={`font-['Syne',sans-serif] font-black tracking-tight text-white block ${currentSize.title} drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] group-hover:text-emerald-300 transition-colors`}
            >
              EVOS
            </span>
            {(withSubtext || variant === 'hero') && (
              <span
                className={`font-mono uppercase tracking-[0.22em] text-emerald-400 font-semibold block ${currentSize.subtext}`}
              >
                EV FLEET COST INTELLIGENCE
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default: Horizontal Lockup (ideal for Navbar, Sidebar header, Footer)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 group text-left ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {renderEmblem()}

      {withText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-['Syne',sans-serif] font-black tracking-tight text-white block leading-none ${currentSize.title} group-hover:text-emerald-300 transition-colors`}
            >
              EVOS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-emerald-300 animate-pulse" />
          </div>
          {withSubtext && (
            <span
              className={`font-mono text-emerald-400/90 font-medium tracking-[0.16em] uppercase block leading-tight mt-0.5 ${currentSize.subtext}`}
            >
              FLEET COST INTEL
            </span>
          )}
        </div>
      )}
    </div>
  );
};
