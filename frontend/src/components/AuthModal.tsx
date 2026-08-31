import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Leaf, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } }
};

const formStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const errorShake = {
  shake: { x: [-4, 4, -3, 3, 0], transition: { duration: 0.3 } }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, name, phone, role, village, district });
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1000);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        // Display the first validation error message explicitly
        setError(data.errors[0].message || data.errors[0]);
      } else {
        setError(data?.message || err?.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-8 py-8 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm">
                <img src="/logo.png" alt="OnionAI Logo" className="w-full h-full object-contain scale-110" />
              </div>
              <span className="text-2xl font-black">OnionAI</span>
            </div>
            <h2 className="text-2xl font-black">
              {mode === 'login' ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="text-green-100 text-sm mt-1">
              {mode === 'login' ? 'Sign in to your OnionAI account' : 'Join thousands of farmers using OnionAI'}
            </p>
          </div>

          <div className="px-8 py-6 relative">
            {/* Success Overlay */}
            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center">
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: [0.7, 1.1, 1] }} transition={{ duration: 0.4 }}>
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  </motion.div>
                  <p className="font-bold text-gray-900 text-lg">Success!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div variants={errorShake} animate="shake" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form variants={formStagger} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <motion.div variants={fieldVariants}>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Sanjay Kumar" className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                    </div>
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                    </div>
                  </motion.div>
                  <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Village (Optional)</label>
                      <input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="E.g. Palakkad" className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">District (Optional)</label>
                      <input type="text" value={district} onChange={e => setDistrict(e.target.value)} placeholder="E.g. Nashik" className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                    </div>
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Role</label>
                    <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                      <option value="FARMER">🌾 Farmer — Disease detection & grading</option>
                      <option value="PROCUREMENT_OFFICER">🏛️ Procurement Officer — APMC batch quality</option>
                      <option value="ADMIN">🛡️ Admin — System administration</option>
                    </select>
                  </motion.div>
                </>
              )}

              <motion.div variants={fieldVariants}>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="farmer@example.com" autoComplete="off" className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                </div>
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.button variants={fieldVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm transition-all">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.form>

          {/* Toggle mode */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center text-xs text-gray-500 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
              className="font-bold text-green-600 hover:text-green-700 transition-colors"
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
