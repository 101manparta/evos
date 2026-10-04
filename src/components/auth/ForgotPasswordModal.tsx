import React, { useState } from 'react';
import { X, Mail, Key, Lock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { authApi } from '../../lib/api/modules';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordResetSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onPasswordResetSuccess,
}) => {
  const [step, setStep] = useState<'request' | 'reset' | 'completed'>('request');
  const [email, setEmail] = useState('operations@balimobility.id');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered corporate email.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await authApi.forgotPassword(email);
    setLoading(false);

    if (res.success && res.data) {
      setRecoveryToken(res.data.recovery_token);
      setStep('reset');
    } else {
      setError(res.error?.message || 'Failed to dispatch password recovery token.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryToken || !newPassword) {
      setError('Please provide both recovery token and new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await authApi.resetPassword({
      email,
      token: recoveryToken,
      new_password: newPassword,
    });
    setLoading(false);

    if (res.success) {
      setStep('completed');
    } else {
      setError(res.error?.message || 'Password reset failed. Invalid or expired token.');
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(recoveryToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md">
        <GlassCard className="p-6 md:p-8 space-y-6 border-white/[0.12] shadow-2xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Key className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {step === 'completed'
                  ? 'Password Reset Complete'
                  : step === 'reset'
                  ? 'Verify Recovery Token'
                  : 'Recover Operator Access'}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {step === 'request' && 'Enter your registered email to generate a secure API recovery token.'}
              {step === 'reset' && 'Use your dispatched recovery token to define a new password.'}
              {step === 'completed' && 'Your account credentials have been updated in the authoritative backend.'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Request Token */}
          {step === 'request' && (
            <form onSubmit={handleRequestToken} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Corporate Email</label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{loading ? 'Verifying with Backend...' : 'Generate Recovery Token'}</span>
              </button>
            </form>
          )}

          {/* Step 2: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              {/* Generated token display */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-medium">Dispatched Token:</span>
                  <button
                    type="button"
                    onClick={handleCopyToken}
                    className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm font-bold text-white bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.06]">
                  {recoveryToken}
                </div>
                <p className="text-[10px] text-slate-400">Valid for 15 minutes. Authenticated against Go backend.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Verify Recovery Token</label>
                <input
                  type="text"
                  required
                  value={recoveryToken}
                  onChange={(e) => setRecoveryToken(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{loading ? 'Updating Credentials...' : 'Save New Password'}</span>
              </button>
            </form>
          )}

          {/* Step 3: Completed */}
          {step === 'completed' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300">
                Your password has been successfully reset in the EVOS backend database. You can now log in with your updated credentials.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onPasswordResetSuccess();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs transition-all cursor-pointer"
              >
                Proceed to Login
              </button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
