import React from 'react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { EvosLogo } from '../brand/EvosLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: EVOS Brand with tagline */}
          <div className="flex items-center gap-3">
            <EvosLogo size="sm" withSubtext={true} animated={true} />
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300">
            <button onClick={() => onNavigate('/')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('/');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button onClick={() => onNavigate('/pricing')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Pricing
            </button>
            <button onClick={() => onNavigate('/platform')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => onNavigate('/solutions')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Contact
            </button>
          </nav>

          {/* Right: Social Media & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2.5">
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="hover:text-emerald-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                onClick={(e) => e.preventDefault()}
                aria-label="LinkedIn"
                className="hover:text-emerald-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => e.preventDefault()}
                aria-label="YouTube"
                className="hover:text-emerald-400 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} EVOS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
