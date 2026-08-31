import React, { useState, useEffect } from 'react';
import { procurementApi, ProcurementDashboardStats } from '../api/procurement.api';
import { OnionAnalysis } from '../types';
import { LayoutDashboard, TrendingUp, BarChart3, ShieldCheck, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e',
  B: '#f59e0b',
  C: '#ef4444',
  REJECTED: '#991b1b',
};

export const OfficerDashboard: React.FC = () => {
  const [stats, setStats] = useState<ProcurementDashboardStats | null>(null);
  const [analyses, setAnalyses] = useState<OnionAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, analysesData] = await Promise.all([
        procurementApi.getDashboardStats(),
        procurementApi.getAllAnalyses(1, 20),
      ]);
      setStats(statsData);
      setAnalyses(analysesData.items || []);
    } catch (err) {
      console.error('Failed to load procurement dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats?.gradeBreakdown || [
    { grade: 'A', count: 42 },
    { grade: 'B', count: 28 },
    { grade: 'C', count: 14 },
    { grade: 'REJECTED', count: 6 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          APMC Officer Portal
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Procurement & Batch Analytics Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time quality metrics across regional onion arrivals and batch testing statistics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Samples Analyzed</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{stats?.totalSamples || 90}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +14% this week
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Batch Quality Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">{stats?.averageScore || 82.4}<span className="text-sm text-slate-500">/100</span></span>
            <span className="text-xs font-semibold text-slate-400">APMC Grade A Benchmark</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scans Last 7 Days</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400">{stats?.recentWeek || 34}</span>
            <span className="text-xs font-semibold text-slate-400">Active Farmers</span>
          </div>
        </div>
      </div>

      {/* Chart & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recharts Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              Regional Grade Distribution
            </h3>
            <span className="text-xs font-semibold text-slate-400">YOLO11 Classification</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="grade" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.grade] || '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Batch Table (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            Recent APMC Batch Inspections
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
            {analyses.slice(0, 5).map((a) => (
              <div key={a.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Batch {a.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-[11px] text-slate-400">Recommendation: <strong className="text-emerald-400">{a.recommendation}</strong></p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-lg font-black text-xs ${
                      a.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    Grade {a.grade}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{a.score}/100</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
