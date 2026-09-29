import React, { useState } from 'react';
import { ScanLine, ShieldCheck, FileText, ChevronRight, Star, Activity, Leaf, ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { OnionGrowthAnimation } from '../components/OnionGrowthAnimation';
import { motion, Variants } from 'framer-motion';

// Common animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const STATS = [
  { value: '12K+', label: 'Farmers Served' },
  { value: '98%', label: 'Detection Accuracy' },
  { value: '8', label: 'Diseases Detected' },
  { value: '4.9★', label: 'User Rating' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Upload Onion Image', desc: 'Take a photo of your onion using your phone camera or upload from gallery. JPG, PNG, WEBP supported.', icon: <ScanLine className="w-6 h-6" /> },
  { step: '02', title: 'AI Scans for Disease', desc: 'Our YOLO11n model scans the image, draws bounding boxes around affected areas, and calculates severity.', icon: <Activity className="w-6 h-6" /> },
  { step: '03', title: 'Get Full Disease Report', desc: 'See disease name, confidence, affected area %, severity level, symptoms, causes and treatment advice.', icon: <ShieldCheck className="w-6 h-6" /> },
  { step: '04', title: 'Download PDF Certificate', desc: 'Download a digitally signed PDF quality report to present at APMC procurement centers.', icon: <FileText className="w-6 h-6" /> },
];

const SERVICES = [
  { icon: <ScanLine className="w-8 h-8" />, title: 'AI Disease Detection', desc: 'YOLO11n scans for Purple Blotch, Black Mold, Basal Rot, Downy Mildew, Neck Rot with 94%+ confidence.' },
  { icon: <ShieldCheck className="w-8 h-8" />, title: 'Quality Grading', desc: 'Automatic A/B/C and URS grading based on physical damage, disease severity, and visual quality index.' },
  { icon: <FileText className="w-8 h-8" />, title: 'PDF Report Download', desc: 'Professionally formatted certificate with verification QR code — ready for APMC submission.' },
  { icon: <Activity className="w-8 h-8" />, title: 'Crop Health Analytics', desc: 'Track disease trends, severity patterns and scan history across your entire farm over time.' },
];

const TESTIMONIALS = [
  { name: 'Ramesh Patil', role: 'Onion Farmer, Nashik', rating: 5, text: 'The app detected Black Mold in my onions before it spread. Saved my harvest from devastating storage loss.' },
  { name: 'Sunita Deshmukh', role: 'Farmer, Solapur', rating: 5, text: 'Very easy to use. Just clicked a photo and in seconds I got a full report with exact fungicide and curing advice.' },
  { name: 'Vikram Singh', role: 'APMC Officer, Pune', rating: 5, text: 'The digital quality grading certificate is very professional. Procurement decisions are now transparent and data-driven.' },
];

export const LandingPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true); };
  const openRegister = () => { setAuthMode('register'); setAuthOpen(true); };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onEnterApp}>
            <div className="h-10 w-auto flex items-center justify-center">
              <img src="/logo.png" alt="PeelVision AI Logo" className="h-full w-auto object-contain scale-110" />
            </div>
            <span className="text-xl font-black text-gray-900">PeelVision<span className="text-emerald-600">AI</span></span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#about" className="hover:text-emerald-600 transition-colors">About</a>
            <a href="#growth-engine" className="hover:text-emerald-600 transition-colors">3D Growth Simulator</a>
            <a href="#services" className="hover:text-emerald-600 transition-colors">Services</a>
            <a href="#how" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={openLogin} className="text-sm font-bold text-gray-700 hover:text-emerald-600 transition-colors">Sign In</button>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={openRegister} 
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full transition-colors shadow-sm">
              Get Started →
            </motion.button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 text-sm font-semibold text-gray-700">
            <a href="#about" className="block hover:text-emerald-600">About</a>
            <a href="#growth-engine" className="block hover:text-emerald-600">3D Simulator</a>
            <a href="#services" className="block hover:text-emerald-600">Services</a>
            <a href="#how" className="block hover:text-emerald-600">How It Works</a>
            <div className="flex gap-3 pt-2">
              <button onClick={openLogin} className="flex-1 py-2 border border-gray-300 rounded-lg text-center hover:border-emerald-600 hover:text-emerald-600 transition-colors">Sign In</button>
              <button onClick={openRegister} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-center hover:bg-emerald-700 transition-colors">Register</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background farm image */}
        <div className="absolute inset-0 z-0">
          <img src="/hero-farm.jpg" alt="Onion farm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Smart Crop Intelligence · SIH 2026</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
                Onion Disease<br />
                Detection, <em className="text-emerald-400 not-italic">done<br />right now.</em>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">
                AI-powered onion quality assessment using YOLO11n computer vision. Upload a photo — get instant disease diagnosis across 8 classes, APMC grade analysis, and a digitally verified certificate in seconds.
              </motion.p>

              {/* Hero CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-10">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openRegister}
                  className="flex items-center gap-2 px-7 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full transition-all shadow-xl shadow-emerald-500/30 text-sm"
                >
                  Start Free Analysis
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openLogin}
                  className="flex items-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-extrabold rounded-full transition-all backdrop-blur-sm text-sm"
                >
                  Sign In
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Social Proof */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['👨‍🌾','👩‍🌾','👨‍🔬','👩‍🔬'].map((emoji, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-emerald-800 border-2 border-white flex items-center justify-center text-sm">{emoji}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">Trusted by <strong className="text-white">12,000+</strong> farmers & APMC officers</p>
                </div>
              </motion.div>
            </div>

            {/* Right Hero: Live 3D Onion Growth In Soil Animation Widget */}
            <motion.div variants={fadeInUp} className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -top-4 -right-4 px-3.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full shadow-lg z-20 animate-bounce">
                  ✨ Interactive 3D Growth
                </div>
                <OnionGrowthAnimation interactive />
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Stat cards overlapping hero bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-t-2xl overflow-hidden shadow-xl">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white px-6 py-5 text-center">
                  <p className="text-2xl font-black text-emerald-600">{s.value}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3D GROWTH ENGINE SHOWCASE SECTION ──────────────────────────── */}
      <section id="growth-engine" className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Soil Biology & Growth Modeling
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Simulating Onion Life Cycle & <span className="text-emerald-400">Pathogen Vulnerability</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                From initial germination to deep root anchoring, bulb scale swelling, and foliage emergence — our AI engine calculates disease susceptibility at each distinct crop stage.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl">🌱</span>
                  <h4 className="text-sm font-bold text-white mt-2">Germination & Roots</h4>
                  <p className="text-xs text-slate-400 mt-1">Fusarium Basal Rot monitoring at root plate</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl">🧅</span>
                  <h4 className="text-sm font-bold text-white mt-2">Bulb Maturation</h4>
                  <p className="text-xs text-slate-400 mt-1">Black Mold & Neck Rot prevention during curing</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={openRegister}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-full transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  Test Your Crop Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <OnionGrowthAnimation interactive />
            </div>

          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">About PeelVision AI</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-6">
                We started with a simple goal: <em className="text-emerald-600 not-italic">protect India's onion farmers.</em>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                India is the world's second-largest onion producer — yet post-harvest disease losses devastate up to 30% of yield annually. PeelVision AI combines YOLO11n computer vision with agronomic knowledge to give every farmer instant, accurate disease diagnosis in their pocket.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our platform connects farmers, agronomists, and APMC procurement officers on a single unified digital network.
              </p>
              <div className="flex gap-4">
                <button onClick={openRegister} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-colors text-sm">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={openLogin} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">
                  Sign In ↗
                </button>
              </div>
            </div>
            <div className="relative">
              <img src="/hero-farm.jpg" alt="Onion field" className="rounded-3xl shadow-2xl w-full h-80 object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-gray-900">100% Satisfaction</p>
                  <p className="text-xs text-gray-500">Quality Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-start justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Our Services</p>
              <h2 className="text-4xl font-black text-gray-900">Everything your<br /><em className="text-emerald-600 not-italic">crop needs</em></h2>
            </div>
            <p className="text-gray-500 text-sm max-w-sm mt-4">We handle the full seasonal crop health cycle — from seed planting to APMC procurement.</p>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div key={i} variants={fadeInUp} className="group bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-50 group-hover:bg-emerald-600 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
                  <div className="text-emerald-600 group-hover:text-white transition-colors duration-300">{s.icon}</div>
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-lg">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{s.desc}</p>
                <button onClick={openRegister} className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Our Process</p>
            <h2 className="text-4xl font-black text-gray-900">How we work,<br /><em className="text-emerald-600 not-italic">start to finish</em></h2>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 z-0"></div>

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white border-[6px] border-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black text-xl shadow-lg mb-6 shadow-emerald-100">
                  {i + 1}
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 w-full h-full flex flex-col items-center hover:shadow-lg transition-shadow">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">{step.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-black text-gray-900 mb-12">Trusted by farmers<br />across India</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">👨‍🌾</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
        id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/hero-farm.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.p variants={fadeInUp} className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Get Started Today</motion.p>
          <motion.h2 variants={fadeInUp} className="text-5xl font-black text-white mb-6">Protect your<br />onion harvest now.</motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-300 text-lg mb-10">Free for all farmers. Backed by YOLO11 AI vision. Trusted at APMC procurement centers across India.</motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
            <button onClick={openRegister} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full transition-colors shadow-lg shadow-emerald-500/30 text-sm">
              Register as Farmer →
            </button>
            <button onClick={openLogin} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-full transition-colors text-sm">
              Already have an account
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 py-8 text-center border-t border-slate-800">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-8 w-auto flex items-center justify-center grayscale brightness-200">
            <img src="/logo.png" alt="PeelVision AI Logo" className="h-full w-auto object-contain" />
          </div>
          <span className="text-white font-black text-lg">PeelVision<span className="text-emerald-400">AI</span></span>
        </div>
        <p className="text-gray-400 text-xs">PeelVision AI — AI-Powered Onion Quality Assessment & Disease Grading Platform</p>
        <p className="text-gray-600 text-xs mt-1">Built with React · Vite · Node.js · FastAPI · YOLO11n · Supabase</p>
      </footer>

      {/* ── AUTH MODAL ─────────────────────────────────────────────────── */}
      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onSuccess={onEnterApp}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      )}
    </div>
  );
};
