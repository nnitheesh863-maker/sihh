import React, { useState, useEffect } from 'react';
import { procurementApi } from '../api/procurement.api';
import { ProcurementCenter } from '../types';
import { MapPin, Navigation, PhoneCall, CheckCircle2, Search, Building2 } from 'lucide-react';

export const APMCCentersPage: React.FC = () => {
  const [centers, setCenters] = useState<ProcurementCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const data = await procurementApi.getCenters();
      setCenters(data || []);
    } catch (err) {
      console.error('Failed to fetch centers', err);
    } finally {
      setLoading(false);
    }
  };

  const districts = ['ALL', ...Array.from(new Set(centers.map((c) => c.district)))];

  const filteredCenters = centers.filter(
    (c) => selectedDistrict === 'ALL' || c.district === selectedDistrict
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-emerald-400" />
            APMC Procurement Centers
          </h1>
          <p className="text-xs text-slate-400 mt-1">Locate government verified APMC market yards for direct onion procurement & trading.</p>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedDistrict === d
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Center Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading APMC market yards...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="p-6 rounded-3xl glass-card glass-card-hover border border-slate-800 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {center.district} District
                  </span>
                  <h3 className="text-lg font-extrabold text-white">{center.name}</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>GPS Coordinates:</span>
                  <span className="font-mono text-slate-200">{center.latitude.toFixed(4)}° N, {center.longitude.toFixed(4)}° E</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Procurement Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active Procurement
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`https://maps.google.com/?q=${center.latitude},${center.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Navigate (Maps)
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
