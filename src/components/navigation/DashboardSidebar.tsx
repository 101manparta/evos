import React from 'react';
import {
  LayoutDashboard,
  Car,
  CarFront,
  Users,
  Route,
  BatteryCharging,
  Wrench,
  Receipt,
  Wallet,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Zap,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EvosLogo } from '../brand/EvosLogo';

interface DashboardSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  leakCount?: number;
  onLogout?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  leakCount = 4,
  onLogout,
}) => {
  const { user, company } = useAuth();

  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Fleet Registry', path: '/dashboard/fleet', icon: Car },
    { label: 'Vehicles', path: '/dashboard/vehicles', icon: CarFront },
    { label: 'Drivers Roster', path: '/dashboard/drivers', icon: Users },
    { label: 'Trips & Routes', path: '/dashboard/trips', icon: Route },
    { label: 'Charging Depot', path: '/dashboard/charging', icon: BatteryCharging },
    { label: 'Maintenance', path: '/dashboard/maintenance', icon: Wrench },
    { label: 'Operating Expenses', path: '/dashboard/expenses', icon: Receipt },
    { label: 'Cost Intelligence', path: '/dashboard/cost-intelligence', icon: Wallet },
    { label: 'Money Leaks', path: '/dashboard/money-leaks', icon: AlertTriangle, badge: leakCount },
    { label: 'Reports', path: '/dashboard/reports', icon: FileText },
    { label: 'What-If Simulator', path: '/dashboard/simulation', icon: SlidersHorizontal },
    { label: 'Platform Admin', path: '/dashboard/admin', icon: ShieldAlert },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#070A0F] border-r border-white/[0.08] transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Collapse Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.08]">
        {!collapsed ? (
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center cursor-pointer text-left focus:outline-none"
            aria-label="Back to EVOS Overview"
          >
            <EvosLogo size="sm" withSubtext={true} animated={true} />
          </button>
        ) : (
          <button
            onClick={() => onNavigate('/')}
            className="mx-auto flex items-center justify-center cursor-pointer focus:outline-none"
            title="EVOS Home"
          >
            <EvosLogo variant="icon" size="sm" animated={true} />
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer ${
            collapsed ? 'mx-auto mt-2 hidden' : ''
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative group cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                }`}
              />

              {!collapsed && <span className="truncate">{item.label}</span>}

              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer Button if Collapsed */}
      {collapsed && (
        <div className="p-2 border-t border-white/[0.08] flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Profile / Operator Info */}
      {!collapsed && (
        <div className="p-3 border-t border-white/[0.08] bg-[#0A0D14]/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-semibold text-xs shrink-0">
                {(company?.name || user?.full_name || 'EV').substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {company?.name || user?.full_name || 'Bali Mobility Corp'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'Active Operator Session'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNavigate('/')}
                className="text-slate-400 hover:text-emerald-400 transition-colors p-1 cursor-pointer"
                title="View Public Landing Page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                  title="Log out of Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
