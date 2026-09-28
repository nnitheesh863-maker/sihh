import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Leaf, ArrowRight, Eye, EyeOff, CheckCircle, Sparkles, Shield, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.94, y: 10, transition: { duration: 0.2 } },
};

const formStagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const errorShake: Variants = {
  shake: { x: [-4, 4, -3, 3, 0], transition: { duration: 0.3 } },
};

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSuccess, onSwitchMode }) => {
  const { login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'FARMER' | 'PROCUREMENT_OFFICER' | 'ADMIN'>('FARMER');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fillDemoAccount = (demoRole: 'FARMER' | 'PROCUREMENT_OFFICER' | 'ADMIN') => {
    setError('');
    if (demoRole === 'FARMER') {
      setEmail('farmer@sih.gov.in');
      setPassword('Password123');
      setName('Sanjay Kumar (Farmer)');
      setPhone('9876543210');
      setRole('FARMER');
    } else if (demoRole === 'PROCUREMENT_OFFICER') {
      setEmail('officer@sih.gov.in');
      setPassword('Password123');
      setName('Vikram Deshmukh (APMC)');
      setPhone('9876543211');
      setRole('PROCUREMENT_OFFICER');
    } else {
      setEmail('admin@sih.gov.in');
      setPassword('Password123');
      setName('System Admin');
      setPhone('9876543212');
      setRole('ADMIN');
    }
  };

  const cleanPhone = (val: string) => {
    return val.replace(/[\s+()-]/g, '').replace(/^91(?=\d{10}$)/, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanedPhone = cleanPhone(phone);
    const cleanedEmail = email.toLowerCase().trim();

    try {
      if (mode === 'login') {
        await login(cleanedEmail, password);
      } else {
        if (!cleanedPhone || cleanedPhone.length < 10) {
          throw new Error('Please enter a valid 10-digit mobile number (e.g. 9876543210)');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await register({
          email: cleanedEmail,
          password,
          name: name.trim(),
          phone: cleanedPhone,
          role,
          village: village.trim() || undefined,
          district: district.trim() || undefined,
        });
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 700);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.error?.details && Array.isArray(data.error.details) && data.error.details.length > 0) {
        setError(data.error.details[0].message || data.error.details[0]);
      } else {
        setError(data?.error?.message || data?.message || err?.message || 'Authentication error. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-8 py-7 text-white relative flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg shadow-emerald-950/20">
                <img src="/logo.png" alt="OnionAI" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Onion<span className="text-emerald-300">AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                  SIH26031 Platform
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-black mt-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Farmer Account'}
            </h2>
            <p className="text-emerald-100 text-xs mt-0.5">
              {mode === 'login'
                ? 'Sign in to access AI onion grading and certificates'
                : 'Join the smart onion quality and disease network'}
            </p>
          </div>

          <div className="px-8 py-6 relative overflow-y-auto flex-1">
            {/* 1-Click Demo Profiles */}
            <div className="mb-5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Quick Demo Access
                </span>
                <span className="text-[9px] font-semibold text-emerald-600">1-Click Fill</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('FARMER')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-slate-700 text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                >
                  <Leaf className="w-3 h-3 text-emerald-500" /> Farmer
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('PROCUREMENT_OFFICER')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-slate-700 text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                >
                  <Building className="w-3 h-3 text-emerald-500" /> APMC
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('ADMIN')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-slate-700 text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                >
                  <Shield className="w-3 h-3 text-emerald-500" /> Admin
                </button>
              </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center"
                >
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: [0.7, 1.15, 1] }} transition={{ duration: 0.4 }}>
                    <CheckCircle className="w-16 h-16 text-emerald-500 mb-3" />
                  </motion.div>
                  <p className="font-extrabold text-slate-900 text-lg">Authenticated Successfully!</p>
                  <p className="text-xs text-slate-500 mt-1">Opening your dashboard...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  variants={errorShake}
                  animate="shake"
                  className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-start gap-2"
                >
                  <span className="text-rose-500 font-black">!</span>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form variants={formStagger} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <motion.div variants={fieldVariants}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sanjay Kumar"
                        className="w-full border border-slate-200 rounded-2xl pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (10 digits)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full border border-slate-200 rounded-2xl pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Village</label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Palakkad"
                        className="w-full border border-slate-200 rounded-2xl px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Nashik"
                        className="w-full border border-slate-200 rounded-2xl px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-2xl px-3.5 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="FARMER">🌾 Farmer — Disease detection & grading</option>
                      <option value="PROCUREMENT_OFFICER">🏛️ Procurement Officer — APMC quality</option>
                      <option value="ADMIN">🛡️ Admin — Full platform management</option>
                    </select>
                  </motion.div>
                </>
              )}

              <motion.div variants={fieldVariants}>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@sih.gov.in"
                    className="w-full border border-slate-200 rounded-2xl pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'register' && (
                  <p className="text-[10px] text-slate-400 mt-1 pl-1 font-medium">Minimum 6 characters</p>
                )}
              </motion.div>

              <motion.button
                variants={fieldVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 text-sm transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In to Platform' : 'Create Free Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Toggle Login / Register */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center text-xs text-slate-500 mt-5">
              {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button
                onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                className="font-extrabold text-emerald-600 hover:text-emerald-700 transition-colors underline-offset-2 hover:underline"
              >
                {mode === 'login' ? 'Register Now' : 'Sign In'}
              </button>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
