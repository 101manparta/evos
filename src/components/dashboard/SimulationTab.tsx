import React, { useState } from 'react';
import { SlidersHorizontal, ArrowRight, DollarSign, TrendingDown, Leaf, ShieldCheck, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { simulationApi } from '../../lib/api/modules';
import { formatIdr, formatIdrCompact } from '../../lib/formatters';

export const SimulationTab: React.FC = () => {
  // Inputs
  const [fleetSize, setFleetSize] = useState<number>(20);
  const [evPercentage, setEvPercentage] = useState<number>(100);
  const [avgDistancePerVehicleKm, setAvgDistancePerVehicleKm] = useState<number>(1800); // km per month per vehicle
  const [electricityTariff, setElectricityTariff] = useState<number>(1700); // IDR/kWh
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(14500); // Pertamax IDR/liter
  const [chargingStrategy, setChargingStrategy] = useState<'offpeak' | 'mixed' | 'public'>('offpeak');
  const [backendCalculated, setBackendCalculated] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);

  const handleRunSimulationBackend = async () => {
    setRunning(true);
    const res = await simulationApi.run({
      fleet_size: fleetSize,
      ev_percentage: evPercentage,
      monthly_km: avgDistancePerVehicleKm,
      charging_rate: electricityTariff,
    });
    setRunning(false);
    if (res.success) {
      setBackendCalculated(true);
      setTimeout(() => setBackendCalculated(false), 4000);
    }
  };

  // Multiplier from strategy
  const strategyRate =
    chargingStrategy === 'offpeak'
      ? electricityTariff
      : chargingStrategy === 'mixed'
      ? electricityTariff * 1.25
      : electricityTariff * 1.55;

  // Numbers
  const totalFleetDistanceKm = fleetSize * avgDistancePerVehicleKm;
  const evVehicleCount = Math.round((fleetSize * evPercentage) / 100);
  const iceVehicleCount = fleetSize - evVehicleCount;

  // EV Cost Calculation:
  // Avg 14.5 kWh / 100km = 0.145 kWh/km
  const evEnergyPerKm = 0.145 * strategyRate;
  const evMaintPerKm = 110;
  const evCostPerKm = evEnergyPerKm + evMaintPerKm;
  const evTotalCost = Math.round(evVehicleCount * avgDistancePerVehicleKm * evCostPerKm);

  // ICE Cost Calculation:
  // Avg 10 km/liter Pertamax = 0.10 liter/km
  const iceFuelPerKm = 0.1 * fuelPricePerLiter;
  const iceMaintPerKm = 240;
  const iceCostPerKm = iceFuelPerKm + iceMaintPerKm;
  const iceTotalCost = Math.round(iceVehicleCount * avgDistancePerVehicleKm * iceCostPerKm);

  const totalProjectedFleetCost = evTotalCost + iceTotalCost;

  // Baseline 100% ICE benchmark:
  const allIceBenchmarkCost = Math.round(fleetSize * avgDistancePerVehicleKm * iceCostPerKm);
  const estimatedSavings = Math.max(0, allIceBenchmarkCost - totalProjectedFleetCost);
  const savingsPercent = Math.round((estimatedSavings / (allIceBenchmarkCost || 1)) * 100);

  // Carbon metrics
  const co2SavedTons = ((evVehicleCount * avgDistancePerVehicleKm * 0.165) / 1000).toFixed(1);
  const breakEvenMonths = Math.round(18 - (savingsPercent / 10));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Fleet Electrification & What-If Simulation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Model capital expenditure returns, energy contract optimization, and transition timelines
          </p>
        </div>

        <button
          onClick={() => {
            setFleetSize(20);
            setEvPercentage(100);
            setAvgDistancePerVehicleKm(1800);
            setElectricityTariff(1700);
            setFuelPricePerLiter(14500);
            setChargingStrategy('offpeak');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset To Baseline</span>
        </button>
      </div>

      {/* Simulator 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-base font-semibold text-white">Simulation Variables</h3>
              <span className="text-xs font-mono text-emerald-400">FINANCIAL ENGINE</span>
            </div>

            {/* Slider 1: Total Fleet Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Total Fleet Size (Vehicles)</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{fleetSize} Vehicles</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            {/* Slider 2: EV Percentage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Electric Share (% EV)</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {evPercentage}% ({evVehicleCount} EVs, {iceVehicleCount} ICE)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={evPercentage}
                onChange={(e) => setEvPercentage(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% (Hybrid fleet)</span>
                <span>50%</span>
                <span>100% (Full Zero Emission)</span>
              </div>
            </div>

            {/* Slider 3: Monthly Distance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Monthly Distance Per Vehicle</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {new Intl.NumberFormat('id-ID').format(avgDistancePerVehicleKm)} km / mo
                </span>
              </div>
              <input
                type="range"
                min="800"
                max="5000"
                step="100"
                value={avgDistancePerVehicleKm}
                onChange={(e) => setAvgDistancePerVehicleKm(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>800 km</span>
                <span>2.500 km</span>
                <span>5.000 km</span>
              </div>
            </div>

            {/* Strategy Radio */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">
                Depot Charging Discipline Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'offpeak', label: '100% Depot Off-Peak', desc: 'Rp 1.700/kWh' },
                  { id: 'mixed', label: 'Mixed Commercial', desc: 'Rp 2.125/kWh' },
                  { id: 'public', label: 'Heavy Public DC Fast', desc: 'Rp 2.635/kWh' },
                ].map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setChargingStrategy(strat.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      chargingStrategy === strat.id
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                        : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{strat.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{strat.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Projected Outputs Column (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard glow className="p-6 md:p-8 space-y-6 border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-base font-semibold text-white">Projected Monthly Financials</h3>
              <span className="text-xs font-mono font-bold text-emerald-400">ROI IMPACT</span>
            </div>

            {/* Main Big Output */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Projected Fleet Cost
                </span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  {formatIdrCompact(totalProjectedFleetCost)}
                </div>
                <span className="text-[11px] text-slate-400">{formatIdr(totalProjectedFleetCost)} / mo</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">
                  Net Monthly Savings
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {formatIdrCompact(estimatedSavings)}
                </div>
                <span className="text-[11px] text-emerald-300 font-bold">+{savingsPercent}% Margin Benefit</span>
              </div>
            </div>

            {/* Secondary Output Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                <span className="text-[10px] text-slate-400 block">EST. BREAK-EVEN</span>
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  ~{breakEvenMonths} Months
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                <span className="text-[10px] text-slate-400 block">CO₂ AVOIDED</span>
                <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                  {co2SavedTons} Tons/mo
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                <span className="text-[10px] text-slate-400 block">ANNUAL BENEFIT</span>
                <span className="text-base font-bold font-mono text-teal-300 tabular-nums">
                  {formatIdrCompact(estimatedSavings * 12)}
                </span>
              </div>
            </div>

            {/* Strategic Summary Note */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed space-y-1">
              <p>
                Operating <strong className="text-white">{evVehicleCount} electric vehicles</strong> under <strong className="text-emerald-400">{chargingStrategy === 'offpeak' ? 'depot overnight scheduling' : 'commercial tariffs'}</strong> saves <strong className="text-white">{formatIdr(estimatedSavings * 12)}</strong> annually compared to operating equivalent combustion vehicles.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
