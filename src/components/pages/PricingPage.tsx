import React from 'react';
import { Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface PricingPageProps {
  onSelectPlan: (plan: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  const plans = [
    {
      name: 'Starter Fleet',
      target: 'For boutique hospitality & early EV pilots',
      price: 'Rp 2.900.000',
      cadence: 'per month billed annually',
      popular: false,
      features: [
        'Up to 10 Electric Vehicles',
        'Real-time True Cost / KM Engine',
        'Depot Charging Telemetry & Loggers',
        'Basic Money Leak Alarms (Email / Web)',
        'Monthly PDF Management Export',
        'Single Depot Hub Location',
      ],
      cta: 'Start 14-Day Pilot',
    },
    {
      name: 'Scale Operations',
      target: 'For commercial transport & multi-depot fleets',
      price: 'Rp 6.800.000',
      cadence: 'per month billed annually',
      popular: true,
      features: [
        'Up to 35 Electric Vehicles',
        'Advanced Root-Cause "Why?" Deconstruction',
        'Automated Tariff Surcharge Detection',
        'Predictive Maintenance & Warranty Recovery',
        'Multi-Depot Support (Denpasar, Sanur, Ubud)',
        'What-If Electrification Scenario Simulator',
        'Custom CSV Financial Ledger Integrations',
        'Role-Based Dispatch & CFO Access',
      ],
      cta: 'Deploy Scale Platform',
    },
    {
      name: 'Enterprise Fleet',
      target: 'For regional transport networks & 50+ assets',
      price: 'Rp 14.500.000',
      cadence: 'per month custom billing',
      popular: false,
      features: [
        'Unlimited Electric Vehicles & Chargers',
        'Direct CAN-bus Hardware Gateway Integration',
        'Dedicated Fleet Cost Optimization Engineer',
        'Custom Go REST API Webhooks & ERP Sync',
        'PLN Commercial Tariff Automated Auditing',
        'Quarterly On-Site Fleet Telemetry Audits',
        'SLA 99.9% Uptime & 24/7 Priority Hotline',
      ],
      cta: 'Contact Enterprise Team',
    },
  ];

  return (
    <div className="pt-28 pb-20 space-y-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            Predictable Transparent Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
            Invest in Margin Protection.
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every subscription pays for itself multiple times over by eradicating peak tariff penalties, unverified maintenance invoices, and idle battery depreciation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((p) => (
            <GlassCard
              key={p.name}
              glow={p.popular}
              className={`p-8 flex flex-col justify-between space-y-8 relative ${
                p.popular ? 'border-emerald-500/40 bg-[#0C131C]' : 'border-white/[0.08]'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-400 text-black text-[10px] font-bold font-mono tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  Most Popular For Bali Fleets
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.target}</p>
                </div>

                <div className="pt-2 border-t border-white/[0.08]">
                  <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                    {p.price}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{p.cadence}</span>
                </div>

                <ul className="space-y-2.5 pt-4 text-xs text-slate-300">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan(p.name)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  p.popular
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1]'
                }`}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>

        {/* Enterprise Security Banner */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Enterprise data isolation: End-to-end encrypted CAN-bus telemetry, compliant with Indonesian PDP Act.</span>
          </div>
          <span className="font-mono text-slate-400">REST API Ready for Go</span>
        </div>
      </div>
    </div>
  );
};
