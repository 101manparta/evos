import React, { useState } from 'react';
import { SlidersHorizontal, ArrowRight, Sparkles, TrendingDown, Leaf, Users, Car } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { formatIdr, formatIdrCompact } from '../../lib/formatters';

export const WhatIfSimulatorSection: React.FC = () => {
  // Simulator state
  const [fleetSize, setFleetSize] = useState<number>(20);
  const [addedEvs, setAddedEvs] = useState<number>(5);
  const [monthlyKm, setMonthlyKm] = useState<number>(18500);
  const [chargingRate, setChargingRate] = useState<number>(1700); // Rp / kWh
  const [evShare, setEvShare] = useState<number>(85); // 85% EV

  // Dynamic calculations
  const totalVehicles = fleetSize + addedEvs;
  const totalMonthlyDistance = monthlyKm * (totalVehicles / 20);
  
  // Baseline ICE would cost Rp 980 / km in fuel + maintenance
  // EV costs ~ (14 kWh/100km * chargingRate) + maintenance ~ Rp 420 / km
  const evEnergyCostPerKm = (14.2 / 100) * chargingRate;
  const evMaintenancePerKm = 120;
  const evOperatingCostPerKm = evEnergyCostPerKm + evMaintenancePerKm; // ~ Rp 361
  
  const projectedMonthlyCost = Math.round(totalMonthlyDistance * evOperatingCostPerKm);
  const iceBaselineCost = Math.round(totalMonthlyDistance * 980);
  const estimatedSaving = Math.max(0, iceBaselineCost - projectedMonthlyCost);
  const calculatedCostPerKm = Math.round(projectedMonthlyCost / (totalMonthlyDistance || 1));
  const co2ReductionTons = ((totalMonthlyDistance * 0.165) / 1000).toFixed(1);
  const guestTripsPerDay = Math.round((totalMonthlyDistance / 45) / 30);

  return (
    <section className="py-24 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Scenario Planning Studio
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
            What If You Changed The Fleet?
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Simulate the bottom-line impact of scaling electric assets, optimizing depot charging tariffs, or extending daily operational radius before committing capital.
          </p>
        </div>

        {/* Interactive Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            <GlassCard className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h3 className="text-base font-semibold text-white">Scenario Inputs</h3>
                <span className="text-xs text-slate-400">Interactive Model</span>
              </div>

              {/* Slider 1: Added EVs */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Add New Electric Vehicles</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">+{addedEvs} EVs ({totalVehicles} Total)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={addedEvs}
                  onChange={(e) => setAddedEvs(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>+0 vehicles</span>
                  <span>+15 vehicles</span>
                  <span>+30 vehicles</span>
                </div>
              </div>

              {/* Slider 2: Monthly Distance */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Monthly Fleet Distance (km)</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {new Intl.NumberFormat('id-ID').format(monthlyKm)} km
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={monthlyKm}
                  onChange={(e) => setMonthlyKm(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5.000 km</span>
                  <span>25.000 km</span>
                  <span>50.000 km</span>
                </div>
              </div>

              {/* Slider 3: Charging Cost */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Blended Electricity Rate</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    Rp {new Intl.NumberFormat('id-ID').format(chargingRate)} / kWh
                  </span>
                </div>
                <input
                  type="range"
                  min="1400"
                  max="2800"
                  step="50"
                  value={chargingRate}
                  onChange={(e) => setChargingRate(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Rp 1.400 (Off-Peak)</span>
                  <span>Rp 1.700 (Depot)</span>
                  <span>Rp 2.800 (Public Peak)</span>
                </div>
              </div>

              {/* Reset to baseline button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setAddedEvs(5);
                    setMonthlyKm(18500);
                    setChargingRate(1700);
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Reset To Default Scenario
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Results Output Canvas */}
          <div className="lg:col-span-6 space-y-6">
            <GlassCard glow className="p-6 md:p-8 space-y-6 border-emerald-500/30">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h3 className="text-base font-semibold text-white">Projected Business Outcomes</h3>
                <span className="text-xs font-mono font-bold text-emerald-400">DYNAMIC FORECAST</span>
              </div>

              {/* Main Metric Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    PROJECTED MONTHLY COST
                  </span>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {formatIdrCompact(projectedMonthlyCost)}
                  </div>
                  <span className="text-[11px] text-slate-400">{formatIdr(projectedMonthlyCost)}</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">
                    ESTIMATED NET SAVING
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                    {formatIdrCompact(estimatedSaving)}
                  </div>
                  <span className="text-[11px] text-emerald-300">vs ICE Benchmark</span>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                  <span className="text-[10px] text-slate-400 block">COST / KM</span>
                  <span className="text-base font-bold font-mono text-white tabular-nums">
                    Rp {calculatedCostPerKm}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                  <span className="text-[10px] text-slate-400 block">DAILY TRIPS</span>
                  <span className="text-base font-bold font-mono text-white tabular-nums">
                    ~{guestTripsPerDay}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                  <span className="text-[10px] text-slate-400 block">CO₂ REDUCTION</span>
                  <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                    {co2ReductionTons} Tons
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 leading-relaxed">
                By charging at depot rates of <span className="text-emerald-400 font-mono">Rp {chargingRate}/kWh</span>, your fleet preserves an operating margin of <span className="text-white font-bold">{Math.round((estimatedSaving / (iceBaselineCost || 1)) * 100)}%</span> across all routes.
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
