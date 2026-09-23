import React from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';

interface DefectItem {
  id: string;
  name: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height] in %
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface DefectVisualizerProps {
  imageUrl?: string;
  defects?: DefectItem[];
  onionGrade?: string;
}

export const DefectVisualizer: React.FC<DefectVisualizerProps> = ({
  imageUrl,
  defects = [
    { id: '1', name: 'Skin Crack', confidence: 0.94, bbox: [25, 30, 20, 35], severity: 'medium' },
    { id: '2', name: 'Sun Scald', confidence: 0.88, bbox: [60, 45, 15, 20], severity: 'low' }
  ],
  onionGrade = 'GRADE_B'
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100 flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-400" />
          AI Computer Vision Inspection
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Status: {onionGrade}
        </span>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt="Onion Inspection" className="w-full h-full object-cover" />
        ) : (
          <div className="w-36 h-36 rounded-full bg-amber-700/40 border-4 border-amber-600/60 relative flex items-center justify-center shadow-inner">
            <span className="text-xs font-semibold text-amber-200">Onion Bulb ROI</span>
            {/* Simulated bounding boxes */}
            <div className="absolute top-4 left-6 w-10 h-14 border-2 border-amber-400 bg-amber-400/20 rounded text-[9px] text-amber-300 p-0.5">
              Crack 94%
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detected Features</p>
        {defects.length === 0 ? (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4" /> Zero defects detected. Perfect bulb exterior.
          </div>
        ) : (
          defects.map(d => (
            <div key={d.id} className="flex items-center justify-between text-xs bg-slate-800/60 p-2 rounded-lg">
              <span className="font-medium text-slate-200">{d.name}</span>
              <span className="font-mono text-emerald-400">{(d.confidence * 100).toFixed(0)}% conf</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
