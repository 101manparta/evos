import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, BatteryCharging, Wrench, Clock, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { moneyLeakApi } from '../../lib/api/modules';
import { formatIdrCompact } from '../../lib/formatters';

export const MoneyLeaksTab: React.FC = () => {
  const [leaks, setLeaks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedLeak, setSelectedLeak] = useState<any | null>(null);
  const [resolving, setResolving] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchLeaks = async () => {
    setLoading(true);
    const res = await moneyLeakApi.list();
    if (res.success && res.data) {
      setLeaks(res.data);
      if (!selectedLeak && res.data.length > 0) {
        setSelectedLeak(res.data[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaks();
  }, []);

  const handleResolveLeak = async (id: string) => {
    setResolving(true);
    const res = await moneyLeakApi.resolve(id);
    setResolving(false);
    if (res.success) {
      setNotice(`Mitigation work order for ${id} dispatched & recorded in platform audit logs.`);
      fetchLeaks();
      if (selectedLeak?.id === id) {
        setSelectedLeak((prev: any) => ({ ...prev, status: 'Resolved' }));
      }
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const filteredLeaks = leaks.filter((l) => {
    if (filterType === 'all') return true;
    const t = l.type || '';
    return t.toLowerCase().includes(filterType.toLowerCase());
  });

  const totalMonthlyImpact = leaks
    .filter((l) => l.status !== 'Resolved')
    .reduce((acc, curr) => acc + (curr.impact_monthly_idr || curr.impactMonthlyIdr || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Money Leak Anomaly Radar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic detection of charging inefficiencies, maintenance outliers, and asset under-utilization
          </p>
        </div>

        {/* Total Financial Drain Summary */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-amber-300 uppercase tracking-wider block">
                Active Monthly Leak Risk
              </span>
              <span className="text-base font-bold font-mono text-white tabular-nums">
                {formatIdrCompact(totalMonthlyImpact)} / month
              </span>
            </div>
          </div>

          <button
            onClick={fetchLeaks}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { label: 'All Anomalies', value: 'all' },
          { label: 'Charging Tariff & HVAC', value: 'charging' },
          { label: 'Maintenance Outliers', value: 'maintenance' },
          { label: 'Asset Under-Utilization', value: 'utilization' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              filterType === tab.value
                ? 'bg-emerald-400 text-black font-semibold shadow'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Layout: List of Cards + Root-Cause Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Anomaly Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredLeaks.map((leak) => {
            const isSelected = selectedLeak?.id === leak.id;
            const vehId = leak.vehicle_id || leak.vehicleId || 'EV-014';
            const impact = leak.impact_monthly_idr || leak.impactMonthlyIdr || 1800000;
            const isResolved = leak.status === 'Resolved';

            return (
              <GlassCard
                key={leak.id}
                glow={isSelected && !isResolved}
                interactive
                onClick={() => setSelectedLeak(leak)}
                className={`p-5 transition-all cursor-pointer ${
                  isSelected ? 'border-emerald-500/40 bg-[#0E151F]' : ''
                } ${isResolved ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        leak.severity === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {leak.severity} SEVERITY
                    </span>
                    <span className="text-xs font-semibold text-white font-mono">
                      {vehId}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                    Impact: {formatIdrCompact(impact)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1 tracking-tight">
                  {leak.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {leak.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                  <span className="text-slate-400">
                    Detected: {leak.detected_date || leak.detectedDate} · {leak.percentage_diff || leak.percentageDiff}
                  </span>
                  <span
                    className={`font-semibold text-[11px] ${
                      isResolved ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    Status: {leak.status}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Detailed Anomaly Deep Dive (5 cols) */}
        <div className="lg:col-span-5">
          {selectedLeak ? (
            <GlassCard glow className="p-6 space-y-6 sticky top-24 border-emerald-500/30">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                    ANOMALY INVESTIGATION FILE
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {selectedLeak.vehicle_id || selectedLeak.vehicleId} · {selectedLeak.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">{selectedLeak.id}</span>
              </div>

              {/* Metric Delta Comparison */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{selectedLeak.metric_label || selectedLeak.metricLabel} (Current)</span>
                  <span className="font-mono font-bold text-white text-sm tabular-nums">
                    {selectedLeak.current_value || selectedLeak.currentValue}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Fleet Benchmark</span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {selectedLeak.benchmark_value || selectedLeak.benchmarkValue}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-white/[0.06]">
                  <span className="text-slate-400">Variance Delta</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {selectedLeak.percentage_diff || selectedLeak.percentageDiff}
                  </span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Operational Diagnosis
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedLeak.description}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 space-y-1.5">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Recommended Business Action
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedLeak.recommendation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                {selectedLeak.status !== 'Resolved' ? (
                  <button
                    onClick={() => handleResolveLeak(selectedLeak.id)}
                    disabled={resolving}
                    className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition-all shadow-[0_0_16px_rgba(16,185,129,0.2)] cursor-pointer text-center"
                  >
                    {resolving ? 'Executing...' : 'Execute Mitigation Work Order'}
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mitigation In Place & Logged in Audit Trail</span>
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            <div className="p-8 text-center text-slate-500 border border-white/[0.06] rounded-2xl">
              Select an anomaly card to inspect operational root cause.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
