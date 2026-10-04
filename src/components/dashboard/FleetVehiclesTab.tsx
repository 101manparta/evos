import React, { useState, useEffect } from 'react';
import {
  CarFront,
  Battery,
  Zap,
  Route,
  Wrench,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { vehicleApi } from '../../lib/api/modules';
import { formatIdr, formatKm, formatKwh } from '../../lib/formatters';

export const FleetVehiclesTab: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Form State
  const [formModel, setFormModel] = useState('Hyundai Ioniq 5 Signature');
  const [formPlate, setFormPlate] = useState('');
  const [formCategory, setFormCategory] = useState('VIP Shuttles');
  const [formCapacity, setFormCapacity] = useState('77.4');
  const [formDriver, setFormDriver] = useState('Made Putra');
  const [formDepot, setFormDepot] = useState('Denpasar South Hub');

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    const res = await vehicleApi.list();
    if (res.success && res.data) {
      setVehicles(res.data);
    } else {
      setError(res.error?.message || 'Failed to load vehicles from API');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPlate.trim()) return;

    setSubmitting(true);
    const res = await vehicleApi.create({
      model: formModel,
      plate_number: formPlate,
      category: formCategory,
      battery_capacity_kwh: Number(formCapacity) || 75,
      assigned_driver: formDriver,
      depot_location: formDepot,
    });

    setSubmitting(false);
    if (res.success && res.data) {
      setShowAddModal(false);
      setFormPlate('');
      setFeedbackNotice(`Vehicle ${res.data.id} (${res.data.plate_number}) successfully registered.`);
      fetchVehicles();
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      alert(res.error?.message || 'Error creating vehicle');
    }
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    setSubmitting(true);
    const res = await vehicleApi.update(selectedVehicle.id, {
      model: formModel,
      assigned_driver: formDriver,
      depot_location: formDepot,
      category: formCategory,
    });

    setSubmitting(false);
    if (res.success && res.data) {
      setShowEditModal(false);
      setSelectedVehicle(res.data);
      setFeedbackNotice(`Vehicle ${res.data.id} updated.`);
      fetchVehicles();
      setTimeout(() => setFeedbackNotice(null), 4000);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm(`Are you sure you want to decommission vehicle ${id}?`)) return;

    const res = await vehicleApi.delete(id);
    if (res.success) {
      setSelectedVehicle(null);
      setFeedbackNotice(`Vehicle ${id} removed from active fleet registry.`);
      fetchVehicles();
      setTimeout(() => setFeedbackNotice(null), 4000);
    }
  };

  const openEditModal = (v: any) => {
    setFormModel(v.model);
    setFormPlate(v.plate_number || v.plateNumber);
    setFormCategory(v.category);
    setFormCapacity(String(v.battery_capacity_kwh || 75));
    setFormDriver(v.assigned_driver || v.assignedDriver);
    setFormDepot(v.depot_location || v.depotLocation);
    setShowEditModal(true);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const code = v.id || v.vehicle_code || '';
    const mdl = v.model || '';
    const plt = v.plate_number || v.plateNumber || '';
    const matchesSearch =
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mdl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case 'charging':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Charging
          </span>
        );
      case 'idle':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Idle
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Maintenance
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Fleet Vehicle Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative fleet assets connected via Go REST API backend
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>

          <button
            onClick={fetchVehicles}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition-colors"
            title="Refresh Fleet Registry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, model, plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 w-64"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] text-xs">
          {['all', 'active', 'charging', 'idle'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-400 text-black font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {loading && vehicles.length === 0 && (
        <div className="space-y-2 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="h-6 w-48 bg-white/[0.06] rounded animate-pulse" />
          <div className="h-10 w-full bg-white/[0.04] rounded animate-pulse" />
          <div className="h-10 w-full bg-white/[0.04] rounded animate-pulse" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchVehicles} className="underline font-semibold ml-2">Retry</button>
        </div>
      )}

      {/* Vehicles Table View */}
      {!loading && filteredVehicles.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
          <p className="text-sm font-semibold text-white">No vehicles registered yet</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Vehicle" to register your first electric fleet asset.</p>
        </div>
      ) : (
        <GlassCard className="overflow-hidden border-white/[0.08]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 border-b border-white/[0.08] uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Vehicle</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Battery / Range</th>
                  <th className="py-3.5 px-4 font-semibold">Efficiency</th>
                  <th className="py-3.5 px-4 font-semibold">Cost / KM</th>
                  <th className="py-3.5 px-4 font-semibold">Odometer</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Driver</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300">
                {filteredVehicles.map((vehicle) => {
                  const plate = vehicle.plate_number || vehicle.plateNumber || 'DK 8821 EV';
                  const eff = vehicle.efficiency_kwh_per_100km || vehicle.efficiencyKwhPer100km || 14.2;
                  const isAnomaly = eff > 18;
                  const odo = vehicle.odometer_km || vehicle.odometerKm || 0;
                  const soc = vehicle.battery_percent ?? vehicle.batteryPercent ?? 85;
                  const rng = vehicle.range_km ?? vehicle.rangeKm ?? 400;

                  return (
                    <tr
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:border-emerald-500/40">
                            <CarFront className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block group-hover:text-emerald-400 transition-colors">
                              {vehicle.id}
                            </span>
                            <span className="text-[11px] text-slate-400">{vehicle.model} ({plate})</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(vehicle.status)}
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{soc}%</span>
                          <span className="text-slate-400">({rng} km)</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        <span className={isAnomaly ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                          {eff} kWh/100km
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                        Rp {vehicle.cost_per_km || vehicle.costPerKm || 465}
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400">
                        {formatKm(odo)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {vehicle.assigned_driver || vehicle.assignedDriver || 'Made Putra'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVehicle(vehicle);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 hover:text-white transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Vehicle Detailed Modal Drilldown */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#090D14] border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-['Syne',sans-serif] font-bold text-white">
                    {selectedVehicle.id} · {selectedVehicle.model}
                  </h3>
                  {getStatusBadge(selectedVehicle.status)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  License: {selectedVehicle.plate_number || selectedVehicle.plateNumber} · Driver: {selectedVehicle.assigned_driver || selectedVehicle.assignedDriver} · Depot: {selectedVehicle.depot_location || selectedVehicle.depotLocation}
                </p>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Cost / KM</span>
                <span className="text-lg font-bold font-mono text-white tabular-nums">
                  Rp {selectedVehicle.cost_per_km || selectedVehicle.costPerKm || 465}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Efficiency</span>
                <span className="text-lg font-bold font-mono text-white tabular-nums">
                  {selectedVehicle.efficiency_kwh_per_100km || selectedVehicle.efficiencyKwhPer100km || 14.2} kWh
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Battery SoC</span>
                <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  {selectedVehicle.battery_percent ?? selectedVehicle.batteryPercent ?? 88}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Odometer</span>
                <span className="text-lg font-bold font-mono text-white tabular-nums">
                  {formatKm(selectedVehicle.odometer_km || selectedVehicle.odometerKm || 34120)}
                </span>
              </div>
            </div>

            {/* Bottom Actions: Edit & Delete */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => handleDeleteVehicle(selectedVehicle.id)}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Asset</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(selectedVehicle)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Parameters</span>
                </button>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#090D14] border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white">Register New EV Asset</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Vehicle Make & Model</label>
                <input
                  type="text"
                  required
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  placeholder="e.g. Hyundai Ioniq 5 Signature Long Range"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">License Plate Number</label>
                  <input
                    type="text"
                    required
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                    placeholder="e.g. DK 9912 EV"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono uppercase focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Battery Pack (kWh)</label>
                  <input
                    type="number"
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Fleet Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                >
                  <option value="VIP Shuttles">VIP Shuttles</option>
                  <option value="Executive Sedans">Executive Sedans</option>
                  <option value="Passenger">Passenger</option>
                  <option value="Light Cargo">Light Cargo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Assigned Driver</label>
                  <input
                    type="text"
                    value={formDriver}
                    onChange={(e) => setFormDriver(e.target.value)}
                    placeholder="Made Putra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Depot Hub</label>
                  <input
                    type="text"
                    value={formDepot}
                    onChange={(e) => setFormDepot(e.target.value)}
                    placeholder="Denpasar South Hub"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  {submitting ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#090D14] border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white">Edit {selectedVehicle.id} Parameters</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateVehicle} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Vehicle Make & Model</label>
                <input
                  type="text"
                  required
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Assigned Driver</label>
                  <input
                    type="text"
                    value={formDriver}
                    onChange={(e) => setFormDriver(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Depot Hub</label>
                  <input
                    type="text"
                    value={formDepot}
                    onChange={(e) => setFormDepot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs"
                >
                  {submitting ? 'Saving...' : 'Update Parameters'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
