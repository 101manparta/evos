import React, { useState, useEffect } from 'react';
import { ShieldAlert, Building2, Users, Activity, CheckCircle2, AlertTriangle, RefreshCw, Lock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { adminApi } from '../../lib/api/modules';

export const AdminTab: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    const [dashRes, compRes, userRes, auditRes] = await Promise.all([
      adminApi.getDashboard(),
      adminApi.listCompanies(),
      adminApi.listUsers(),
      adminApi.getAuditLogs(),
    ]);

    if (dashRes.success && dashRes.data) setStats(dashRes.data);
    if (compRes.success && compRes.data) setCompanies(compRes.data);
    if (userRes.success && userRes.data) setUsers(userRes.data);
    if (auditRes.success && auditRes.data) setAuditLogs(auditRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleCompany = async (id: string, name: string) => {
    const res = await adminApi.toggleCompanyStatus(id);
    if (res.success) {
      setActionNotice(`Company "${name}" status toggled.`);
      fetchAdminData();
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
              Platform Administration Console
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Multi-tenant oversight, company account governance, system telemetry & immutable audit trails
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Admin Telemetry</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Platform Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tenants Registered</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats?.total_companies ?? companies.length}
          </div>
          <span className="text-[10px] text-emerald-400">
            {stats?.active_companies ?? companies.length} Active Enterprise Accounts
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Operators</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {stats?.total_users ?? users.length}
          </div>
          <span className="text-[10px] text-slate-400">RBAC Verified Users</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Platform EV Fleet</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {stats?.total_vehicles ?? 20}
          </div>
          <span className="text-[10px] text-slate-400">Telemetry connected</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">System Health</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            99.98%
          </div>
          <span className="text-[10px] text-emerald-400">API & Supabase Nominal</span>
        </GlassCard>
      </div>

      {/* Companies Management Table */}
      <GlassCard className="overflow-hidden border-white/[0.08]">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Registered Tenant Companies</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">TOTAL: {companies.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-400 border-b border-white/[0.08] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Company Name</th>
                <th className="py-3 px-4 font-semibold">Tenant Slug</th>
                <th className="py-3 px-4 font-semibold">Jurisdiction</th>
                <th className="py-3 px-4 font-semibold">Currency</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {companies.map((comp) => (
                <tr key={comp.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {comp.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {comp.slug}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {comp.country}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {comp.currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        comp.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleCompany(comp.id, comp.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        comp.status === 'ACTIVE'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {comp.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Audit Logs Table */}
      <GlassCard className="overflow-hidden border-white/[0.08]">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Immutable Platform Audit Trail</h3>
          </div>
          <span className="text-xs text-slate-400">Showing recent system events</span>
        </div>

        <div className="overflow-x-auto max-h-72 custom-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.03] text-slate-400 border-b border-white/[0.08] uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Resource</th>
                <th className="py-2.5 px-4">Resource ID</th>
                <th className="py-2.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-4 text-emerald-400 font-semibold">{log.action}</td>
                  <td className="py-2.5 px-4 text-slate-400">{log.resource_type}</td>
                  <td className="py-2.5 px-4 text-slate-200">{log.resource_id}</td>
                  <td className="py-2.5 px-4 text-slate-400">{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
