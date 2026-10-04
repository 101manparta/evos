import React, { useState } from 'react';
import { Zap, Fuel, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { formatIdr } from '../../lib/formatters';

export const EvVsIceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'perTrip' | 'monthly' | 'annual'>('perTrip');

  const comparisonData = {
    perTrip: {
      evEnergy: 45900,
      iceFuel: 130000,
      evMaint: 27000,
      iceMaint: 45000,
      evTotal: 222900,
      iceTotal: 390000,
      saving: 167100,
      savingPercent: 42.8,
      unit: '/ trip (180 km sample)',
    },
    monthly: {
      evEnergy: 3240000,
      iceFuel: 9200000,
      evMaint: 1820000,
      iceMaint: 3400000,
      evTotal: 8640000,
      iceTotal: 17200000,
      saving: 8560000,
      savingPercent: 49.7,
      unit: '/ vehicle per month',
    },
    annual: {
      evEnergy: 38880000,
      iceFuel: 110400000,
      evMaint: 21840000,
      iceMaint: 40800000,
      evTotal: 103680000,
      iceTotal: 206400000,
      saving: 102720000,
      savingPercent: 49.7,
      unit: '20-vehicle fleet annual',
    },
  };

  const curr = comparisonData[activeTab];

  return (
    <section className="py-24 border-t border-white/[0.06] bg-[#070A0F]/70 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              Empirical Financial Comparison
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
              Know What You're Actually Saving.
            </h2>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Moving from internal combustion engine (ICE) vans and sedans to an electric fleet provides substantial operational dividend—if energy and maintenance leaks are rigorously governed.
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setActiveTab('perTrip')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'perTrip' ? 'bg-emerald-400 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Per Trip Basis
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'monthly' ? 'bg-emerald-400 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Vehicle
            </button>
            <button
              onClick={() => setActiveTab('annual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'annual' ? 'bg-emerald-400 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual Fleet
            </button>
          </div>
        </div>

        {/* Big Savings Metric Highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-4 p-8 rounded-2xl bg-gradient-to-br from-[#0C151B] to-[#070D11] border border-emerald-500/30 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider block mb-2">
                ESTIMATED NET SAVING {curr.unit}
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400 tabular-nums">
                {formatIdr(curr.saving)}
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Equivalent to a <span className="font-bold text-white">{curr.savingPercent}% reduction</span> in operating overhead.
              </p>
            </div>

            <div className="space-y-2 border-t border-white/[0.08] pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero tailpipe particulate emissions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Eliminates engine oil & transmission servicing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Regenerative braking doubles brake rotor lifecycle</span>
              </div>
            </div>
          </div>

          {/* Comparison Breakdown Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* EV Card */}
            <GlassCard glow className="p-6 space-y-5 border-emerald-500/30 bg-[#0A1017]/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Electric Fleet (EV)</h3>
                    <p className="text-[11px] text-emerald-400">EVOS Governed</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">OPTIMIZED</span>
              </div>

              <div className="space-y-3 border-t border-white/[0.08] pt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Energy (Charging kWh)</span>
                  <span className="font-mono font-bold text-white tabular-nums">{formatIdr(curr.evEnergy)}</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '35%' }} />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400">Maintenance & Wear</span>
                  <span className="font-mono font-bold text-white tabular-nums">{formatIdr(curr.evMaint)}</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '40%' }} />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400">Total Operational Cost</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums text-sm">{formatIdr(curr.evTotal)}</span>
                </div>
              </div>
            </GlassCard>

            {/* ICE Card */}
            <GlassCard className="p-6 space-y-5 border-white/[0.08] bg-[#0A0D11]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">Combustion Fleet (ICE)</h3>
                    <p className="text-[11px] text-slate-400">Diesel / Pertamax</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">BASELINE</span>
              </div>

              <div className="space-y-3 border-t border-white/[0.08] pt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Fuel (Pertamax / Solar)</span>
                  <span className="font-mono font-bold text-slate-300 tabular-nums">{formatIdr(curr.iceFuel)}</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500 rounded-full" style={{ width: '85%' }} />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400">Maintenance & Fluids</span>
                  <span className="font-mono font-bold text-slate-300 tabular-nums">{formatIdr(curr.iceMaint)}</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500 rounded-full" style={{ width: '75%' }} />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400">Total Operational Cost</span>
                  <span className="font-mono font-bold text-slate-300 tabular-nums text-sm">{formatIdr(curr.iceTotal)}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center font-mono">
          * Illustrative demo benchmarks calibrated against commercial Indonesian tariff rates (PLN B-2 / I-2 @ Rp 1.700/kWh) and commercial Pertamax fuel costs.
        </p>
      </div>
    </section>
  );
};
