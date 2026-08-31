import React, { useState } from 'react';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HistoryItem {
  id: string;
  date: string;
  disease: string;
  confidence: number;
  status: 'High' | 'Good' | 'Medium' | 'Critical';
}

// Dummy data for initial UI
const MOCK_HISTORY: HistoryItem[] = [
  { id: '1', date: 'Aug 31, 2026', disease: 'Black Fungus', confidence: 0.94, status: 'High' },
  { id: '2', date: 'Aug 30, 2026', disease: 'Healthy', confidence: 0.97, status: 'Good' },
  { id: '3', date: 'Aug 29, 2026', disease: 'Purple Blotch', confidence: 0.91, status: 'Medium' },
  { id: '4', date: 'Aug 28, 2026', disease: 'Onion Smut', confidence: 0.88, status: 'Critical' },
  { id: '5', date: 'Aug 25, 2026', disease: 'Healthy', confidence: 0.99, status: 'Good' },
];

export const DetectionHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200';
      case 'GOOD': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Good') return <CheckCircle2 className="w-4 h-4 mr-1" />;
    if (status === 'Critical') return <ShieldAlert className="w-4 h-4 mr-1" />;
    return <Activity className="w-4 h-4 mr-1" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      
      {/* Header & Filters */}
      <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Detection History</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and filter your previous onion crop analyses.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-shadow"
            placeholder="Search by disease name, date, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold rounded-tl-lg">Date</th>
              <th className="px-6 py-4 font-semibold">Disease</th>
              <th className="px-6 py-4 font-semibold">Confidence</th>
              <th className="px-6 py-4 font-semibold rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_HISTORY.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    {item.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.disease}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{Math.round(item.confidence * 100)}%</span>
                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${Math.round(item.confidence * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Static for now) */}
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">Showing 1 to 5 of 24 results</span>
        <div className="flex gap-2">
          <button className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
