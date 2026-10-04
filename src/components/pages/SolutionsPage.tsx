import React from 'react';
import { ArrowRight, Building2, Plane, Truck, Check, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface SolutionsPageProps {
  onLaunchDemo: () => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onLaunchDemo }) => {
  const solutions = [
    {
      title: 'Luxury Hospitality & Island Resorts',
      subtitle: 'Nusa Dua, Seminyak, Ubud & Uluwatu Resort Shuttles',
      description: 'Preserve hotel brand prestige with quiet, emissions-free luxury guest transfers while auditing air-conditioning drain during extended guest waiting periods.',
      savings: 'Rp 2.4M saved / shuttle / month',
      icon: Building2,
      points: [
        'HVAC cabin standstill optimization while waiting at airport gates',
        'Guest route cost attribution for concierge billing accuracy',
        'VIP fleet health telemetry for seamless guest arrivals',
      ],
    },
    {
      title: 'Airport VIP & Corporate Travel Services',
      subtitle: 'Ngurah Rai Airport (DPS) to South Bali Corridor',
      description: 'Isolate toll gate expenses, peak daytime fast-charging surcharges, and high-speed bypass energy efficiency across executive electric sedans.',
      savings: 'Rp 1.8M saved / vehicle / month',
      icon: Plane,
      points: [
        'Toll expressway automated expense reconciliation',
        'Fast-charge vs depot charging optimization during layovers',
        'Live range certainty for long-distance transfers to North Bali',
      ],
    },
    {
      title: 'Last-Mile Green Logistics & Light Cargo',
      subtitle: 'Urban Delivery & Retail Distribution Fleets',
      description: 'Ensure maximum vehicle uptime, minimize tire wear on steep island inclines, and eliminate fuel theft risks with 100% electrified commercial vans.',
      savings: 'Rp 3.1M saved / van / month',
      icon: Truck,
      points: [
        'Zero fuel receipts or diesel theft vulnerabilities',
        'Automated overnight depot charging schedules for shift readiness',
        'Tire wear predictive rotation to prevent roadside breakdowns',
      ],
    },
  ];

  return (
    <div className="pt-28 pb-20 space-y-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl space-y-4 mb-16">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            Tailored Industry Solutions
          </p>
          <h1 className="text-4xl sm:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
            Purpose-Built For High-Utilization Fleets.
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Whether managing five-star hotel shuttle vans in Bali or corporate executive sedans across Jakarta, EVOS protects your transport margins.
          </p>
        </div>

        <div className="space-y-8">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <GlassCard key={sol.title} className="p-8 md:p-10 space-y-6 border-white/[0.08]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{sol.title}</h3>
                      <p className="text-xs text-slate-400">{sol.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/25 whitespace-nowrap self-start md:self-auto">
                    {sol.savings}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <p className="lg:col-span-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {sol.description}
                  </p>
                  <ul className="lg:col-span-6 space-y-2 text-xs text-slate-400">
                    {sol.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="pt-8 text-center">
          <button
            onClick={onLaunchDemo}
            className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-sm font-bold inline-flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <span>Explore Industry Demo Datasets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
