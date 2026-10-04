import React, { useState, useEffect } from 'react';
import { Wrench, ShieldCheck, Clock, AlertTriangle, CheckCircle2, DollarSign, Plus, X, RefreshCw, Trash2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { maintenanceApi, vehicleApi } from '../../lib/api/modules';
import { formatIdr } from '../../lib/formatters';

export const MaintenanceTab: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form State
  const [formVehicle, setFormVehicle] = useState('EV-001');
  const [formType, setFormType] = useState('Tire Rotation & High Voltage Safety Check');
  const [formDate, setFormDate] = useState('24 Oct 2026');
  const [formCost, setFormCost] = useState('750000');
  const [formProvider, setFormProvider] = useState('Hyundai Authorized EV Service Bali');
  const [formPriority, setFormPriority] = useState('Routine');

  const fetchMaintenance = async () => {
    setLoading(true);
    const [mntRes, vehRes] = await Promise.all([maintenanceApi.list(), vehicleApi.list()]);
    if (mntRes.success && mntRes.data) {
      setLogs(mntRes.data);
    }
    if (vehRes.success && vehRes.data) {
      setVehicles(vehRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await maintenanceApi.create({
      vehicle_id: formVehicle,
      service_type: formType,
      scheduled_date: formDate,
      estimated_cost_idr: Number(formCost) || 500000,
      service_provider: formProvider,
      priority: formPriority,
    });

    setSubmitting(false);
    if (res.success && res.data) {
      setShowAddModal(false);
      setSuccessNotice(`Maintenance order ${res.data.id} scheduled for ${res.data.vehicle_id}.`);
      fetchMaintenance();
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const handleDeleteMaintenance = async (id: string) => {
    if (!confirm(`Are you sure you want to remove maintenance record ${id}?`)) return;
    const res = await maintenanceApi.delete(id);
    if (res.success) {
      setSuccessNotice(`Maintenance record ${id} removed.`);
      fetchMaintenance();
      setTimeout(() => setSuccessNotice(null), 4000);
    } else {
      alert(res.error?.message || 'Failed to delete maintenance record');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Predictive Maintenance Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Condition-based high-voltage battery health, tire rotation schedules & OEM warranty claim tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Maintenance</span>
          </button>

          <button
            onClick={fetchMaintenance}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* 4 Maintenance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Scheduled Orders</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {logs.length} Orders
          </div>
          <span className="text-[10px] text-emerald-400">Next 30 days active</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical Wear Outliers</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            1 Vehicle
          </div>
          <span className="text-[10px] text-amber-300">EV-008 Filter check</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Maintenance MTD</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            Rp 1.820.000
          </div>
          <span className="text-[10px] text-slate-400">Excluding warranty claim</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Warranty Recovery Pending</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            Rp 3.200.000
          </div>
          <span className="text-[10px] text-slate-400">EV-021 Inverter repair claim</span>
        </GlassCard>
      </div>

      {/* Maintenance Logs Table */}
      <GlassCard className="overflow-hidden border-white/[0.08]">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Maintenance Work Order Ledger</h3>
          <span className="text-xs text-slate-400">Connected to backend database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-400 border-b border-white/[0.08] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Log ID / Vehicle</th>
                <th className="py-3 px-4 font-semibold">Service Description</th>
                <th className="py-3 px-4 font-semibold">Authorized Workshop</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Estimated Cost</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {logs.map((log) => {
                const vehId = log.vehicle_id ?? log.vehicleId ?? 'EV-001';
                const serviceType = log.service_type ?? log.serviceType;
                const serviceProvider = log.service_provider ?? log.serviceProvider;
                const scheduledDate = log.scheduled_date ?? log.scheduledDate;
                const estCost = log.estimated_cost_idr ?? log.estimatedCostIdr ?? 650000;

                return (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{log.id}</span>
                      <span className="text-[11px] font-mono text-emerald-400">{vehId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium max-w-xs">
                      {serviceType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {serviceProvider}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                      {scheduledDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          log.priority === 'Critical Safety'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : log.priority === 'High Wear'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-white/[0.06] text-slate-300'
                        }`}
                      >
                        {log.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-white">
                      {formatIdr(estCost)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          log.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteMaintenance(log.id)}
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer ml-auto"
                        title="Delete Maintenance Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Schedule Maintenance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#090D14] border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white">Schedule Maintenance Work Order</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMaintenance} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Select Vehicle</label>
                  <select
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.id} - {v.model}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Priority Tier</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white"
                  >
                    <option value="Routine">Routine</option>
                    <option value="High Wear">High Wear</option>
                    <option value="Critical Safety">Critical Safety</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Service Description</label>
                <input
                  type="text"
                  required
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Authorized Workshop</label>
                <input
                  type="text"
                  required
                  value={formProvider}
                  onChange={(e) => setFormProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Scheduled Date</label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Estimated Cost (IDR)</label>
                  <input
                    type="number"
                    required
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs"
                >
                  {submitting ? 'Scheduling...' : 'Commit Work Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
