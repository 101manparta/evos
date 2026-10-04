import React, { useState } from 'react';
import { ArrowRight, Database, Cpu, Brain, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const DataToDecisionSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      num: '01',
      phase: 'DATA',
      title: 'Fleet Telemetry Stream',
      description: 'Continuous capture across all operational touchpoints without manual spreadsheets.',
      icon: Database,
      items: ['GPS Distance & Elevation', 'Depot vs Public Charging kWh', 'Toll & Airport Parking Surcharges', 'Scheduled Maintenance Logs'],
    },
    {
      num: '02',
      phase: 'CALCULATION',
      title: 'Realtime Cost Engine',
      description: 'Dynamically synthesizes fixed vehicle amortization with variable energy tariffs.',
      icon: Cpu,
      items: ['Dynamic Tariff Mapping (PLN Peak / Off-Peak)', 'Kilometer Marginal Cost', 'Battery Degradation Weighting', 'Driver Allowance Allocation'],
    },
    {
      num: '03',
      phase: 'INTELLIGENCE',
      title: 'EVOS Anomaly Intelligence',
      description: 'Isolates cost outliers by model family, shift times, and terrain differences.',
      icon: Brain,
      items: ['Peer Fleet Benchmarking', 'Root-Cause Variance Tracing', 'Phantom Drain Identification', 'HVAC Overconsumption Detection'],
    },
    {
      num: '04',
      phase: 'ACTION',
      title: 'Executive Business Action',
      description: 'Delivers clear operational directives that protect gross operating margins.',
      icon: CheckCircle2,
      items: ['Reallocate Unproductive Assets', 'Enforce Depot Charging Mandates', 'Claim Manufacturer Warranty Overhauls', 'Calibrate Driver Regeneration Profiles'],
    },
  ];

  return (
    <section id="platform" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            From Telemetry To Bottom-Line
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
            Turn Fleet Data Into Business Decisions.
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            EVOS is not an administrative tracking dashboard. It is an algorithmic decision engine engineered to protect EV fleet margins.
          </p>
        </div>

        {/* 4-Step Interactive Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === idx;
            return (
              <GlassCard
                key={s.num}
                glow={isSelected}
                interactive
                onClick={() => setActiveStep(idx)}
                className={`p-6 transition-all cursor-pointer ${
                  isSelected ? 'border-emerald-500/40 bg-[#0E151E]' : 'border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400">
                    {s.phase}
                  </span>
                  <span className="text-xs font-mono text-slate-400">STEP {s.num}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white mb-4">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{s.description}</p>
                <ul className="space-y-1.5 border-t border-white/[0.06] pt-3">
                  {s.items.map((it) => (
                    <li key={it} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
                      <span className="truncate">{it}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            );
          })}
        </div>

        {/* Live Empirical Outcome Showcase Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C141B] via-[#091016] to-[#070D12] border border-emerald-500/30 p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.06] blur-3xl pointer-events-none rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <AlertTriangle className="w-4 h-4" />
                <span>ACTIVE ANOMALY DETECTED</span>
              </div>
              <h4 className="text-xl font-bold text-white tracking-tight">
                Vehicle EV-021 costs 18% more per kilometer than fleet average.
              </h4>
              <p className="text-xs text-slate-400">
                Peer group: Executive Sedans · Denpasar Operations
              </p>
            </div>

            <div className="lg:col-span-5 border-y lg:border-y-0 lg:border-x border-white/[0.08] py-4 lg:py-0 lg:px-8 space-y-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Prescribed Engine Action
              </span>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                Investigate charging efficiency: shift 3 scheduled fast top-ups from peak public rates (Rp 2.500/kWh) to overnight depot slow AC wallboxes (Rp 1.700/kWh).
              </p>
            </div>

            <div className="lg:col-span-3 text-left lg:text-right space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">
                Potential Monthly Saving
              </span>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-400">
                Rp 1.240.000
              </div>
              <span className="text-[11px] text-slate-400 block">
                Annual projected recovery: Rp 14.88M
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
