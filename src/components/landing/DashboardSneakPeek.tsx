import React from 'react';
import { ArrowRight, LayoutDashboard, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface DashboardSneakPeekProps {
  onLaunchDemo: () => void;
}

export const DashboardSneakPeek: React.FC<DashboardSneakPeekProps> = ({ onLaunchDemo }) => {
  return (
    <section className="py-24 border-t border-white/[0.06] relative overflow-hidden bg-gradient-to-b from-[#05070B] via-[#080C12] to-[#050607]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              Ready For Immediate Deployment
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
              Experience The Live Platform Now.
            </h2>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Explore the fully interactive operational console with Indonesian fleet datasets, real-time variance drilldowns, and automated anomaly detection.
            </p>
          </div>

          <button
            onClick={onLaunchDemo}
            className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer group shrink-0"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Launch Live Interactive Console</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dashboard Frame Preview */}
        <div className="relative rounded-3xl bg-[#090D13] border border-white/[0.12] shadow-2xl p-2 md:p-3 overflow-hidden">
          <div className="rounded-2xl bg-[#06080C] border border-white/[0.08] overflow-hidden">
            {/* Mock Top bar in preview */}
            <div className="h-10 px-4 bg-[#080B10] border-b border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                </div>
                <span className="text-[11px] text-slate-400 pl-2">app.evos-intelligence.com/dashboard</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">LIVE MOCK ENVIRONMENT</span>
            </div>

            {/* Visual Preview Content with High-Resolution Cockpit Image */}
            <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden">
              <img
                src="/src/assets/images/ev_telemetry_cockpit_1791116788096.jpg"
                alt="EVOS Telemetry Cockpit"
                className="w-full h-full object-cover object-center brightness-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080C] via-transparent to-transparent" />

              {/* Floating Overlay Card inside frame */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#070A0F]/85 backdrop-blur-xl border border-white/[0.1]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bali Mobility Corp Fleet (20 EVs)</h4>
                    <p className="text-xs text-slate-400">18 In Service · 2 Fast Charging · 0 Critical Safety Hazards</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">TOTAL MONTHLY COST</span>
                    <span className="text-base font-bold text-white tabular-nums">Rp 8.640.000</span>
                  </div>
                  <button
                    onClick={onLaunchDemo}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold font-sans cursor-pointer transition-colors"
                  >
                    Open Console
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
