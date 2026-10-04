import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Car,
  Calendar,
  FileSpreadsheet,
  RefreshCw,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { expenseApi, vehicleApi } from '../../lib/api/modules';
import { Expense } from '../../types';
import { formatIdr } from '../../lib/formatters';

export const ExpensesTab: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Fields
  const [formVehicle, setFormVehicle] = useState('EV-001');
  const [formCategory, setFormCategory] = useState<Expense['category']>('Charging');
  const [formAmount, setFormAmount] = useState('85000');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formReceipt, setFormReceipt] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState<Expense['status']>('Approved');

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    const [eRes, vRes] = await Promise.all([expenseApi.list(), vehicleApi.list()]);

    if (eRes.success && eRes.data) {
      setExpenses(eRes.data);
    } else {
      setError(eRes.error?.message || 'Failed to fetch operational expenses ledger');
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
    fetchExpenses();
  }, []);

  const openAddModal = () => {
    setFormVehicle(vehicles[0]?.id || 'EV-001');
    setFormCategory('Charging');
    setFormAmount('85000');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormReceipt('REC-' + Math.floor(1000 + Math.random() * 9000));
    setFormDesc('Depot Fast Charging Session peak charge');
    setFormStatus('Approved');
    setShowAddModal(true);
  };

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormVehicle(expense.vehicle_id);
    setFormCategory(expense.category);
    setFormAmount(String(expense.amount_idr));
    setFormDate(expense.date);
    setFormReceipt(expense.receipt_ref);
    setFormDesc(expense.description);
    setFormStatus(expense.status);
    setShowEditModal(true);
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await expenseApi.create({
      vehicle_id: formVehicle,
      category: formCategory,
      amount_idr: Number(formAmount) || 0,
      date: formDate,
      receipt_ref: formReceipt,
      description: formDesc,
      status: formStatus,
    });

    setSubmitting(false);

    if (res.success && res.data) {
      setShowAddModal(false);
      setFeedbackNotice(`Expense ledger entry ${res.data.id} recorded (${formatIdr(res.data.amount_idr)}).`);
      fetchExpenses();
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      setError(res.error?.message || 'Failed to record expense entry');
    }
  };

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpense) return;

    setSubmitting(true);
    setError(null);

    const res = await expenseApi.update(selectedExpense.id, {
      vehicle_id: formVehicle,
      category: formCategory,
      amount_idr: Number(formAmount) || 0,
      date: formDate,
      receipt_ref: formReceipt,
      description: formDesc,
      status: formStatus,
    });

    setSubmitting(false);

    if (res.success) {
      setShowEditModal(false);
      setFeedbackNotice(`Expense entry ${selectedExpense.id} updated successfully.`);
      fetchExpenses();
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      setError(res.error?.message || 'Failed to update expense entry');
    }
  };

  const handleDeleteExpense = async (expense: Expense) => {
    if (!confirm(`Are you sure you want to delete expense record ${expense.id} (${formatIdr(expense.amount_idr)})?`)) {
      return;
    }

    const res = await expenseApi.delete(expense.id);
    if (res.success) {
      setFeedbackNotice(`Expense record ${expense.id} removed from general fleet ledger.`);
      fetchExpenses();
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      alert(res.error?.message || 'Failed to delete expense record');
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesSearch =
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.vehicle_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.receipt_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalCost = expenses.reduce((acc, e) => acc + (e.amount_idr || 0), 0);
  const chargingCost = expenses
    .filter((e) => e.category === 'Charging')
    .reduce((acc, e) => acc + (e.amount_idr || 0), 0);
  const maintCost = expenses
    .filter((e) => e.category === 'Maintenance')
    .reduce((acc, e) => acc + (e.amount_idr || 0), 0);
  const flaggedCount = expenses.filter((e) => e.status === 'Flagged').length;

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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>Operational Expenses & Cost Ledger</span>
          </h2>
          <p className="text-xs text-slate-400">
            Authoritative transactional record of charging, tolls, maintenance, and insurance allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchExpenses}
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
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Recorded</span>
          <div className="text-xl md:text-2xl font-bold text-white font-mono">{formatIdr(totalCost)}</div>
          <span className="text-[10px] text-slate-400">{expenses.length} audited ledger entries</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Energy & Charging</span>
          <div className="text-xl md:text-2xl font-bold text-emerald-400 font-mono">{formatIdr(chargingCost)}</div>
          <span className="text-[10px] text-emerald-400">
            {totalCost > 0 ? Math.round((chargingCost / totalCost) * 100) : 0}% of operating spend
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Maintenance & Parts</span>
          <div className="text-xl md:text-2xl font-bold text-amber-300 font-mono">{formatIdr(maintCost)}</div>
          <span className="text-[10px] text-slate-400">Routine & warranty claims</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-white/[0.08]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Audit Variance Flags</span>
          <div className="text-xl md:text-2xl font-bold text-rose-400 font-mono">{flaggedCount}</div>
          <span className="text-[10px] text-rose-400">Requires operational review</span>
        </GlassCard>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 border-white/[0.08]">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search receipt, vehicle ID, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
            >
              <option value="all">All Expense Categories</option>
              <option value="Charging">Charging</option>
              <option value="Toll & Highway">Toll & Highway</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Driver Allowance">Driver Allowance</option>
              <option value="Insurance">Insurance</option>
              <option value="Registration & Tax">Registration & Tax</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
            >
              <option value="all">All Audit Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Flagged">Flagged</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Ledger Table */}
      <GlassCard className="overflow-hidden border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Expense ID</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description & Receipt</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                    <span>Querying authoritative ledger from Go API...</span>
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No expense records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-white">{expense.id}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                        <Car className="w-3 h-3" />
                        <span>{expense.vehicle_id}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.05] border border-white/[0.1] text-slate-200">
                        <Tag className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{expense.category}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div>
                        <span className="text-white block truncate">{expense.description}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Ref: {expense.receipt_ref}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">{expense.date}</td>

                    <td className="py-3 px-4 font-mono font-bold text-white">{formatIdr(expense.amount_idr)}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          expense.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : expense.status === 'Flagged'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {expense.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(expense)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                          title="Edit Entry"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Entry"
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

      {/* Add / Edit Modal */}
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
                  {showAddModal ? 'Record Fleet Operational Expense' : `Edit Expense Entry (${selectedExpense?.id})`}
                </h3>
                <p className="text-xs text-slate-400">
                  Transaction will be verified and attributed to vehicle TCO metrics
                </p>
              </div>

              <form onSubmit={showAddModal ? handleCreateExpense : handleUpdateExpense} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Vehicle ID</label>
                    <select
                      value={formVehicle}
                      onChange={(e) => setFormVehicle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 cursor-pointer font-mono"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.id} - {v.plate_number || v.plateNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 cursor-pointer"
                    >
                      <option value="Charging">Charging</option>
                      <option value="Toll & Highway">Toll & Highway</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Driver Allowance">Driver Allowance</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Registration & Tax">Registration & Tax</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Amount (IDR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="85000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Transaction Date</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Receipt / Invoice Ref</label>
                  <input
                    type="text"
                    required
                    value={formReceipt}
                    onChange={(e) => setFormReceipt(e.target.value)}
                    placeholder="REC-9021 or INV-HYU-32"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Expense Description</label>
                  <input
                    type="text"
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="e.g. Airport terminal parking surcharge during dispatch"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Audit Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 cursor-pointer"
                  >
                    <option value="Approved">Approved (Verified)</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Flagged">Flagged (Variance Anomaly)</option>
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
                  <span>{showAddModal ? 'Submit to Authoritative Ledger' : 'Commit Changes'}</span>
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
