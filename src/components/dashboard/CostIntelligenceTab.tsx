import React, { useState } from 'react';
import { Wallet, TrendingDown, Route, Zap, Wrench, User, HelpCircle, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { INITIAL_FLEET_METRICS, MOCK_VEHICLES } from '../../data/mockData';
import { formatIdr, formatIdrCompact } from '../../lib/formatters';

export const CostIntelligenceTab: React.FC = () => {
  const [selectedCostCategory, setSelectedCostCategory] = useState<string>('energy');
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  const metrics = INITIAL_FLEET_METRICS;
  const avgCostPerTrip = 142000;

  const costCategories = [
    {
      id: 'energy',
      name: 'Charging & Power Grid',
      cost: metrics.energyCostIdr,
      perKm: 174,
      percentage: '37.5%',
      icon: Zap,
      color: 'text-emerald-400',
      description: 'Blended off-peak depot AC wallboxes and public DC fast charging top-ups.',
      action: 'Target: Shift 12 remaining public day sessions to off-peak night slots for Rp 380K extra monthly gain.',
    },
    {
      id: 'driver',
      name: 'Driver Shift Allowance',
      cost: metrics.driverCostIdr,
      perKm: 151,
      percentage: '32.4%',
      icon: User,
      color: 'text-blue-400',
      description: 'Standard driver wages, route per diems, and airport overtime wait allowances.',
      action: 'Optimized driver shift scheduling reduces idle standby overtime by 8.4%.',
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Tire Wear',
      cost: metrics.maintenanceCostIdr,
      perKm: 98,
      percentage: '21.1%',
      icon: Wrench,
      color: 'text-teal-400',
      description: 'Tire rotations, brake pad amortizations, high-voltage coolant tests, and filter replacements.',
      action: 'Warranty recovery submission for EV-021 in progress (+Rp 3.2M recovery pending).',
    },
    {
      id: 'tolls',
      name: 'Tolls, Parking & Telemetry',
      cost: metrics.otherOperatingCostIdr,
      perKm: 42,
      percentage: '9.0%',
      icon: Route,
      color: 'text-purple-400',
      description: 'Bali Mandara toll expressway passes, airport terminal entry tariffs, and 4G IoT SIM cards.',
      action: 'Electronic toll automated discount card integration active.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Cost Intelligence Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            True marginal cost calculation across energy tariffs, battery depreciation, and operational overhead
          </p>
        </div>

        <button
          onClick={() => setShowWhyModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_16px_rgba(16,185,129,0.2)] cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Explain Cost Variance ("Why?")</span>
        </button>
      </div>

      {/* Primary 7-Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <GlassCard className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">Total Fleet Cost</span>
          <span className="text-lg font-bold font-mono text-white tabular-nums block">
            {formatIdrCompact(metrics.totalMonthlyCostIdr)}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">-4.2% MoM</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">Cost / KM</span>
          <span className="text-lg font-bold font-mono text-white tabular-nums block">
            Rp {metrics.costPerKmIdr}
          </span>
          <span className="text-[10px] text-slate-400">Target Rp 480</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">Avg Cost / Trip</span>
          <span className="text-lg font-bold font-mono text-white tabular-nums block">
            {formatIdr(avgCostPerTrip)}
          </span>
          <span className="text-[10px] text-slate-400">180 km avg</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">Energy Cost</span>
          <span className="text-lg font-bold font-mono text-cyan-400 tabular-nums block">
            {formatIdrCompact(metrics.energyCostIdr)}
          </span>
          <span className="text-[10px] text-slate-400">37.5% share</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">Maintenance</span>
          <span className="text-lg font-bold font-mono text-teal-400 tabular-nums block">
            {formatIdrCompact(metrics.maintenanceCostIdr)}
          </span>
          <span className="text-[10px] text-slate-400">21.1% share</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase">Driver Cost</span>
          <span className="text-lg font-bold font-mono text-blue-400 tabular-nums block">
            {formatIdrCompact(metrics.driverCostIdr)}
          </span>
          <span className="text-[10px] text-slate-400">32.4% share</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 block uppercase">Tolls & Other</span>
          <span className="text-lg font-bold font-mono text-purple-400 tabular-nums block">
            {formatIdrCompact(metrics.otherOperatingCostIdr)}
          </span>
          <span className="text-[10px] text-slate-400">9.0% share</span>
        </GlassCard>
      </div>

      {/* Cost By Vehicle Ranking Table */}
      <GlassCard className="overflow-hidden border-white/[0.08]">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Vehicle True Cost / KM Ranking</h3>
            <p className="text-xs text-slate-400">Identifies high-expenditure assets and model efficiency baselines</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">FLEET AVERAGE: RP 465 / KM</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-400 border-b border-white/[0.08] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Rank / Vehicle</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Cost / KM</th>
                <th className="py-3 px-4 font-semibold">Energy (kWh/100km)</th>
                <th className="py-3 px-4 font-semibold">Monthly Total</th>
                <th className="py-3 px-4 font-semibold">Performance State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {MOCK_VEHICLES.map((v, idx) => {
                const isHighCost = v.costPerKm > 600;
                return (
                  <tr key={v.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 font-semibold w-5">{idx + 1}.</span>
                        <span className="font-semibold text-white">{v.id}</span>
                        <span className="text-slate-400 truncate max-w-[140px]">({v.model})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{v.category}</td>
                    <td className="py-3 px-4 font-mono font-bold tabular-nums">
                      <span className={isHighCost ? 'text-amber-400' : 'text-emerald-400'}>
                        Rp {v.costPerKm}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                      {v.efficiencyKwhPer100km} kWh
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-white">
                      {formatIdr(v.monthlyCostIdr)}
                    </td>
                    <td className="py-3 px-4">
                      {isHighCost ? (
                        <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Cost Outlier (+{Math.round(((v.costPerKm - 465) / 465) * 100)}%)
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Optimal Benchmark
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Interactive Cost Category Drilldown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {costCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCostCategory === cat.id;
          return (
            <GlassCard
              key={cat.id}
              glow={isSelected}
              interactive
              onClick={() => setSelectedCostCategory(cat.id)}
              className={`p-5 space-y-3 cursor-pointer ${
                isSelected ? 'border-emerald-500/40 bg-[#0E151E]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {cat.percentage}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
                <div className="text-xl font-bold font-mono text-white tabular-nums mt-1">
                  {formatIdr(cat.cost)}
                </div>
                <span className="text-[11px] font-mono text-slate-400">Rp {cat.perKm} / km</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-white/[0.06] pt-2">
                {cat.description}
              </p>
            </GlassCard>
          );
        })}
      </div>

      {/* Why Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#090D14] border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-['Syne',sans-serif] font-bold text-white">
                Explainable Cost Intelligence · "Why?" Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Deconstructing why monthly fleet expenditure changed by -Rp 380.000 vs forecast
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                <span>Shifted 82% charging to off-peak tariff (Rp 1.700/kWh)</span>
                <span className="font-mono text-emerald-400 font-bold">-Rp 620.000</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                <span>Airport extended VIP pickup wait-times parking</span>
                <span className="font-mono text-amber-400 font-bold">+Rp 140.000</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                <span>Regenerative braking friction pad wear credit</span>
                <span className="font-mono text-emerald-400 font-bold">-Rp 80.000</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                <span>Highway toll express volume on Bali Mandara</span>
                <span className="font-mono text-amber-400 font-bold">+Rp 180.000</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center text-xs">
              <span className="text-emerald-300 font-semibold">Net Operational Margin Gain:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">-Rp 380.000 saved</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowWhyModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-semibold cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
