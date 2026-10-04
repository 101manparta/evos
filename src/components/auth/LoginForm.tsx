import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Zap, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onNavigateRegister: () => void;
  onBackToHome: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  onBackToHome,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('operations@balimobility.id');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both corporate email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setError(res.error || 'Authentication rejected by EVOS backend.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#050607] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/[0.04] blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Back to website */}
        <button
          onClick={onBackToHome}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to EVOS Overview</span>
        </button>

        {/* Card */}
        <GlassCard className="p-8 space-y-6 border-white/[0.1] shadow-2xl">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight text-white">
                EVOS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sign In to Fleet Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Access real-time cost telemetry and anomaly detection
            </p>
          </div>

          {notification && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              {notification}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Business Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operations@balimobility.id"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-slate-400 hover:text-emerald-400 text-[11px] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
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

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-emerald-400 bg-white/[0.1] border-white/[0.2] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-slate-400 text-xs cursor-pointer select-none">
                Remember operator session
              </label>
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
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials hint */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
            <span className="text-slate-300 font-medium block">Pre-configured Demo Credentials:</span>
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>operations@balimobility.id</span>
              <span>password123</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] text-center text-xs text-slate-400">
            <span>New EV fleet operator? </span>
            <button
              onClick={onNavigateRegister}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer ml-1"
            >
              Register Enterprise Account
            </button>
          </div>
        </GlassCard>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onPasswordResetSuccess={() => {
          setNotification('Password successfully reset. Please log in with your updated credentials.');
          setTimeout(() => setNotification(null), 6000);
        }}
      />
    </div>
  );
};
