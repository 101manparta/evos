import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  Clock,
  Phone,
  Car,
  Star,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { driverApi, vehicleApi } from '../../lib/api/modules';
import { Driver } from '../../types';

export const DriversTab: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formPhone, setFormPhone] = useState('+62812');
  const [formLicense, setFormLicense] = useState('');
  const [formVehicle, setFormVehicle] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'ON_DUTY' | 'OFF_DUTY'>('ACTIVE');

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    const [dRes, vRes] = await Promise.all([driverApi.list(), vehicleApi.list()]);

    if (dRes.success && dRes.data) {
      setDrivers(dRes.data);
    } else {
      setError(dRes.error?.message || 'Failed to fetch drivers from backend API');
    }

    if (vRes.success && vRes.data) {
      setVehicles(vRes.data);
      if (vRes.data.length > 0 && !formVehicle) {
        setFormVehicle(vRes.data[0].id);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openAddModal = () => {
    setFormName('');
    setFormCode('EMP-' + String(drivers.length + 1).padStart(2, '0'));
    setFormPhone('+628123456789' + (drivers.length + 1));
    setFormLicense('DK-' + Math.floor(1000 + Math.random() * 9000) + '-B2');
    setFormVehicle(vehicles[0]?.id || 'EV-001');
    setFormStatus('ACTIVE');
    setShowAddModal(true);
  };

  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormName(driver.name);
    setFormCode(driver.employee_code);
    setFormPhone(driver.phone);
    setFormLicense(driver.license_number);
    setFormVehicle(driver.assigned_vehicle_id);
    setFormStatus(driver.status);
    setShowEditModal(true);
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await driverApi.create({
      name: formName,
      employee_code: formCode,
      phone: formPhone,
      license_number: formLicense,
      assigned_vehicle_id: formVehicle,
      status: formStatus,
    });

    setSubmitting(false);

    if (res.success && res.data) {
      setShowAddModal(false);
      setFeedbackNotice(`Driver ${res.data.name} (${res.data.id}) registered in fleet roster.`);
      fetchDrivers();
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      setError(res.error?.message || 'Failed to register driver');
    }
  };

  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    setSubmitting(true);
    setError(null);

    const res = await driverApi.update(selectedDriver.id, {
      name: formName,
      employee_code: formCode,
      phone: formPhone,
      license_number: formLicense,
      assigned_vehicle_id: formVehicle,
      status: formStatus,
    });

    setSubmitting(false);

    if (res.success) {
      setShowEditModal(false);
      setFeedbackNotice(`Driver ${formName} credentials updated in backend database.`);
      fetchDrivers();
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      setError(res.error?.message || 'Failed to update driver');
    }
  };

  const handleDeleteDriver = async (driver: Driver) => {
    if (!confirm(`Are you sure you want to remove driver ${driver.name} (${driver.id}) from the active roster?`)) {
      return;
    }

    const res = await driverApi.delete(driver.id);
    if (res.success) {
      setFeedbackNotice(`Driver ${driver.name} successfully removed from active fleet roster.`);
      fetchDrivers();
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      alert(res.error?.message || 'Failed to delete driver');
    }
  };

  // Filtered drivers
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.assigned_vehicle_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = drivers.filter((d) => d.status === 'ACTIVE' || d.status === 'ON_DUTY').length;
  const onDutyCount = drivers.filter((d) => d.status === 'ON_DUTY').length;
  const avgRating =
    drivers.length > 0
      ? (drivers.reduce((acc, d) => acc + (d.rating || 5), 0) / drivers.length).toFixed(1)
      : '5.0';
  const totalTrips = drivers.reduce((acc, d) => acc + (d.total_trips || 0), 0);

  return (
    <div className="space-y-6">
      {/* Feedback Notice */}
      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
          <button onClick={() => setFeedbackNotice(null)} className="cursor-pointer text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header and KPI strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Driver Personnel & Dispatch Roster</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time credential verification, vehicle assignments, and eco-driving scorecards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDrivers}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh from Backend"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Drivers</span>
          <div className="text-2xl font-bold text-white font-mono">{drivers.length}</div>
          <span className="text-[10px] text-emerald-400">Certified Commercial Operators</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Active On Duty</span>
          <div className="text-2xl font-bold text-blue-400 font-mono">{onDutyCount}</div>
          <span className="text-[10px] text-slate-400">{activeCount} Total Standby & Active</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Fleet Eco Rating</span>
          <div className="text-2xl font-bold text-amber-300 font-mono flex items-center gap-1">
            <span>{avgRating}</span>
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
          </div>
          <span className="text-[10px] text-slate-400">Regenerative braking accuracy</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Trips Completed</span>
          <div className="text-2xl font-bold text-white font-mono">{totalTrips}</div>
          <span className="text-[10px] text-emerald-400">Zero safety incidents logged</span>
        </GlassCard>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 border-white/[0.08]">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, EMP ID, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
            >
              <option value="all">All Duty Statuses</option>
              <option value="ACTIVE">Active (Available)</option>
              <option value="ON_DUTY">On Duty (In Transit)</option>
              <option value="OFF_DUTY">Off Duty (Rest Period)</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Driver Roster Table */}
      <GlassCard className="overflow-hidden border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Driver Profile</th>
                <th className="py-3 px-4">Employee Code</th>
                <th className="py-3 px-4">Assigned EV</th>
                <th className="py-3 px-4">Contact & License</th>
                <th className="py-3 px-4">Scorecard</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                    <span>Synchronizing driver records with Go backend...</span>
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No drivers match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
                          {driver.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{driver.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{driver.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">{driver.employee_code}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/20 w-fit">
                        <Car className="w-3.5 h-3.5" />
                        <span>{driver.assigned_vehicle_id}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="text-white block flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{driver.phone}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">SIM: {driver.license_number}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-300 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-300" />
                          <span>{driver.rating || '5.0'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">({driver.total_trips || 0} trips)</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          driver.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : driver.status === 'ON_DUTY'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {driver.status === 'ACTIVE' ? 'Available' : driver.status === 'ON_DUTY' ? 'On Duty' : 'Off Duty'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(driver)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                          title="Edit Driver Credentials"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(driver)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Driver"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add / Edit Driver Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md">
            <GlassCard className="p-6 md:p-8 space-y-6 border-white/[0.12] shadow-2xl relative">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {showAddModal ? 'Register Commercial EV Driver' : `Edit Driver (${selectedDriver?.id})`}
                </h3>
                <p className="text-xs text-slate-400">
                  Authoritative updates committed directly to operational fleet ledger
                </p>
              </div>

              <form onSubmit={showAddModal ? handleCreateDriver : handleUpdateDriver} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Made Putra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Employee ID</label>
                    <input
                      type="text"
                      required
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="EMP-05"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Duty Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 cursor-pointer"
                    >
                      <option value="ACTIVE">ACTIVE (Available)</option>
                      <option value="ON_DUTY">ON_DUTY (In Transit)</option>
                      <option value="OFF_DUTY">OFF_DUTY (Standby)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+6281234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">License / SIM</label>
                    <input
                      type="text"
                      required
                      value={formLicense}
                      onChange={(e) => setFormLicense(e.target.value)}
                      placeholder="DK-8821-B2"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Assigned Fleet Vehicle</label>
                  <select
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 cursor-pointer font-mono"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.id} - {v.plate_number || v.plateNumber} ({v.model})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{showAddModal ? 'Submit to Go Backend' : 'Commit Changes'}</span>
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
