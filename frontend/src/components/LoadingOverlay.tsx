import React, { useState, useEffect } from 'react';
import { Scan, Activity, Cpu, CheckCircle2 } from 'lucide-react';
import { OnionGrowthAnimation } from './OnionGrowthAnimation';
import { motion } from 'framer-motion';

interface LoadingOverlayProps {
  stage: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ stage }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 12));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg p-6 rounded-[2.5rem] bg-slate-900/90 border border-emerald-500/30 text-center space-y-5 shadow-2xl shadow-emerald-500/15 overflow-hidden"
      >
        {/* 3D Onion Growing in Soil Animation */}
        <OnionGrowthAnimation progress={progress} compact statusText={stage} />

        {/* Status Messages */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            AI Onion Vision & Pathogen Scan
          </h3>
          <p className="text-xs font-bold text-emerald-400 animate-pulse">{stage}</p>
        </div>

        {/* Progress Timeline Pills */}
        <div className="space-y-2 text-left text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2.5">
              <Scan className="h-4 w-4 text-emerald-400" />
              <span>Image Quality Gate & Scale Preprocessing</span>
            </div>
            {progress > 30 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <div className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            )}
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2.5">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>YOLO11n Pathogen & Disease Classification</span>
            </div>
            {progress > 65 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <div className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            )}
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>APMC Grading, Certificate & Advisory Synthesis</span>
            </div>
            {progress >= 90 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <div className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
