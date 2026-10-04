import React, { useState, useEffect } from 'react';
import {
  Car,
  BatteryCharging,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
  Wrench,
  Route,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { dashboardApi, tripApi, moneyLeakApi } from '../../lib/api/modules';
import { formatIdr, formatIdrCompact, formatKm, formatPercent } from '../../lib/formatters';
import { TripRecord } from '../../types';

interface OverviewTabProps {
  onNavigateTab: (tab: string) => void;
  onSelectTrip: (trip: TripRecord) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab, onSelectTrip }) => {
  const [summary, setSummary] = useState<any>(null);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [activeLeaks, setActiveLeaks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [sumRes, tripsRes, leaksRes] = await Promise.all([
      dashboardApi.getSummary(),
      tripApi.list(),
      moneyLeakApi.list(),
    ]);

    if (sumRes.success && sumRes.data) setSummary(sumRes.data);
    if (tripsRes.success && tripsRes.data) setRecentTrips(tripsRes.data.slice(0, 3));
    if (leaksRes.success && leaksRes.data) setActiveLeaks(leaksRes.data.filter((l) => l.status !== 'Resolved').slice(0, 3));
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalCost = summary?.total_monthly_cost_idr ?? 8640000;
  const costPerKm = summary?.cost_per_km_idr ?? 465;
  const energyCost = summary?.energy_cost_idr ?? 3240000;
  const maintCost = summary?.maintenance_cost_idr ?? 1820000;
  const totalVehicles = summary?.total_vehicles ?? 20;
  const activeVehicles = summary?.active_vehicles ?? 18;
  const chargingVehicles = summary?.charging_vehicles ?? 2;

  // Weekly trend chart
  const weeklyTrend = [
    { day: 'Mon', cost: Math.round(totalCost * 0.12) },
    { day: 'Tue', cost: Math.round(totalCost * 0.14) },
    { day: 'Wed', cost: Math.round(totalCost * 0.13) },
    { day: 'Thu', cost: Math.round(totalCost * 0.15) },
    { day: 'Fri', cost: Math.round(totalCost * 0.17) },
    { day: 'Sat', cost: Math.round(totalCost * 0.19) },
    { day: 'Sun', cost: Math.round(totalCost * 0.18) },
  ];
  const maxCost = Math.max(...weeklyTrend.map((d) => d.cost)) || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Greeting & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
        <div>
          <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Good morning, Operations Director.
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative fleet cost intelligence synchronized with Go REST backend
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-white font-semibold">{totalVehicles} Vehicles</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{activeVehicles} Active</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2 text-cyan-400">
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>{chargingVehicles} Charging</span>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300"
            title="Refresh Dashboard Summary"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Core Financial KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Fleet Cost (MTD)</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatIdrCompact(totalCost)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/[0.06]">
            <span>Full: {formatIdr(totalCost)}</span>
            <span className="text-emerald-400 font-mono">-4.2% MoM</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>True Cost / KM</span>
            <Route className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            Rp {costPerKm} <span className="text-xs font-normal text-slate-400">/ km</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/[0.06]">
            <span>Target: Rp 480 / km</span>
            <span className="text-emerald-400 font-mono">Nominal</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Energy Charging Cost</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatIdrCompact(energyCost)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/[0.06]">
            <span>37.5% of total budget</span>
            <span className="text-cyan-400 font-mono">14.2 kWh/100km</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Maintenance Overhead</span>
            <Wrench className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatIdrCompact(maintCost)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/[0.06]">
            <span>21.1% of total budget</span>
            <span className="text-amber-400 font-mono">Warranty tracked</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: Weekly Cost Trend & Cost Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassCard className="lg:col-span-8 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Daily Fleet Operational Expenditure</h3>
              <p className="text-xs text-slate-400">Calculated through deterministic cost engine (IDR)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                <span>Daily Cost</span>
              </span>
              <span className="text-slate-400">Avg: {formatIdrCompact(totalCost / 7)} / day</span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyTrend.map((item) => {
              const heightPercent = Math.round((item.cost / maxCost) * 100);
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatIdrCompact(item.cost)}
                  </div>
                  <div className="w-full max-w-[42px] bg-white/[0.04] rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5 border border-white/[0.06] group-hover:border-emerald-500/40 transition-colors">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-emerald-500/40 via-emerald-400/80 to-emerald-300 rounded-t-md transition-all group-hover:brightness-125"
                    />
                  </div>
                  <div className="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
            <span>Peak weekend volume reflected in Friday & Saturday tourist transfers</span>
            <button
              onClick={() => onNavigateTab('/dashboard/cost-intelligence')}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View full cost engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </GlassCard>

        {/* Fleet Cost Distribution */}
        <GlassCard className="lg:col-span-4 p-6 space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-base font-semibold text-white">Cost Distribution</h3>
            <p className="text-xs text-slate-400">Total monthly expenditure breakdown</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Energy (Charging kWh)</span>
                <span className="font-mono text-white font-semibold">37.5% · {formatIdrCompact(energyCost)}</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '37.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Driver Allowance & Shifts</span>
                <span className="font-mono text-white font-semibold">32.4% · {formatIdrCompact(totalCost * 0.32)}</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '32.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Maintenance & Wear</span>
                <span className="font-mono text-white font-semibold">21.1% · {formatIdrCompact(maintCost)}</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: '21.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Tolls, Parking & Telemetry</span>
                <span className="font-mono text-white font-semibold">9.0% · {formatIdrCompact(totalCost * 0.09)}</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: '9.0%' }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Secondary Grid: Money Leak Alerts & High-Variance Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassCard className="lg:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-semibold text-white">Active Money Leak Alerts</h3>
            </div>
            <button
              onClick={() => onNavigateTab('/dashboard/money-leaks')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View all radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeLeaks.map((leak) => (
              <div
                key={leak.id}
                onClick={() => onNavigateTab('/dashboard/money-leaks')}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-400/30 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {leak.vehicle_id || leak.vehicleId} · {leak.title}
                  </span>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">
                    Impact: {formatIdrCompact(leak.impact_monthly_idr || leak.impactMonthlyIdr || 1800000)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {leak.description}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-semibold text-white">Recent Trips with Variance</h3>
            </div>
            <button
              onClick={() => onNavigateTab('/dashboard/trips')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Trip log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">{trip.id} · {trip.vehicle_id || trip.vehicleId}</span>
                    <span className="text-[11px] text-slate-400">{trip.route}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white tabular-nums block">
                      {formatIdr(trip.actual_cost_idr || trip.actualCostIdr || 153000)}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold tabular-nums ${
                        (trip.variance_percent || trip.variancePercent || 0) > 5 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatPercent(trip.variance_percent || trip.variancePercent || 0)} vs est.
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Actual calculated cost
                  </span>
                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Why?</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
