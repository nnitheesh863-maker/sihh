import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Scan, History, MapPin, Search, Bell, Settings, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-transparent pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto bg-white rounded-full shadow-sm border border-slate-100 px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scanner')}>
          <div className="h-12 w-auto flex items-center justify-center">
            <img src="/logo.png" alt="OnionAI Logo" className="h-full w-auto object-contain scale-110" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">OnionAI</span>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-50 border border-slate-100 rounded-full py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all"
          />
        </div>

        {/* Navigation & User Profile */}
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-2 mr-4">
            <button onClick={() => setActiveTab('scanner')} className={`text-sm font-medium transition-colors ${activeTab === 'scanner' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>Scanner</button>
            <button onClick={() => setActiveTab('history')} className={`text-sm font-medium transition-colors ${activeTab === 'history' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>History</button>
            <button onClick={() => setActiveTab('centers')} className={`text-sm font-medium transition-colors ${activeTab === 'centers' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>APMC</button>
          </nav>

          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
              <div className="flex items-center gap-2 text-right">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                  <UserIcon className="h-4 w-4 text-slate-500" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{user.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 ml-2">
                <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button onClick={logout} title="Logout" className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setActiveTab('login')} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all">
              <UserIcon className="h-3.5 w-3.5" />
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
