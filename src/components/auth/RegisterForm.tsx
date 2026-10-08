import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Building, User, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { EvosLogo } from '../brand/EvosLogo';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onNavigateLogin: () => void;
  onBackToHome: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
  onBackToHome,
}) => {
  const { register } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !fullName || !email || !password) {
      setError('Please fill out all enterprise registration fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);

    const res = await register({
      company_name: companyName,
      full_name: fullName,
      email,
      password,
    });
    setLoading(false);

    if (res.success) {
      onRegisterSuccess();
    } else {
      setError(res.error || 'Enterprise registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#050607] relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/[0.04] blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <button
          onClick={onBackToHome}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to EVOS Overview</span>
        </button>

        <GlassCard className="p-8 space-y-6 border-white/[0.1] shadow-2xl">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-1">
              <EvosLogo variant="badge" size="lg" withText={false} animated={true} glow="high" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Create Enterprise Account
            </h2>
            <p className="text-xs text-slate-400">
              Deploy true cost intelligence for your commercial EV fleet
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Company Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Bali Mobility Corp"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Full Name (Operations Lead)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Wayan Sudarta"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="wayan@balimobility.id"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Initialize Fleet Deployment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/[0.06] text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <button
              onClick={onNavigateLogin}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer ml-1"
            >
              Log in to Console
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
