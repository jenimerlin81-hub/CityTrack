import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { X, LogIn, UserPlus, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, quickLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('passenger');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Authentication failed');
        } else {
          onClose();
        }
      } else {
        const res = await register(name, email, password, phone, role);
        if (!res.success) {
          setError(res.error || 'Registration failed');
        } else {
          onClose();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle1ClickLogin = (targetRole: UserRole) => {
    quickLogin(targetRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Sign In to CityTrack' : 'Create CityTrack Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access live GPS routes, ticketing, and portal controls
          </p>
        </div>

        {/* 1-Click Fast Demo Credentials Buttons */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <div className="text-[10px] uppercase font-mono font-bold text-cyan-400 text-center mb-2">
            ⚡ 1-Click Instant Demo Access
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handle1ClickLogin('passenger')}
              className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-750 text-[11px] font-bold text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all text-center"
            >
              Passenger (Priya)
            </button>
            <button
              type="button"
              onClick={() => handle1ClickLogin('driver')}
              className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-750 text-[11px] font-bold text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all text-center"
            >
              Driver (Bus 101)
            </button>
            <button
              type="button"
              onClick={() => handle1ClickLogin('admin')}
              className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-750 text-[11px] font-bold text-purple-300 border border-slate-700 hover:border-purple-500/50 transition-all text-center"
            >
              Admin Controller
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-4 border border-slate-800 text-xs">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'login' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'register' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kannan"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Select Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="passenger">Passenger (Commuter)</option>
                  <option value="driver">Driver (Bus Captain)</option>
                  <option value="admin">Admin (Transport Authority)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98400 00000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. priya@gmail.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
