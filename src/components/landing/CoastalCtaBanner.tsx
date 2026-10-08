import React from 'react';
import { ArrowRight, Play, Leaf, TrendingUp } from 'lucide-react';
import { EvosLogo } from '../brand/EvosLogo';

interface CoastalCtaBannerProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const CoastalCtaBanner: React.FC<CoastalCtaBannerProps> = ({ onGetStarted, onExplore }) => {
  return (
    <section className="py-16 bg-[#050608]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Scenic Panoramic Coastal Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.12] min-h-[380px] shadow-2xl flex flex-col justify-center p-8 sm:p-12 lg:p-14">
          {/* Background Image matching reference */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/bottom_coastal_ev_drive_1791117494321.jpg"
              alt="Electric Vehicle Driving Along Scenic Coastal Road"
              className="w-full h-full object-cover object-center brightness-60"
              referrerPolicy="no-referrer"
            />
            {/* Measured scrim overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/95 via-[#050608]/75 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <EvosLogo variant="icon" size="xs" animated={true} />
                <span>Bersama Menuju Mobilitas Berkelanjutan</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
                Kelola Fleet EV Anda <br />
                Dengan Lebih Cerdas
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                Tingkatkan efisiensi, kurangi biaya, dan wujudkan bisnis yang lebih hijau bersama EVOS.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 text-black text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer group"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onExplore}
                  className="px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] text-white text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer backdrop-blur-md"
                >
                  <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-white text-white translate-x-0.5" />
                  </div>
                  <span>Lihat Demo</span>
                </button>
              </div>
            </div>

            {/* Right: Floating CO2 Reduced Badge matching reference */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="px-5 py-4 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/[0.15] shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">CO₂ Reduced</span>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    12.8 <span className="text-xs font-normal text-slate-400">ton</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-0.5 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>+ 24%</span>
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
