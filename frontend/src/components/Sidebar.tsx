import React, { useState } from 'react';
import { Home, ScanLine, Clock, Bug, BarChart3, User, Settings, LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_ITEMS = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, active: false },
    { name: 'Analyze Onion', icon: <ScanLine className="w-5 h-5" />, active: true },
    { name: 'History', icon: <Clock className="w-5 h-5" />, active: false },
    { name: 'Diseases', icon: <Bug className="w-5 h-5" />, active: false },
    { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, active: false },
    { name: 'Profile', icon: <User className="w-5 h-5" />, active: false },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-emerald-600"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen bg-emerald-900 text-emerald-50 transition-all duration-300 z-50 flex flex-col border-r border-emerald-800 shadow-xl
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-emerald-800">
          <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center w-full px-0' : ''}`}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-bold text-lg">🌱</span>
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
                OnionAI
              </h1>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${collapsed ? 'justify-center' : 'justify-start'}
                ${item.active 
                  ? 'bg-emerald-800 text-white shadow-inner font-semibold' 
                  : 'text-emerald-100/70 hover:bg-emerald-800/50 hover:text-white'
                }
              `}
              title={collapsed ? item.name : undefined}
            >
              <div className={`${item.active ? 'text-emerald-400' : 'group-hover:text-emerald-400 transition-colors'}`}>
                {item.icon}
              </div>
              {!collapsed && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-emerald-800 space-y-1">
          <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-emerald-100/70 hover:bg-emerald-800/50 hover:text-white transition-all duration-200 ${collapsed ? 'justify-center' : 'justify-start'}`}>
            <Settings className="w-5 h-5 group-hover:text-emerald-400" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-emerald-100/70 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 ${collapsed ? 'justify-center' : 'justify-start'}`}>
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-800 rounded-full items-center justify-center text-emerald-100 border border-emerald-700 shadow-md hover:bg-emerald-700 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
};
