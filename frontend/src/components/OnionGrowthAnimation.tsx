import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Leaf, Sun, Droplets, ShieldCheck } from 'lucide-react';

interface OnionGrowthAnimationProps {
  progress?: number; // 0 to 100
  interactive?: boolean;
  compact?: boolean;
  statusText?: string;
}

export const OnionGrowthAnimation: React.FC<OnionGrowthAnimationProps> = ({
  progress: controlledProgress,
  interactive = false,
  compact = false,
  statusText,
}) => {
  const [internalProgress, setInternalProgress] = useState(25);
  const [autoPlay, setAutoPlay] = useState(!interactive && controlledProgress === undefined);

  // Auto-cycle progress if in autoplay mode
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setInternalProgress((prev) => (prev >= 100 ? 10 : prev + 1.2));
    }, 50);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const p = controlledProgress !== undefined ? controlledProgress : internalProgress;
  const progressRatio = Math.min(100, Math.max(0, p)) / 100;

  // Growth Stage Definitions
  const stageName =
    p < 25
      ? 'Phase 1: Seed Germination'
      : p < 55
      ? 'Phase 2: Root Deepening'
      : p < 85
      ? 'Phase 3: Bulb Layering & Swelling'
      : 'Phase 4: Lush Foliage & Harvest Ready';

  // Dynamic Scale & Metrics based on growth progress
  const bulbScale = 0.35 + progressRatio * 0.85; // 0.35 -> 1.2
  const rootDepth = 15 + progressRatio * 55; // 15px -> 70px
  const sproutHeight = progressRatio * 90; // 0px -> 90px
  const bulbY = -5 - progressRatio * 8; // Sits partly embedded in soil

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-sky-950 via-emerald-950 to-[#120a06] border border-emerald-500/25 shadow-2xl ${
        compact ? 'p-4 h-64' : 'p-6 sm:p-8 min-h-[380px]'
      } flex flex-col justify-between select-none`}
    >
      {/* ── Ambient Sky & Sun Glow ────────────────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-500/15 via-emerald-500/10 to-transparent pointer-events-none" />
      
      {/* Sun Ray Beams */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,_rgba(245,158,11,0.25)_0%,_transparent_70%)] pointer-events-none blur-2xl"
      />

      {/* Floating Nutrient / Spore Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-10, -80, -10],
              x: [Math.sin(i) * 15, Math.cos(i) * 20, Math.sin(i) * 15],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + (i % 3) * 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full"
            style={{
              left: `${15 + ((i * 12) % 75)}%`,
              bottom: `${25 + (i * 7)}%`,
              width: `${4 + (i % 3) * 2}px`,
              height: `${4 + (i % 3) * 2}px`,
              backgroundColor: i % 2 === 0 ? '#34d399' : '#fbbf24',
              boxShadow: '0 0 10px rgba(52, 211, 153, 0.8)',
            }}
          />
        ))}
      </div>

      {/* ── Top Header / Status ───────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-sm backdrop-blur-md">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
              3D Bio-Growth Engine
            </span>
            <span className="text-xs font-bold text-slate-200">
              {statusText || stageName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-black">
            {Math.round(p)}%
          </span>
        </div>
      </div>

      {/* ── Main 3D Soil Cross-Section & Growing Onion ────────────────────── */}
      <div className="relative flex-1 flex items-center justify-center my-2">
        <div className="relative w-full max-w-[340px] h-[190px] flex items-center justify-center">

          {/* Ground / Surface Line - Soft Organic Horizon */}
          <div className="absolute top-[85px] inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />
          
          {/* Soil Layer (Bottom Half) */}
          <div className="absolute top-[86px] inset-x-4 bottom-0 rounded-b-3xl bg-gradient-to-b from-[#24120b] via-[#170a05] to-[#0a0402] border-t border-amber-900/30 overflow-hidden shadow-inner">
            {/* Soil Texture Specks */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-black/50 to-transparent" />
          </div>

          {/* Clean Contained AI Laser Scan Beam */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-center items-center z-40">
            <motion.div
              animate={{ y: [-50, 60, -50] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-44 h-[2px] rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_rgba(52,211,153,0.9)]"
            />
          </div>

          {/* ── ROOT SYSTEM (Spreading into Soil) ─────────────────────────── */}
          <div className="absolute top-[88px] left-1/2 -translate-x-1/2 pointer-events-none z-10">
            {/* Main Central Tap Root */}
            <motion.div
              style={{ height: `${rootDepth}px` }}
              className="w-[2.5px] bg-gradient-to-b from-amber-100 via-amber-200/90 to-transparent mx-auto rounded-full shadow-[0_0_8px_rgba(254,243,199,0.5)]"
            />

            {/* Branching Lateral Roots */}
            {progressRatio > 0.2 && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ width: `${rootDepth * 0.75}px` }}
                  className="absolute top-3 left-1/2 h-[2px] bg-gradient-to-r from-amber-200/80 to-transparent origin-left rotate-25 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ width: `${rootDepth * 0.75}px` }}
                  className="absolute top-3 right-1/2 h-[2px] bg-gradient-to-l from-amber-200/80 to-transparent origin-right -rotate-25 rounded-full"
                />
              </>
            )}

            {progressRatio > 0.5 && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ width: `${rootDepth * 0.6}px` }}
                  className="absolute top-8 left-1/2 h-[1.5px] bg-gradient-to-r from-amber-100/70 to-transparent origin-left rotate-40 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ width: `${rootDepth * 0.6}px` }}
                  className="absolute top-8 right-1/2 h-[1.5px] bg-gradient-to-l from-amber-100/70 to-transparent origin-right -rotate-40 rounded-full"
                />
              </>
            )}
          </div>

          {/* ── ONION BULB (3D Layered Sphere) ────────────────────────────── */}
          <motion.div
            style={{
              transform: `translate(-50%, ${bulbY}px) scale(${bulbScale})`,
            }}
            animate={{
              y: [bulbY, bulbY - 2, bulbY],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[80px] left-1/2 z-20"
          >
            {/* 3D Outer Bulb Layer with Realistic Specular Sheen */}
            <div className="relative w-16 h-18 rounded-[50%_50%_45%_45%] bg-gradient-to-tr from-[#781d0f] via-[#c2410c] to-[#f97316] shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.6),inset_4px_4px_8px_rgba(254,215,170,0.6),0_10px_25px_rgba(0,0,0,0.5)] border border-amber-500/30 overflow-hidden flex items-center justify-center">
              
              {/* Onion Skin Striations / Veins */}
              <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(255,237,213,0.3)_4px,rgba(255,237,213,0.3)_6px)]" />
              
              {/* Concentric Golden Scales */}
              <div className="w-10 h-12 rounded-[50%_50%_40%_40%] bg-gradient-to-b from-[#ea580c] to-[#9a3412] shadow-inner opacity-90 border-t border-amber-200/40" />
              
              {/* Specular Light Highlight */}
              <div className="absolute top-2 left-3 w-4 h-6 rounded-full bg-white/40 blur-[2px] rotate-[-25deg]" />

              {/* Basal Plate Tuft */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-amber-900 rounded-b-md" />
            </div>

            {/* Bulb Neck / Collar */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-t from-[#ea580c] to-emerald-600 rounded-t-sm" />
          </motion.div>

          {/* ── GREEN SPROUTS & SHOOTS (Rising out of soil) ────────────────── */}
          <div className="absolute top-[85px] left-1/2 -translate-x-1/2 pointer-events-none z-30">
            {progressRatio > 0.15 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: sproutHeight,
                  opacity: 1,
                  rotate: [-1, 2, -1],
                }}
                transition={{
                  height: { duration: 0.5 },
                  rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute bottom-0 left-[-6px] w-[5px] origin-bottom rounded-t-full bg-gradient-to-t from-emerald-600 via-emerald-400 to-lime-300 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
              >
                {/* Dew droplet */}
                <div className="absolute top-1 right-0 w-1.5 h-1.5 rounded-full bg-white/90 shadow-sm" />
              </motion.div>
            )}

            {progressRatio > 0.35 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: sproutHeight * 0.85,
                  opacity: 1,
                  rotate: [3, -2, 3],
                }}
                transition={{
                  height: { duration: 0.5 },
                  rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute bottom-0 right-[-8px] w-[4px] origin-bottom rounded-t-full bg-gradient-to-t from-emerald-700 via-emerald-500 to-lime-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              />
            )}

            {progressRatio > 0.65 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: sproutHeight * 1.1,
                  opacity: 1,
                  rotate: [0, 1.5, 0],
                }}
                transition={{
                  height: { duration: 0.5 },
                  rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute bottom-0 left-[-1px] w-[6px] origin-bottom rounded-t-full bg-gradient-to-t from-teal-700 via-emerald-400 to-lime-200 shadow-[0_0_12px_rgba(110,231,183,0.7)]"
              />
            )}
          </div>

        </div>
      </div>

      {/* ── Bottom Controls / Micro Metrics ──────────────────────────────── */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between gap-4">
        {interactive ? (
          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Growth Drag</span>
            <input
              type="range"
              min="0"
              max="100"
              value={p}
              onChange={(e) => {
                setAutoPlay(false);
                setInternalProgress(Number(e.target.value));
              }}
              className="w-full accent-emerald-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-400/30 transition-colors whitespace-nowrap"
            >
              {autoPlay ? 'Pause' : 'Auto'}
            </button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-300">
            <div className="bg-white/5 py-1.5 rounded-xl border border-white/5">
              <span className="text-emerald-400 block">🌱 Soil Nutrients</span>
              <span>Rich Organic</span>
            </div>
            <div className="bg-white/5 py-1.5 rounded-xl border border-white/5">
              <span className="text-amber-400 block">⚖️ Quality Tier</span>
              <span>{p > 75 ? 'APMC Grade A' : 'Developing'}</span>
            </div>
            <div className="bg-white/5 py-1.5 rounded-xl border border-white/5">
              <span className="text-sky-400 block">💧 Moisture</span>
              <span>65% Optimal</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
