import React from 'react';
import { TrendingUp, MapPin, IndianRupee } from 'lucide-react';

export const MandiPriceTracker: React.FC = () => {
  const mandiList = [
    { market: 'Lasalgaon APMC', dist: 'Nashik, MH', modalPrice: 2550, change: '+₹120', trend: 'UP' },
    { market: 'Pimpalgaon Baswant', dist: 'Nashik, MH', modalPrice: 2500, change: '+₹80', trend: 'UP' },
    { market: 'Solapur APMC', dist: 'Solapur, MH', modalPrice: 2300, change: '0', trend: 'STABLE' },
    { market: 'Azadpur Mandi', dist: 'Delhi, DL', modalPrice: 3100, change: '+₹150', trend: 'UP' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100 flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-emerald-400" />
          Live APMC Mandi Price Benchmarks
        </h3>
        <span className="text-xs text-slate-400">Updated 10 mins ago</span>
      </div>

      <div className="space-y-3">
        {mandiList.map((m, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
            <div>
              <div className="flex items-center gap-1.5 font-medium text-sm text-slate-100">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {m.market}
              </div>
              <p className="text-xs text-slate-400">{m.dist}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-white">₹{m.modalPrice} <span className="text-[11px] font-normal text-slate-400">/ Qtl</span></p>
              <div className="flex items-center gap-1 text-xs text-emerald-400 justify-end">
                <TrendingUp className="w-3 h-3" /> {m.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
