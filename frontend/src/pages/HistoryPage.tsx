import React, { useState, useEffect } from 'react';
import { onionApi } from '../api/onion.api';
import { OnionAnalysis } from '../types';
import { QualityCertificate } from '../components/QualityCertificate';
import { History, Filter, Search, Award, Calendar, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<OnionAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<OnionAnalysis | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await onionApi.getHistory(1, 50);
      setHistory(data.items || []);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesGrade = gradeFilter === 'ALL' || item.grade === gradeFilter;
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.defects && item.defects.some((d) => (d.defectType || d.diseaseName || '').toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesGrade && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {selectedAnalysis && (
        <QualityCertificate analysis={selectedAnalysis} onClose={() => setSelectedAnalysis(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-emerald-400" />
            Inspection Scan History
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review past onion scans, pathology detections, and downloadable APMC quality certificates.</p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID or disease..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-500 ml-2" />
            {['ALL', 'A', 'B', 'C', 'REJECTED'].map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  gradeFilter === g
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading inspection log...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 rounded-3xl glass-card border border-slate-800 text-center space-y-2">
          <p className="text-sm font-bold text-slate-300">No inspection records found</p>
          <p className="text-xs text-slate-500">Run a new scan on the Scanner page to generate historical reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl glass-card glass-card-hover border border-slate-800 space-y-4 relative group"
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl font-black ${
                      item.grade === 'A'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.grade === 'B'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.grade}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Grade {item.grade} Quality</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <span className="text-lg font-black text-emerald-400">{item.score}<span className="text-xs text-slate-500">/100</span></span>
              </div>

              {/* Disease tags */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Pathology Findings:</span>
                {item.defects && item.defects.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {item.defects.map((d, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-rose-300 border border-rose-500/20 text-[11px]">
                        {d.diseaseName || d.defectType} ({Math.round(d.confidence * 100)}%)
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-emerald-400 font-semibold text-[11px]">Healthy Bulb (No Pathogens)</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400">APMC: <strong className="text-white">{item.recommendation}</strong></span>
                <button
                  onClick={() => setSelectedAnalysis(item)}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Award className="h-3.5 w-3.5" />
                  Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
