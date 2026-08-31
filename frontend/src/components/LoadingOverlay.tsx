import React from 'react';
import { Sparkles, Scan, Activity, Cpu } from 'lucide-react';

interface LoadingOverlayProps {
  stage: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ stage }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
      <div className="w-full max-w-md p-8 rounded-3xl glass-card border border-emerald-500/30 text-center space-y-6 shadow-2xl shadow-emerald-500/10">
        
        {/* Animated Radar Pulse */}
        <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-emerald-500/40 animate-pulse" />
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-8 w-8 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-white tracking-tight">YOLO11n AI Processing</h3>
          <p className="text-sm font-semibold text-emerald-400 animate-pulse">{stage}</p>
        </div>

        {/* Progress Timeline Pills */}
        <div className="space-y-2 text-left text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Scan className="h-4 w-4 text-emerald-400" />
            <span>OpenCV Image Validation & Normalization</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span>YOLO11n Pathogen Bounding Box Detection</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Freshness Index & Agronomic Recommendation</span>
          </div>
        </div>

      </div>
    </div>
  );
};
