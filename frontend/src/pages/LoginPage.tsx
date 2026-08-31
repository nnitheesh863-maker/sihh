import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'FARMER' | 'PROCUREMENT_OFFICER' | 'ADMIN'>('FARMER');
  const [district, setDistrict] = useState('Nashik');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, phone, password, role, district });
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <Sparkles className="h-7 w-7 text-slate-950 font-bold" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            AI Onion Quality Assessment, YOLO11n Disease Detection & Procurement Platform
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleDemoLogin('farmer@example.com', 'Farmer@123')}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-slate-200 border border-slate-800 hover:border-emerald-500/30 transition-all text-center"
            >
              🌾 Farmer
            </button>
            <button
              onClick={() => handleDemoLogin('officer@oniongrading.in', 'Officer@123')}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-slate-200 border border-slate-800 hover:border-emerald-500/30 transition-all text-center"
            >
              🏛️ Officer
            </button>
            <button
              onClick={() => handleDemoLogin('admin@oniongrading.in', 'Admin@123')}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-slate-200 border border-slate-800 hover:border-emerald-500/30 transition-all text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sanjay Kumar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="FARMER">Farmer (Quality Inspection & Scan)</option>
                  <option value="PROCUREMENT_OFFICER">Procurement Officer (APMC Batch Quality)</option>
                  <option value="ADMIN">System Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
          </button>
        </div>

      </div>
    </div>
  );
};
