import React from 'react';
import { ArrowRight, Cpu, Database, ShieldCheck, Zap, Server, Network } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface PlatformPageProps {
  onGetStarted: () => void;
}

export const PlatformPage: React.FC<PlatformPageProps> = ({ onGetStarted }) => {
  return (
    <div className="pt-28 pb-20 space-y-20 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Hero */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Platform Architecture
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
            High-Precision Financial Telemetry Architecture.
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            EVOS connects directly with EV CAN-bus protocols, commercial fast charger APIs, and ERP systems to compute accurate cost-per-kilometer in realtime.
          </p>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <GlassCard className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">01. Direct CAN-Bus Telematics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native high-voltage battery state-of-charge, cell balance metrics, inverter temperatures, and instantaneous regenerative braking recovery captured at 1Hz sampling frequency.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">02. Dynamic Tariff Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically ingests commercial PLN I-2 and B-2 electricity tariff brackets, distinguishing between off-peak base rates and daytime peak public charging penalties.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">03. Automated Leak Alarms</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algorithmic outlier detection benchmarks energy consumption against vehicle model family and terrain profiles to uncover parasitic draws and unauthorized repairs.
            </p>
          </GlassCard>
        </div>

        {/* Ready to Deploy Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C151F] via-[#091016] to-[#06080C] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Ready to test on your commercial fleet?
            </h3>
            <p className="text-xs text-slate-400">
              Deploy our plug-and-play telemetry gateway or integrate via modern REST API.
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Live Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
