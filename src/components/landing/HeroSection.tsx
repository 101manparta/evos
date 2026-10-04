import React, { useState } from 'react';
import { ArrowRight, Play, Battery, TrendingDown, CarFront, Zap, Eye } from 'lucide-react';
import { VehicleCanvas } from '../3d/VehicleCanvas';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onExplore }) => {
  const [viewMode, setViewMode] = useState<'cinematic' | '3d'>('cinematic');

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#050608] via-[#07090D] to-[#050608]">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-emerald-500/[0.05] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-teal-500/[0.04] blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Typography & Action Buttons */}
          <div className="lg:col-span-6 space-y-6">
            {/* Small Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EV Fleet Management SaaS</span>
            </div>

            {/* Main Headline matching reference */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Syne',sans-serif] font-black tracking-tight text-white leading-[1.08] text-balance">
              Smarter Fleet. <br />
              Lower Cost. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                Greener Tomorrow.
              </span>
            </h1>

            {/* Indonesian Subtitle from reference */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Kelola seluruh operasional mobil listrik bisnis Anda dalam satu platform. Monitoring, biaya, pengisian daya, maintenance, hingga laporan — semua lebih mudah, cepat dan transparan.
            </p>

            {/* CTAs matching reference */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 text-black text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_28px_rgba(16,185,129,0.35)] cursor-pointer group"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExplore}
                className="px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-white text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-white text-white translate-x-0.5" />
                </div>
                <span>Lihat Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual with 3 Floating Glass Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#0A0D14] shadow-2xl min-h-[460px] flex items-center justify-center">
              {viewMode === 'cinematic' ? (
                <div className="relative w-full h-[460px] overflow-hidden">
                  <img
                    src="/src/assets/images/hero_ev_charging_station_1791117481702.jpg"
                    alt="EVOS Electric Vehicle Fleet at Charging Station"
                    className="w-full h-full object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-black/30" />
                </div>
              ) : (
                <div className="w-full h-[460px]">
                  <VehicleCanvas carColor="#0A0E17" className="w-full h-full" />
                </div>
              )}

              {/* View Switcher Toggle (Cinematic vs Interactive 3D) */}
              <div className="absolute top-4 right-4 z-30">
                <button
                  onClick={() => setViewMode(viewMode === 'cinematic' ? '3d' : 'cinematic')}
                  className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-emerald-400" />
                  <span>{viewMode === 'cinematic' ? '3D Interactive Twin' : 'Cinematic View'}</span>
                </button>
              </div>

              {/* FLOATING GLASS BADGE 1: Battery Level (Top Left) */}
              <div className="absolute top-8 left-6 z-20 animate-in fade-in duration-500">
                <div className="px-4 py-3 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/[0.15] shadow-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Battery className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Battery Level</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold font-mono text-white tabular-nums">78%</span>
                    </div>
                    {/* Glowing progress bar */}
                    <div className="w-24 h-1.5 bg-white/[0.1] rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING GLASS BADGE 2: Total Cost Today (Top Right) */}
              <div className="absolute top-20 right-6 z-20 animate-in fade-in duration-700">
                <div className="px-4 py-3 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/[0.15] shadow-2xl space-y-0.5">
                  <span className="text-[11px] text-slate-400 block font-medium">Total Cost Today</span>
                  <div className="text-xl font-bold font-mono text-white tabular-nums">
                    Rp 1.240.000
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <TrendingDown className="w-3 h-3" />
                    <span>12% vs benchmark</span>
                  </div>
                </div>
              </div>

              {/* FLOATING GLASS BADGE 3: Active Vehicles (Bottom Right) */}
              <div className="absolute bottom-8 right-6 z-20 animate-in fade-in duration-900">
                <div className="px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/[0.15] shadow-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CarFront className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Active Vehicles</span>
                    <div className="text-xl font-bold font-mono text-white tabular-nums">
                      37 <span className="text-slate-400 font-normal text-xs">/ 42</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-medium">Online Fleet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
