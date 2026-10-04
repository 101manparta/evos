import React, { useState } from 'react';
import { BatteryCharging, Wrench, Clock, AlertTriangle, ArrowRight, CheckCircle, Search, ShieldAlert } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const MoneyLeakDetectorSection: React.FC = () => {
  const [selectedLeak, setSelectedLeak] = useState<string>('EV-014');

  const leaks = [
    {
      id: 'EV-014',
      badge: 'CHARGING ANOMALY',
      vehicle: 'Vehicle EV-014',
      metricTitle: 'Energy Consumption',
      currentValue: '21 kWh / 100 km',
      benchmarkValue: '14 kWh / 100 km',
      diff: '+50%',
      monthlyImpact: 'Rp 1.8M',
      status: 'Investigate',
      icon: BatteryCharging,
      accent: 'text-amber-400',
      borderAccent: 'hover:border-amber-400/40',
      reason: 'Driver frequently conducts unscheduled fast charges during peak daytime tariffs. Tire pressure on front axles measured 18% below manufacturer recommendation.',
      action: 'Schedule depot tire pressure rebalancing and configure route restriction for high-tariff fast chargers.',
    },
    {
      id: 'EV-021',
      badge: 'MAINTENANCE ANOMALY',
      vehicle: 'Vehicle EV-021',
      metricTitle: 'Maintenance Incurred',
      currentValue: 'Rp 3.2M',
      benchmarkValue: 'Rp 1.4M',
      diff: '+128%',
      monthlyImpact: 'High Priority',
      status: 'Claim Warranty',
      icon: Wrench,
      accent: 'text-rose-400',
      borderAccent: 'hover:border-rose-400/40',
      reason: 'Unscheduled inverter cooling pump replacement logged outside routine service intervals. Component is fully covered under OEM powertrain warranty.',
      action: 'Dispatch warranty reimbursement pack to authorized dealer service representative.',
    },
    {
      id: 'EV-008',
      badge: 'LOW UTILIZATION',
      vehicle: 'Vehicle EV-008',
      metricTitle: 'Operational Ratio',
      currentValue: '26% active',
      benchmarkValue: '8 / 30 days',
      diff: '-68%',
      monthlyImpact: 'Rp 950K',
      status: 'Reallocate',
      icon: Clock,
      accent: 'text-cyan-400',
      borderAccent: 'hover:border-cyan-400/40',
      reason: 'Vehicle stationed idle at Sanur depot incurring ongoing battery phantom drain and parking fees without producing transport revenue.',
      action: 'Reassign vehicle to Jimbaran guest inter-resort shuttle rotation to recover capital utilization.',
    },
  ];

  return (
    <section className="py-24 border-t border-white/[0.06] bg-[#06080C] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Automated Operational Audits
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
              Find Where Your Money Is Leaking.
            </h2>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Subtle energy loss, tariff peaks, under-utilization, and unauthorized repairs quietly erode fleet profitability. EVOS continuously scans for anomalies before they compound.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Total Detected Monthly Leaks:</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-400">
              Rp 4.550.000
            </span>
          </div>
        </div>

        {/* Leak Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaks.map((leak) => {
            const Icon = leak.icon;
            const isSelected = selectedLeak === leak.id;
            return (
              <GlassCard
                key={leak.id}
                glow={isSelected}
                interactive
                onClick={() => setSelectedLeak(leak.id)}
                className={`p-6 transition-all cursor-pointer ${leak.borderAccent} ${
                  isSelected ? 'border-emerald-500/40 bg-[#0E151F]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400">
                    {leak.badge}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${leak.accent}`} />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white tracking-tight">{leak.vehicle}</h3>
                  <p className="text-xs text-slate-400">{leak.metricTitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Current Value</span>
                    <span className="text-sm font-mono font-bold text-white tabular-nums">
                      {leak.currentValue}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Fleet Benchmark</span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {leak.benchmarkValue}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-white/[0.06]">
                    <span className="text-xs text-slate-400">Variance Delta</span>
                    <span className={`text-xs font-mono font-bold ${leak.accent} tabular-nums`}>
                      {leak.diff}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Monthly Impact</span>
                    <span className="font-mono font-bold text-white tabular-nums">{leak.monthlyImpact}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/[0.06] text-slate-200">
                    {leak.status}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Selected Leak Root Cause Deep Dive */}
        {selectedLeak && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-3xl">
              <span className="text-[11px] font-mono text-emerald-400 tracking-wider font-semibold uppercase">
                Diagnostic Analysis · {selectedLeak}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {leaks.find((l) => l.id === selectedLeak)?.reason}
              </p>
              <p className="text-xs text-emerald-400 font-medium pt-1">
                Recommended Action: {leaks.find((l) => l.id === selectedLeak)?.action}
              </p>
            </div>
            <button
              onClick={() => alert(`Initiating mitigation workflow for ${selectedLeak}...`)}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              Dispatch Work Order
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
