import React from 'react';
import { Car, Zap, MapPin, BarChart3, Wrench, Shield } from 'lucide-react';

export const ValueStrip: React.FC = () => {
  const items = [
    { label: 'Fleet Management', icon: Car },
    { label: 'Charging Management', icon: Zap },
    { label: 'Trip & Route Optimization', icon: MapPin },
    { label: 'Cost Analysis & Reporting', icon: BarChart3 },
    { label: 'Maintenance Scheduling', icon: Wrench },
    { label: 'Secure & Multi-User', icon: Shield },
  ];

  return (
    <section className="py-6 border-b border-white/[0.06] bg-[#050608]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Horizontal rounded glass container matching image */}
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-default"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
