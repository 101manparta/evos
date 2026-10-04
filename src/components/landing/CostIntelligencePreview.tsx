import React, { useState } from 'react';
import { Zap, Wrench, User, MapPin, ChevronRight, Layers } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { formatIdr } from '../../lib/formatters';

export const CostIntelligencePreview: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const breakdown = [
    {
      name: 'Charging & Energy',
      cost: 45900,
      icon: Zap,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400',
      percentage: '20.6%',
      details: '27 kWh delivered @ PLN tariff Rp 1.700/kWh depot rate',
    },
    {
      name: 'Maintenance Allocation',
      cost: 27000,
      icon: Wrench,
      color: 'text-teal-400',
      bgColor: 'bg-teal-400',
      percentage: '12.1%',
      details: 'Tire wear allowance, brake pad wear credit & fluid reserves',
    },
    {
      name: 'Driver Allowance',
      cost: 100000,
      icon: User,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400',
      percentage: '44.9%',
      details: 'Standard shift wage per scheduled transfer route',
    },
    {
      name: 'Parking & Toll Access',
      cost: 50000,
      icon: MapPin,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400',
      percentage: '22.4%',
      details: 'Bali Mandara toll road gate + Airport terminal access fee',
    },
  ];

  const totalTripCost = 222900;
  const tripDistanceKm = 180;
  const costPerKm = 1238;

  return (
    <section id="intelligence" className="py-24 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Big Metric */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
                Uncompromising Granularity
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
                See The True Cost Of Every Kilometer.
              </h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Most fleet managers only calculate fuel costs. EVOS incorporates battery wear amortization, driver operational allocations, dynamic electricity tariffs, and gate fees into one mathematically verified number.
            </p>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">
                TRUE COST / KM
              </span>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold tabular-nums text-white">
                {formatIdr(costPerKm)}
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
                <span>Calculated over 180 km cross-island route sample</span>
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-6">
              <div>
                <span className="text-slate-400 block">TOTAL TRIP COST</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {formatIdr(totalTripCost)}
                </span>
              </div>
              <div className="h-8 w-px bg-white/[0.1]" />
              <div>
                <span className="text-slate-400 block">DISTANCE LOGGED</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {tripDistanceKm} km
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Breakdown Canvas */}
          <div className="lg:col-span-7">
            <GlassCard className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">Trip Cost Component Stack</h3>
                  <p className="text-xs text-slate-400">Hover components to inspect unit contribution</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  REALTIME AUDIT
                </span>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="h-4 w-full rounded-full bg-white/[0.06] overflow-hidden flex p-0.5 gap-1">
                {breakdown.map((item, idx) => (
                  <div
                    key={item.name}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ width: item.percentage }}
                    className={`h-full rounded-full transition-all cursor-pointer ${item.bgColor} ${
                      hoveredIndex === idx ? 'scale-y-125 brightness-125' : hoveredIndex !== null ? 'opacity-40' : 'opacity-85'
                    }`}
                  />
                ))}
              </div>

              {/* Cost Rows */}
              <div className="space-y-3">
                {breakdown.map((item, idx) => {
                  const Icon = item.icon;
                  const isHovered = hoveredIndex === idx;
                  return (
                    <div
                      key={item.name}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-white/[0.06] border-emerald-500/40 translate-x-1'
                          : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                            <Icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white block">{item.name}</span>
                            <span className="text-[11px] text-slate-400">{item.details}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold font-mono text-white tabular-nums block">
                            {formatIdr(item.cost)}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{item.percentage}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
