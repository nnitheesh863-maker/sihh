import React from 'react';
import { Users, Activity, Bug, ShieldCheck, AlertOctagon, Settings, Database, Server } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-600" />
            ADMIN
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">System overview and aggregated metrics.</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-200">
             System Online
           </span>
           <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-200">
             YOLO11n-v2.0
           </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
            </div>
          </div>
          <h3 className="text-4xl font-black text-slate-800 dark:text-white">1,240</h3>
        </div>

        {/* Total Analyses */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Analyses</p>
            </div>
          </div>
          <h3 className="text-4xl font-black text-slate-800 dark:text-white">8,430</h3>
        </div>

        {/* Healthy Scans */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Healthy Scans</p>
            </div>
          </div>
          <h3 className="text-4xl font-black text-slate-800 dark:text-white">5,212</h3>
        </div>

        {/* Diseased Scans */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center shrink-0">
              <Bug className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Diseased Scans</p>
            </div>
          </div>
          <h3 className="text-4xl font-black text-slate-800 dark:text-white">3,218</h3>
        </div>

      </div>

      {/* Analytics Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Disease */}
        <div className="lg:col-span-1 bg-slate-800 dark:bg-slate-950 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-center">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
           
           <div className="flex items-center gap-3 mb-6 relative z-10">
             <AlertOctagon className="w-6 h-6 text-red-400" />
             <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Top Disease Detected</h3>
           </div>
           
           <h4 className="text-4xl font-black text-white relative z-10 leading-tight">
             Black Fungus
           </h4>
           <p className="text-slate-400 mt-4 relative z-10 text-sm">
             Responsible for 34% of all rejected onion crops this month across all procurement centers.
           </p>
        </div>

        {/* System Health (Extra Admin Context) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">System Health</h3>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
               <div className="flex items-center gap-3 mb-2">
                 <Database className="w-5 h-5 text-slate-500" />
                 <h4 className="font-semibold text-slate-700 dark:text-slate-300">Supabase DB</h4>
               </div>
               <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                 <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
               </div>
               <p className="text-xs text-slate-500">12% Storage Used</p>
             </div>

             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
               <div className="flex items-center gap-3 mb-2">
                 <Server className="w-5 h-5 text-slate-500" />
                 <h4 className="font-semibold text-slate-700 dark:text-slate-300">FastAPI Model Inference</h4>
               </div>
               <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                 <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
               </div>
               <p className="text-xs text-slate-500">Avg Latency: 240ms</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
