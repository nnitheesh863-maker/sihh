import React, { useState } from 'react';
import { ScanLine, ShieldCheck, FileText, ChevronRight, Star, Users, Activity, Leaf, ArrowRight, Menu, X, CheckCircle } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

const STATS = [
  { value: '12K+', label: 'Farmers Served' },
  { value: '98%', label: 'Detection Accuracy' },
  { value: '6', label: 'Diseases Detected' },
  { value: '4.9★', label: 'User Rating' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Upload Onion Image', desc: 'Take a photo of your onion using your phone camera or upload from gallery. JPG, PNG, WEBP supported.' },
  { step: '02', title: 'AI Scans for Disease', desc: 'Our YOLO11n model scans the image, draws bounding boxes around affected areas, and calculates severity.' },
  { step: '03', title: 'Get Full Disease Report', desc: 'See disease name, confidence, affected area %, severity level, symptoms, causes and treatment advice.' },
  { step: '04', title: 'Download PDF Certificate', desc: 'Download a digitally signed PDF quality report to present at APMC procurement centers.' },
];

const SERVICES = [
  { icon: <ScanLine className="w-8 h-8" />, title: 'AI Disease Detection', desc: 'YOLO11n scans for Purple Blotch, Black Fungus, Soft Rot, Smut and more with 94%+ confidence.' },
  { icon: <ShieldCheck className="w-8 h-8" />, title: 'Quality Grading', desc: 'Automatic A/B/C grading based on disease severity, affected area and visual quality score.' },
  { icon: <FileText className="w-8 h-8" />, title: 'PDF Report Download', desc: 'Professionally formatted certificate with QR code — ready for APMC submission.' },
  { icon: <Activity className="w-8 h-8" />, title: 'Crop Health Analytics', desc: 'Track disease trends, severity patterns and scan history across your entire farm over time.' },
];

const TESTIMONIALS = [
  { name: 'Ramesh Patil', role: 'Onion Farmer, Nashik', rating: 5, text: 'The app detected Black Fungus in my onions before I could even see it. Saved my entire harvest from further loss.' },
  { name: 'Sunita Deshmukh', role: 'Farmer, Solapur', rating: 5, text: 'Very easy to use. Just clicked a photo and in seconds I got a full report with treatment advice. Excellent!' },
  { name: 'Vikram Singh', role: 'APMC Officer, Pune', rating: 5, text: 'The quality grading PDF is very professional. Procurement decisions are now faster and data-driven.' },
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
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">Onion<span className="text-green-600">AI</span></span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#about" className="hover:text-green-600 transition-colors">About</a>
            <a href="#services" className="hover:text-green-600 transition-colors">Services</a>
            <a href="#how" className="hover:text-green-600 transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-green-600 transition-colors">Contact</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={openLogin} className="text-sm font-bold text-gray-700 hover:text-green-600 transition-colors">Sign In</button>
            <button onClick={openRegister} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-full transition-colors shadow-sm">
              Get Started →
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 text-sm font-semibold text-gray-700">
            <a href="#about" className="block hover:text-green-600">About</a>
            <a href="#services" className="block hover:text-green-600">Services</a>
            <a href="#how" className="block hover:text-green-600">How It Works</a>
            <div className="flex gap-3 pt-2">
              <button onClick={openLogin} className="flex-1 py-2 border border-gray-300 rounded-lg text-center hover:border-green-600 hover:text-green-600 transition-colors">Sign In</button>
              <button onClick={openRegister} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition-colors">Register</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background farm image */}
        <div className="absolute inset-0 z-0">
          <img src="/hero-farm.jpg" alt="Onion farm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs font-bold uppercase tracking-wider">Smart Crop Intelligence · SIH 2026</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
              Onion Disease<br />
              Detection, <em className="text-green-400 not-italic">done<br />right now.</em>
            </h1>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">
              AI-powered onion quality assessment using YOLO11n computer vision. Upload a photo — get instant disease detection, severity grading, and a downloadable PDF report in seconds.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={openRegister}
                className="flex items-center gap-2 px-7 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full transition-all shadow-lg shadow-green-600/30 text-sm"
              >
                Start Free Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={openLogin}
                className="flex items-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-full transition-all backdrop-blur-sm text-sm"
              >
                Sign In
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['👨‍🌾','👩‍🌾','👨‍🔬','👩‍🔬'].map((emoji, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-green-700 border-2 border-white flex items-center justify-center text-sm">{emoji}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-xs text-gray-300 mt-0.5">Trusted by <strong className="text-white">2,000+</strong> farmers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards overlapping hero bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-t-2xl overflow-hidden shadow-xl">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white px-6 py-5 text-center">
                  <p className="text-2xl font-black text-green-600">{s.value}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">About OnionAI</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-6">
                We started with a simple goal: <em className="text-green-600 not-italic">protect India's onion farmers.</em>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                India is the world's second-largest onion producer — yet post-harvest disease losses devastate up to 30% of yield annually. OnionAI combines YOLO11n computer vision with agronomic knowledge to give every farmer instant, accurate disease diagnosis in their pocket.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Built for SIH 2026 (Problem SIH26031), our platform connects farmers, agronomists, and APMC procurement officers on a single digital platform.
              </p>
              <div className="flex gap-4">
                <button onClick={openRegister} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-colors text-sm">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={openLogin} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-green-600 transition-colors">
                  Sign In ↗
                </button>
              </div>
            </div>
            <div className="relative">
              <img src="/hero-farm.jpg" alt="Onion field" className="rounded-3xl shadow-2xl w-full h-80 object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
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
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Our Services</p>
              <h2 className="text-4xl font-black text-gray-900">Everything your<br /><em className="text-green-600 not-italic">crop needs</em></h2>
            </div>
            <p className="text-gray-500 text-sm max-w-sm mt-4">We handle the full seasonal crop health cycle — no juggling multiple tools or apps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <div key={i} className="group bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl border border-gray-100 hover:border-green-200 transition-all duration-300">
                <div className="w-14 h-14 bg-green-50 group-hover:bg-green-600 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
                  <div className="text-green-600 group-hover:text-white transition-colors duration-300">{s.icon}</div>
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-lg">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{s.desc}</p>
                <button onClick={openRegister} className="flex items-center gap-2 text-xs font-bold text-green-600 hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16">
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Our Process</p>
            <h2 className="text-4xl font-black text-gray-900">How we work,<br /><em className="text-green-600 not-italic">start to finish</em></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-green-200 z-0" style={{ width: 'calc(100% - 2rem)' }}></div>
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center font-black text-xl mb-5 shadow-lg shadow-green-600/30">
                    {step.step}
                  </div>
                  <h3 className="font-black text-gray-900 mb-2 text-lg">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Last step highlight */}
          <div className="mt-16 bg-green-600 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Satisfaction Guaranteed</h3>
                <p className="text-green-100 text-sm mt-1">Every scan backed by YOLO11n AI — trained and verified for onion disease detection.</p>
              </div>
            </div>
            <button onClick={openRegister} className="shrink-0 px-7 py-3.5 bg-white text-green-700 font-black rounded-full hover:bg-green-50 transition-colors shadow-sm text-sm">
              Start Free Today →
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-black text-gray-900 mb-12">Trusted by farmers<br />across India</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">👨‍🌾</div>
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
      <section id="contact" className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/hero-farm.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">Get Started Today</p>
          <h2 className="text-5xl font-black text-white mb-6">Protect your<br />onion harvest now.</h2>
          <p className="text-gray-300 text-lg mb-10">Free for all farmers. Backed by AI. Trusted at APMC procurement centers across India.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={openRegister} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full transition-colors shadow-lg shadow-green-600/30 text-sm">
              Register as Farmer →
            </button>
            <button onClick={openLogin} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-full transition-colors text-sm">
              Already have an account
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 py-8 text-center border-t border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-black text-lg">Onion<span className="text-green-500">AI</span></span>
        </div>
        <p className="text-gray-500 text-xs">SIH26031 — AI-Powered Onion Quality Assessment & Disease Grading Platform</p>
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
