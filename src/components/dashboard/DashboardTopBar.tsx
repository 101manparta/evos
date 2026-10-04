import React from 'react';
import { Bell, Download, Filter, Menu, ShieldCheck, Zap } from 'lucide-react';

interface DashboardTopBarProps {
  breadcrumbs: string[];
  onOpenMobileMenu?: () => void;
  onExport?: () => void;
  timeRange: string;
  onTimeRangeChange: (val: string) => void;
  notificationsCount?: number;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  breadcrumbs,
  onOpenMobileMenu,
  onExport,
  timeRange,
  onTimeRangeChange,
  notificationsCount = 2,
}) => {
  return (
    <header className="h-16 px-6 md:px-8 border-b border-white/[0.08] bg-[#070A0F]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              {idx > 0 && <span className="text-slate-400">/</span>}
              <span
                className={`${
                  idx === breadcrumbs.length - 1
                    ? 'font-semibold text-white'
                    : 'text-slate-400'
                }`}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-3">
        {/* Timeframe Filter */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="today" className="bg-slate-900 text-white">Today (Realtime)</option>
            <option value="month" className="bg-slate-900 text-white">This Month (Oct 2026)</option>
            <option value="quarter" className="bg-slate-900 text-white">Q3 2026</option>
            <option value="year" className="bg-slate-900 text-white">Year-to-Date</option>
          </select>
        </div>

        {/* Export Button */}
        {onExport && (
          <button
            onClick={onExport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Data</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-colors relative"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4" />
            {notificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-400 hidden lg:inline">SYNCED 10:24 AM</span>
        </div>
      </div>
    </header>
  );
};
