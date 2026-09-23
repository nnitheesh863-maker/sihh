import React from 'react';
import { Award, ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

interface GradeDistributionProps {
  gradeA: number;
  gradeB: number;
  gradeC: number;
  rejects: number;
}

export const GradeDistributionChart: React.FC<GradeDistributionProps> = ({
  gradeA = 55,
  gradeB = 30,
  gradeC = 10,
  rejects = 5
}) => {
  const total = (gradeA + gradeB + gradeC + rejects) || 100;
  const pctA = Math.round((gradeA / total) * 100);
  const pctB = Math.round((gradeB / total) * 100);
  const pctC = Math.round((gradeC / total) * 100);
  const pctR = Math.round((rejects / total) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
      <h3 className="text-lg font-semibold mb-4 text-slate-100 flex items-center gap-2">
        <Award className="w-5 h-5 text-amber-400" />
        Quality Grade Distribution
      </h3>

      {/* Stacked Progress Bar */}
      <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex mb-6">
        <div style={{ width: `${pctA}%` }} className="bg-emerald-500 transition-all duration-500" title={`Grade A: ${pctA}%`} />
        <div style={{ width: `${pctB}%` }} className="bg-blue-500 transition-all duration-500" title={`Grade B: ${pctB}%`} />
        <div style={{ width: `${pctC}%` }} className="bg-amber-500 transition-all duration-500" title={`Grade C: ${pctC}%`} />
        <div style={{ width: `${pctR}%` }} className="bg-rose-500 transition-all duration-500" title={`Rejects: ${pctR}%`} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" /> Grade A (Export)
          </div>
          <p className="text-2xl font-bold text-white">{pctA}%</p>
          <span className="text-xs text-slate-400">{gradeA} units</span>
        </div>

        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" /> Grade B (Domestic)
          </div>
          <p className="text-2xl font-bold text-white">{pctB}%</p>
          <span className="text-xs text-slate-400">{gradeB} units</span>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" /> Grade C (Process)
          </div>
          <p className="text-2xl font-bold text-white">{pctC}%</p>
          <span className="text-xs text-slate-400">{gradeC} units</span>
        </div>

        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold mb-1">
            <XCircle className="w-4 h-4" /> Reject (Culled)
          </div>
          <p className="text-2xl font-bold text-white">{pctR}%</p>
          <span className="text-xs text-slate-400">{rejects} units</span>
        </div>
      </div>
    </div>
  );
};
