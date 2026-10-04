import React, { useState, useEffect } from 'react';
import { Route, HelpCircle, ArrowRight, X, Clock, MapPin, Zap, User, AlertTriangle, Plus, CheckCircle2, RefreshCw, Trash2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { tripApi, vehicleApi } from '../../lib/api/modules';
import { TripRecord } from '../../types';
import { formatIdr, formatKm, formatPercent } from '../../lib/formatters';

interface TripsTabProps {
  selectedTripForWhy?: TripRecord | null;
  onClearSelectedTrip?: () => void;
}

export const TripsTab: React.FC<TripsTabProps> = ({ selectedTripForWhy, onClearSelectedTrip }) => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [activeModalTrip, setActiveModalTrip] = useState<any | null>(selectedTripForWhy || null);

  // New Trip Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form State
  const [formVehicle, setFormVehicle] = useState('EV-001');
  const [formDriver, setFormDriver] = useState('Made Putra');
  const [formRoute, setFormRoute] = useState('Ngurah Rai Airport -> Seminyak Luxury Villa');
  const [formDistance, setFormDistance] = useState('32.5');
  const [formEnergy, setFormEnergy] = useState('4.8');
  const [formEstimatedCost, setFormEstimatedCost] = useState('95000');
  const [formTolls, setFormTolls] = useState('20000');

  const fetchTrips = async () => {
    setLoading(true);
    const [tripsRes, vehRes] = await Promise.all([tripApi.list(), vehicleApi.list()]);
    if (tripsRes.success && tripsRes.data) {
      setTrips(tripsRes.data);
    }
    if (vehRes.success && vehRes.data) {
      setVehicles(vehRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripForWhy) {
      setActiveModalTrip(selectedTripForWhy);
    }
  }, [selectedTripForWhy]);

  const closeModal = () => {
    setActiveModalTrip(null);
    if (onClearSelectedTrip) onClearSelectedTrip();
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await tripApi.create({
      vehicle_id: formVehicle,
      driver_name: formDriver,
      route: formRoute,
      distance_km: Number(formDistance) || 25,
      energy_kwh: Number(formEnergy) || 4,
      estimated_cost_idr: Number(formEstimatedCost) || 90000,
      tolls_parking: Number(formTolls) || 15000,
    });

    setSubmitting(false);
    if (res.success && res.data) {
      setShowAddModal(false);
      setSuccessNotice(`Trip ${res.data.id} logged. Actual Cost calculated: ${formatIdr(res.data.actual_cost_idr)}`);
      fetchTrips();
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm(`Are you sure you want to remove trip record ${tripId}?`)) return;
    const res = await tripApi.delete(tripId);
    if (res.success) {
      setSuccessNotice(`Trip record ${tripId} removed from dispatch logs.`);
      fetchTrips();
      setTimeout(() => setSuccessNotice(null), 4000);
    } else {
      alert(res.error?.message || 'Failed to delete trip');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Trip & Route Variance Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Realtime vs estimated dispatch costs with granular root-cause decomposition
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Dispatch Trip</span>
          </button>

          <button
            onClick={fetchTrips}
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

      {/* Trips Table */}
      <GlassCard className="overflow-hidden border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-400 border-b border-white/[0.08] uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Trip ID / Vehicle</th>
                <th className="py-3.5 px-4 font-semibold">Route</th>
                <th className="py-3.5 px-4 font-semibold">Driver</th>
                <th className="py-3.5 px-4 font-semibold">Distance / Energy</th>
                <th className="py-3.5 px-4 font-semibold">Est. Cost</th>
                <th className="py-3.5 px-4 font-semibold">Actual Cost</th>
                <th className="py-3.5 px-4 font-semibold">Variance</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {trips.map((trip) => {
                const varPct = trip.variance_percent ?? trip.variancePercent ?? 0;
                const isVariance = Math.abs(varPct) > 5;
                const estCost = trip.estimated_cost_idr ?? trip.estimatedCostIdr ?? 0;
                const actCost = trip.actual_cost_idr ?? trip.actualCostIdr ?? 0;
                const dist = trip.distance_km ?? trip.distanceKm ?? 0;
                const eng = trip.energy_kwh ?? trip.energyKwh ?? 0;
                const vehId = trip.vehicle_id ?? trip.vehicleId ?? 'EV-001';
                const drvName = trip.driver_name ?? trip.driverName ?? 'Made Putra';

                return (
                  <tr
                    key={trip.id}
                    onClick={() => setActiveModalTrip(trip)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block group-hover:text-emerald-400 transition-colors">
                        {trip.id}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{vehId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="block truncate max-w-[200px] text-white">{trip.route}</span>
                      <span className="text-[10px] text-slate-400">{trip.date}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {drvName}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      <span className="text-white block">{dist} km</span>
                      <span className="text-[10px] text-slate-400">{eng} kWh</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400">
                      {formatIdr(estCost)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                      {formatIdr(actCost)}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          isVariance
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'text-emerald-400'
                        }`}
                      >
                        {formatPercent(varPct)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-semibold ${
                          trip.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalTrip(trip);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Why?</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTrip(trip.id);
                          }}
                          className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Trip Detail & Why Variance Modal */}
      {activeModalTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#090D14] border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-['Syne',sans-serif] font-bold text-white">
                    {activeModalTrip.id} · Route Variance Analysis
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-lg font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {formatPercent(activeModalTrip.variance_percent ?? activeModalTrip.variancePercent ?? 0)} Variance
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {activeModalTrip.route} · Logged {activeModalTrip.date}
                </p>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Actual Total Cost</span>
                <span className="text-lg font-bold font-mono text-white tabular-nums">
                  {formatIdr(activeModalTrip.actual_cost_idr ?? activeModalTrip.actualCostIdr ?? 0)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Budgeted Cost</span>
                <span className="text-lg font-bold font-mono text-slate-400 tabular-nums">
                  {formatIdr(activeModalTrip.estimated_cost_idr ?? activeModalTrip.estimatedCostIdr ?? 0)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Distance</span>
                <span className="text-lg font-bold font-mono text-white tabular-nums">
                  {activeModalTrip.distance_km ?? activeModalTrip.distanceKm ?? 0} km
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Energy Consumed</span>
                <span className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                  {activeModalTrip.energy_kwh ?? activeModalTrip.energyKwh ?? 0} kWh
                </span>
              </div>
            </div>

            {/* Why Variance Root-Cause */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Root-Cause Why Deconstruction
              </h4>
              <div className="space-y-2">
                {(activeModalTrip.why_variance || activeModalTrip.whyVariance || [
                  { factor: 'Extended VIP Wait Standing HVAC Drain', delta_idr: 12000, explanation: 'Vehicle auxiliary cabin climate maintained during guest terminal wait.' },
                  { factor: 'Peak Expressway Toll Surcharge', delta_idr: 6000, explanation: 'Expressway access fee on Bali Mandara corridor during return trip.' },
                ]).map((factor: any) => (
                  <div key={factor.factor} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white">{factor.factor}</span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">
                        +{formatIdr(factor.delta_idr ?? factor.deltaIdr ?? 0)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {factor.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-semibold cursor-pointer">
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Trip Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#090D14] border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white">Log Electric Fleet Dispatch Trip</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Select Vehicle</label>
                  <select
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.id} - {v.model}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Assigned Driver</label>
                  <input
                    type="text"
                    required
                    value={formDriver}
                    onChange={(e) => setFormDriver(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Trip Route</label>
                <input
                  type="text"
                  required
                  value={formRoute}
                  onChange={(e) => setFormRoute(e.target.value)}
                  placeholder="e.g. DPS Airport -> Ubud Hanging Gardens"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formDistance}
                    onChange={(e) => setFormDistance(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Energy Used (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formEnergy}
                    onChange={(e) => setFormEnergy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Budgeted Estimate (IDR)</label>
                  <input
                    type="number"
                    required
                    value={formEstimatedCost}
                    onChange={(e) => setFormEstimatedCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Tolls & Parking (IDR)</label>
                  <input
                    type="number"
                    required
                    value={formTolls}
                    onChange={(e) => setFormTolls(e.target.value)}
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
                  {submitting ? 'Running Cost Engine...' : 'Calculate & Commit Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
