import React from 'react';
import { User, MapPin, Phone, Edit2, ShieldCheck, Leaf } from 'lucide-react';

export const FarmerProfile: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Farmer Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account details and farm information.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 rounded-lg text-sm font-medium transition-colors">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 relative">
              <User className="w-16 h-16 text-slate-400" />
              <div className="absolute bottom-0 right-2 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Ramesh Kumar</h3>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-6">Verified Farmer</p>
            
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-xs text-slate-500 uppercase font-semibold">Total Scans</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">128</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-xs text-slate-500 uppercase font-semibold">Member Since</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">Aug 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">Ramesh Kumar</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contact Number</label>
                <p className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  +91 98765 43210
                </p>
              </div>
            </div>
          </div>

          {/* Farm Information */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
             <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              Farm Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Primary Crop</label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">Red Onion (Nashik Variety)</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Farm Size</label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">4.5 Acres</p>
              </div>
            </div>
          </div>

          {/* Location Information (Optional Fields) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
             <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              Location
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Village</label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">Pimpalgaon</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">District</label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">Nashik</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">State</label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">Maharashtra</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
