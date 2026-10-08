import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { EvosLogo } from '../brand/EvosLogo';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/#features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/platform' },
    { label: 'Contact', path: '/solutions' },
  ];

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const id = path.replace('/#', '');
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const id = path.replace('/#', '');
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#06080A]/90 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand: EVOS Animated Emblem & Wordmark */}
        <button
          onClick={() => handleLinkClick('/')}
          className="cursor-pointer focus:outline-none text-left"
          aria-label="EVOS Fleet Cost Intelligence"
        >
          <EvosLogo size="sm" withSubtext={false} animated={true} />
        </button>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? currentPath === '/'
                : currentPath === link.path;

            return (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.path)}
                className={`relative py-1 cursor-pointer transition-colors text-xs tracking-wide uppercase font-semibold ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onNavigate('/login')}
            className="px-5 py-2 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-5 py-2 rounded-full text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-1.5 cursor-pointer group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070A0F]/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.path)}
                className="text-left py-2 text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/login');
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-200 bg-white/[0.05] rounded-full border border-white/[0.1]"
            >
              Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/dashboard');
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
