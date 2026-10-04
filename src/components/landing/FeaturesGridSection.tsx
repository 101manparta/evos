import React from 'react';
import { ArrowRight, Car, Zap, MapPin, BarChart3, Wrench, FileText } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const FeaturesGridSection: React.FC<{ onExploreAll?: () => void }> = ({ onExploreAll }) => {
  const features = [
    {
      title: 'Fleet Management',
      description: 'Kelola kendaraan, driver, dokumen dan status kendaraan dengan mudah.',
      icon: Car,
    },
    {
      title: 'Charging Management',
      description: 'Pantau pengisian daya, biaya charging, dan riwayat transaksi secara otomatis.',
      icon: Zap,
    },
    {
      title: 'Trip & Route Optimization',
      description: 'Rencanakan rute terbaik, perkirakan daya dan biaya sebelum perjalanan.',
      icon: MapPin,
    },
    {
      title: 'Cost Analysis',
      description: 'Hitung biaya per km, per trip, hingga total cost of ownership (TCO).',
      icon: BarChart3,
    },
    {
      title: 'Maintenance',
      description: 'Jadwalkan servis, pantau kondisi baterai dan komponen kendaraan.',
      icon: Wrench,
    },
    {
      title: 'Reports & Analytics',
      description: 'Dapatkan laporan lengkap untuk pengambilan keputusan yang lebih baik.',
      icon: FileText,
    },
  ];

  return (
    <section id="features" className="py-24 border-b border-white/[0.06] bg-[#050608] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fitur Utama</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-['Syne',sans-serif] font-bold text-white tracking-tight leading-tight">
              Solusi Lengkap untuk <br />
              Operasional Fleet EV Anda
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed">
              Dari perjalanan hingga perawatan, semua terintegrasi untuk efisiensi maksimal dan penghematan biaya.
            </p>

            <button
              onClick={onExploreAll}
              className="px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer group"
            >
              <span>Lihat Semua Fitur</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: 2x3 Grid of Feature Cards matching reference */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <GlassCard
                  key={feat.title}
                  className="p-6 space-y-4 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
