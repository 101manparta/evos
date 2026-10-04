import React, { useState } from 'react';
import { Settings, ShieldCheck, Key, Users, Bell, Globe, Check, Server } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const SettingsTab: React.FC = () => {
  const [companyName, setCompanyName] = useState('Bali Mobility Corp');
  const [hubLocation, setHubLocation] = useState('Sunset Road, Seminyak, Bali');
  const [depotRate, setDepotRate] = useState('1700');
  const [peakRate, setPeakRate] = useState('2500');
  const [anomalyThreshold, setAnomalyThreshold] = useState('15');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
          Fleet Intelligence Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure PLN tariff benchmarks, anomaly detection sensitivities, and Go REST backend endpoints
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Fleet configuration saved and synchronized with local intelligence state.</span>
        </div>
      )}

      {/* Profile & Base Currency */}
      <GlassCard className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-4">
          <Globe className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-semibold text-white">Operator Profile & Regional Jurisdiction</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Enterprise Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Primary Depot Hub Address</label>
              <input
                type="text"
                value={hubLocation}
                onChange={(e) => setHubLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Default Reporting Currency</label>
              <input
                type="text"
                disabled
                value="IDR (Indonesian Rupiah - Rp)"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Base Depot Rate (Rp / kWh)</label>
              <input
                type="number"
                value={depotRate}
                onChange={(e) => setDepotRate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Peak Public Rate (Rp / kWh)</label>
              <input
                type="number"
                value={peakRate}
                onChange={(e) => setPeakRate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs transition-colors cursor-pointer"
            >
              Save Regional Profile
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Backend API Configuration (Architecture for Go backend connection) */}
      <GlassCard className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-4">
          <Server className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">Go REST Backend API Bridge</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The frontend state is architected to seamlessly map to your upcoming Golang REST API service (e.g., <code className="text-emerald-400 font-mono">/api/v1/fleet/telemetry</code>, <code className="text-emerald-400 font-mono">/api/v1/anomalies</code>, and <code className="text-emerald-400 font-mono">/api/v1/costs/variance</code>).
        </p>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400">Target Go API Host:</span>
            <span className="text-emerald-400">http://localhost:8080/api/v1</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400">Auth Header Format:</span>
            <span className="text-slate-300">Authorization: Bearer &lt;EVOS_JWT_TOKEN&gt;</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
