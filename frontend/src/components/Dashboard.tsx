import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, DonutChart, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Activity, ShieldCheck, Bug, AlertOctagon } from 'lucide-react';

const DISEASE_DIST_DATA = [
  { name: 'Purple Blotch', value: 25 },
  { name: 'Black Fungus', value: 15 },
  { name: 'Soft Rot', value: 8 },
  { name: 'Onion Smut', value: 6 },
];
const COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#ef4444'];

const TREND_DATA = [
  { date: 'Aug 25', scans: 12, diseases: 3 },
  { date: 'Aug 26', scans: 15, diseases: 4 },
  { date: 'Aug 27', scans: 20, diseases: 8 },
  { date: 'Aug 28', scans: 18, diseases: 6 },
  { date: 'Aug 29', scans: 25, diseases: 12 },
  { date: 'Aug 30', scans: 22, diseases: 9 },
  { date: 'Aug 31', scans: 16, diseases: 12 },
];

const SEVERITY_DATA = [
  { name: 'LOW', count: 35, fill: '#10b981' },
  { name: 'MODERATE', count: 28, fill: '#f59e0b' },
  { name: 'HIGH', count: 18, fill: '#f97316' },
  { name: 'CRITICAL', count: 9, fill: '#ef4444' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Crop Intelligence Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">What is happening with my onion crops?</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Scans */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Scans</p>
              <h3 className="text-4xl font-black text-slate-800 dark:text-white">128</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">+12% from last week</p>
        </div>

        {/* Healthy */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Healthy</p>
              <h3 className="text-4xl font-black text-slate-800 dark:text-white">74</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">57.8% of total scans</p>
        </div>

        {/* Diseased */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Diseased</p>
              <h3 className="text-4xl font-black text-slate-800 dark:text-white">54</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center">
              <Bug className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">42.2% of total scans</p>
        </div>

        {/* High Risk */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-red-200 dark:border-red-900/30 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -z-10"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-1">High Risk</p>
              <h3 className="text-4xl font-black text-red-600 dark:text-red-400">18</h3>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">Requires immediate action</p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Disease Trend (Line) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Disease Trend (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDisease" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" name="Healthy Scans" />
                <Area type="monotone" dataKey="diseases" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDisease)" name="Diseased Scans" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Distribution (Donut) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Disease Distribution</h3>
          <div className="h-[250px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DISEASE_DIST_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {DISEASE_DIST_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 mt-4">
             {DISEASE_DIST_DATA.map((item, idx) => (
               <div key={idx} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                 <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Severity Distribution (Bar) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Severity Distribution</h3>
           <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEVERITY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 600}} tickLine={false} axisLine={false} dy={10} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {SEVERITY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
