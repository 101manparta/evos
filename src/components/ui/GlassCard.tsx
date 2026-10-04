import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  interactive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-[#0B0F14]/75 backdrop-blur-xl border border-white/[0.08] transition-all duration-200 ${
        glow ? 'shadow-[0_0_28px_rgba(16,185,129,0.08)] border-emerald-500/25' : 'hover:border-white/[0.14]'
      } ${interactive ? 'cursor-pointer hover:bg-[#0E141B]/90 hover:scale-[1.006] active:scale-[0.998]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
