import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.register(email, password, name);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.demoLogin();
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      // Fallback demo user
      const fallbackUser: User = {
        id: 'demo-user',
        email: 'creator@vidcraft.ai',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Pro Creator'
      };
      onSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md rounded-2xl border border-studio-700 bg-studio-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-studio-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-violet/30">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-white">
              VidCraft <span className="text-brand-cyan">AI</span> Account
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>1-Click Instant Demo Login (No signup needed)</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-studio-800" />
            <span className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">Or continue with email</span>
            <div className="flex-1 h-px bg-studio-800" />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="text-[11px] text-studio-400 block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-studio-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-studio-800 border border-studio-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-studio-500 outline-none focus:border-brand-violet"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] text-studio-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-studio-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-studio-800 border border-studio-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-studio-500 outline-none focus:border-brand-violet"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-studio-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-studio-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-studio-800 border border-studio-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-studio-500 outline-none focus:border-brand-violet"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-brand-violet/25 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{mode === 'login' ? 'Sign In to Studio' : 'Create Creator Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-studio-400 pt-2">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-brand-cyan hover:underline font-semibold"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-brand-cyan hover:underline font-semibold"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
