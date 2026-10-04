import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, Check, FileSpreadsheet, ArrowUpRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const ReportsTab: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('fleet-cost');
  const [dateRange, setDateRange] = useState<string>('oct-2026');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'fleet-cost',
      title: 'Executive Fleet Cost & Ledger Report',
      description: 'Comprehensive financial accounting: energy kWh tariffs, driver allowances, toll amortization, and cost per kilometer.',
      frequency: 'Monthly CFO Audit',
      size: '1.4 MB PDF',
    },
    {
      id: 'charging-report',
      title: 'Depot vs Public Charging Audit',
      description: 'Breakdown of DC 150kW fast vs overnight AC wallbox sessions, PLN tariff variance, and battery health degradation.',
      frequency: 'Bi-Weekly Operations',
      size: '980 KB PDF',
    },
    {
      id: 'maintenance-report',
      title: 'Predictive Maintenance & Warranty Ledger',
      description: 'Tire rotation schedules, cooling pump repairs, warranty reimbursement claims, and service workshop expenses.',
      frequency: 'Monthly Engineering',
      size: '1.1 MB PDF',
    },
    {
      id: 'efficiency-report',
      title: 'Vehicle Efficiency & Driver Scorecard',
      description: 'Rankings of kWh/100km consumption per vehicle, route terrain impact, and driver regeneration efficiency.',
      frequency: 'Weekly Dispatch',
      size: '720 KB PDF',
    },
    {
      id: 'ev-ice-report',
      title: 'EV vs ICE Comparative Savings Audit',
      description: 'Direct comparison against combustion petrol/diesel benchmark fleet for ESG corporate board presentations.',
      frequency: 'Quarterly Board',
      size: '2.2 MB PDF',
    },
    {
      id: 'management-report',
      title: 'Monthly Management Board Summary',
      description: 'High-level synthesis with executive recommendations on asset reallocation and fleet electrification expansion.',
      frequency: 'Executive Summary',
      size: '3.0 MB PDF',
    },
  ];

  const triggerExport = (format: 'PDF' | 'CSV') => {
    const reportName = reportTypes.find((r) => r.id === selectedReport)?.title || 'Report';
    setExportNotice(`Exporting "${reportName}" as ${format}... Generated mock download file.`);
    setTimeout(() => {
      setExportNotice(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export CFO-ready audit sheets, energy telemetry ledgers, and ESG decarbonization certifications
          </p>
        </div>

        {/* Global Export Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerExport('CSV')}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => triggerExport('PDF')}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_16px_rgba(16,185,129,0.2)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Banner */}
      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter Options */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4 border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="oct-2026" className="bg-slate-900">Current Month (October 2026)</option>
              <option value="sep-2026" className="bg-slate-900">September 2026</option>
              <option value="q3-2026" className="bg-slate-900">Q3 2026 Full Quarter</option>
              <option value="ytd-2026" className="bg-slate-900">Year-to-Date 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <span className="text-slate-400">Vehicle Scope:</span>
            <select className="bg-transparent text-slate-200 focus:outline-none cursor-pointer">
              <option className="bg-slate-900">All 20 Registered EVs</option>
              <option className="bg-slate-900">Executive Sedans (Ioniq 6 / Seal)</option>
              <option className="bg-slate-900">VIP Shuttles (Ioniq 5 / Denza D9)</option>
              <option className="bg-slate-900">Light Cargo (Wuling Air EV)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <span className="text-slate-400">Depot Hub:</span>
            <select className="bg-transparent text-slate-200 focus:outline-none cursor-pointer">
              <option className="bg-slate-900">All Bali Depots (Denpasar, Sanur, Ubud)</option>
              <option className="bg-slate-900">Denpasar South Hub</option>
              <option className="bg-slate-900">Sanur Service Point</option>
              <option className="bg-slate-900">Seminyak Executive Fleet</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">Currency: IDR (Rupiah)</span>
      </GlassCard>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportTypes.map((rep) => {
          const isSelected = selectedReport === rep.id;
          return (
            <GlassCard
              key={rep.id}
              glow={isSelected}
              interactive
              onClick={() => setSelectedReport(rep.id)}
              className={`p-6 flex flex-col justify-between space-y-4 transition-all cursor-pointer ${
                isSelected ? 'border-emerald-500/40 bg-[#0E151F]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                    {rep.frequency}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                  {rep.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {rep.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">{rep.size}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerExport('PDF');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Download</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
