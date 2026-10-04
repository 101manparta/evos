import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Route, Zap, MapPin, Compass, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { formatIdr } from '../../lib/formatters';

export const WhyDrilldownSection: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(true);

  const variances = [
    {
      factor: 'Charging Tariff Surcharge',
      delta: 8000,
      positive: true,
      explanation: 'Vehicle conducted an unscheduled fast top-up at public charger at peak commercial rate rather than scheduled depot overnight rate.',
      icon: Zap,
    },
    {
      factor: 'Airport Extended Waiting Parking',
      delta: 10000,
      positive: true,
      explanation: 'Guest flight delayed 45 minutes at Ngurah Rai International Arrival VIP pickup lane.',
      icon: MapPin,
    },
    {
      factor: 'Traffic & Detour Delay',
      delta: 4000,
      positive: true,
      explanation: 'Heavy stop-and-go congestion along Sunset Road added 15 minutes cabin air conditioning drain.',
      icon: Compass,
    },
    {
      factor: 'Maintenance Allocation Credit',
      delta: -2000,
      positive: false,
      explanation: 'Smooth regenerative braking curve yielded slightly lower brake friction pad wear than standard profile.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-24 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            Explainable Fleet Intelligence
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
            Don't Just See What Happened. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              Understand Why.
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Conventional GPS telematics report that a route cost more than budgeted. EVOS decomposes the exact operational factors so you can prevent recurrence.
          </p>
        </div>

        {/* The Why Interactive Box */}
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-6 md:p-8 overflow-hidden border-emerald-500/20 shadow-2xl">
            {/* Header Trip Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Route className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TRIP-8842 · Airport to Ubud Resort</span>
                  <span>·</span>
                  <span>48.5 km</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                    {formatIdr(153000)}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 tabular-nums">
                    +13.3% above estimate (Rp 133.000)
                  </span>
                </div>
              </div>

              {/* The "Why?" Button */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer group"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Why Did This Cost Spike?</span>
                {expanded ? (
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
            </div>

            {/* Expandable Root-Cause Breakdown */}
            {expanded && (
              <div className="pt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">VARIANCE DECOMPOSITION</span>
                  <span className="font-mono text-amber-400 font-semibold tabular-nums">
                    Total Net Variance: +Rp 20.000
                  </span>
                </div>

                <div className="space-y-2.5">
                  {variances.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.factor}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-slate-300" />
                            </div>
                            <span className="text-xs font-semibold text-white">{item.factor}</span>
                          </div>
                          <span
                            className={`text-xs font-mono font-bold tabular-nums ${
                              item.positive ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {item.positive ? '+' : ''}
                            {formatIdr(item.delta)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 pl-8 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                  <span>Prescribed Protocol: Remind driver to utilize Denpasar Hub Level 2 charger prior to airport shift.</span>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
