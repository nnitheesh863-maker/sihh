import React from 'react';
import { Defect } from '../types';
import { AlertTriangle, ShieldCheck, Activity, Pill, Warehouse } from 'lucide-react';

interface TreatmentCardProps {
  defects: Defect[];
  selectedIndex: number | null;
  onSelectIndex: (index: number | null) => void;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
  defects,
  selectedIndex,
  onSelectIndex,
}) => {
  if (!defects || defects.length === 0) {
    return (
      <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-950/20 text-center">
        <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-emerald-300">No Pathogens or Diseases Detected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          The YOLO11n AI vision model verified this onion sample to be healthy with tight outer skin and zero rot lesions.
        </p>
      </div>
    );
  }

  const currentDefect = selectedIndex !== null ? defects[selectedIndex] : defects[0];

  return (
    <div className="space-y-4">
      {/* Disease Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {defects.map((d, idx) => {
          const isSelected = (selectedIndex === null && idx === 0) || selectedIndex === idx;
          const isHigh = d.severity === 'High' || d.severity === 'Severe';
          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? isHigh
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className={`h-3.5 w-3.5 ${isHigh ? 'text-rose-400' : 'text-amber-400'}`} />
              {d.defectType || d.diseaseName || 'Disease'} ({Math.round(d.confidence * 100)}%)
            </button>
          );
        })}
      </div>

      {/* Selected Disease Details Card */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {currentDefect.diseaseName || currentDefect.defectType}
              </h3>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  currentDefect.severity === 'High' || currentDefect.severity === 'Severe'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {currentDefect.severity || 'Medium'} Risk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              YOLO11n AI Confidence: <strong className="text-emerald-400">{Math.round(currentDefect.confidence * 100)}%</strong>
              {currentDefect.areaPercentage && (
                <span className="ml-2">
                  • Affected Area: <strong className="text-amber-400">{currentDefect.areaPercentage}%</strong>
                </span>
              )}
            </p>
          </div>

          <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* Treatment Recommendation */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Pill className="h-4 w-4" />
            Agronomic Field Spray / Fungicide Treatment
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentDefect.treatment ||
              'Apply Mancozeb 75 WP (2.5 g/L water) or Carbendazim (1 g/L) immediately upon symptom sighting. Maintain proper drainage and rotate crops with non-allium species.'}
          </p>
        </div>

        {/* Storage & Post-Harvest Advice */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Warehouse className="h-4 w-4" />
            Storage & Curing Recommendation
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentDefect.storageAdvice ||
              'Ensure onions are field-cured for 10-14 days to dry neck tissue completely. Store in ventilated crates at 0-2°C with 65-70% relative humidity.'}
          </p>
        </div>

      </div>
    </div>
  );
};
