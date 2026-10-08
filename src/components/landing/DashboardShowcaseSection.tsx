import React from 'react';
import { CheckCircle2, TrendingUp, TrendingDown, Battery, ArrowUpRight, Zap, Car } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { EvosLogo } from '../brand/EvosLogo';

export const DashboardShowcaseSection: React.FC<{ onLaunchConsole: () => void }> = ({ onLaunchConsole }) => {
  return (
    <section className="py-24 border-b border-white/[0.06] bg-[#050608] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Dual Mockup Presentation (Desktop Tablet + Overlapping Mobile Phone) */}
          <div className="lg:col-span-7 relative">
            {/* Desktop Dashboard Card */}
            <div className="rounded-3xl bg-[#090D14] border border-white/[0.12] p-5 sm:p-6 shadow-2xl space-y-5">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <EvosLogo variant="horizontal" size="xs" withSubtext={false} animated={true} />
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-[10px]">
                    B
                  </div>
                </div>
              </div>

              {/* Greeting */}
              <div>
                <h4 className="text-base font-bold text-white">Good Morning, Budi</h4>
                <p className="text-[11px] text-slate-400">Here's your fleet overview today.</p>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-slate-400 block">Total Vehicles</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono text-white tabular-nums">20</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">+ 2%</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-slate-400 block">Total Distance</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono text-white tabular-nums">18.5k km</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">+ 12%</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-slate-400 block">Total Cost</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono text-white tabular-nums">Rp 8.6 jt</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">↓ 8%</span>
                  </div>
                </div>
              </div>

              {/* Monthly Cost Line Chart */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Monthly Cost</span>
                  <span className="font-mono font-bold text-emerald-400">Rp 8.6 jt</span>
                </div>
                {/* SVG glowing graph */}
                <div className="h-20 w-full pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,45 Q40,38 80,48 T160,32 T240,40 T300,20"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M0,45 Q40,38 80,48 T160,32 T240,40 T300,20 L300,60 L0,60 Z"
                      fill="url(#chartGlow)"
                    />
                    {/* Data dots */}
                    {[
                      { x: 0, y: 45 },
                      { x: 42, y: 40 },
                      { x: 80, y: 48 },
                      { x: 120, y: 36 },
                      { x: 160, y: 32 },
                      { x: 200, y: 38 },
                      { x: 240, y: 40 },
                      { x: 300, y: 20 },
                    ].map((dot, idx) => (
                      <circle key={idx} cx={dot.x} cy={dot.y} r="3" fill="#10B981" stroke="#050608" strokeWidth="1.5" />
                    ))}
                  </svg>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                  </div>
                </div>
              </div>

              {/* Recent Trips Mini Table */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">Recent Trips</span>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-white/[0.03] flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">DK 1234 AB</span>
                      <span className="text-slate-400 text-[10px]">Denpasar → Ubud</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>45 km</span>
                      <span className="text-emerald-400 font-bold">Rp 62.300</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">DK 5678 CD</span>
                      <span className="text-slate-400 text-[10px]">Ubud → Kuta</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>78 km</span>
                      <span className="text-emerald-400 font-bold">Rp 104.800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Mobile Phone Screen Mockup (matching reference) */}
            <div className="hidden sm:block absolute -right-4 -bottom-6 w-64 rounded-3xl bg-[#070A0F] border-2 border-white/[0.18] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-3 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-xs font-bold text-white">Vehicle Status</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              {/* Car photo inside phone */}
              <div className="rounded-xl bg-white/[0.04] p-3 text-center space-y-1 border border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white font-mono">DK 1234 AB</span>
                  <span className="text-emerald-400 font-bold font-mono">78%</span>
                </div>
                <span className="text-[10px] text-slate-400 block text-left">BYD Atto 3</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-white/[0.03] flex justify-between">
                  <span className="text-slate-400">Distance Today</span>
                  <span className="font-mono font-bold text-white">245 km</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] flex justify-between">
                  <span className="text-slate-400">Energy Used</span>
                  <span className="font-mono font-bold text-cyan-400">36 kWh</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] flex justify-between">
                  <span className="text-slate-400">Total Cost</span>
                  <span className="font-mono font-bold text-emerald-400">Rp 89.400</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Checklist matching reference */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <EvosLogo variant="icon" size="xs" animated={true} />
              <span>All-in-One Dashboard</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
              Kontrol Penuh <br />
              Dalam Satu Layar
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Pantau semua kendaraan, perjalanan, biaya, dan status pengisian daya secara real-time. Semua data yang Anda butuhkan, dalam satu dashboard yang intuitif.
            </p>

            <ul className="space-y-3.5 pt-2">
              {[
                'Real-time vehicle status',
                'Live trip tracking',
                'Cost breakdown & insights',
                'Export laporan otomatis',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <button
                onClick={onLaunchConsole}
                className="px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.15] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Buka Dashboard Interaktif</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
