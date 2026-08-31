import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { ScannerPage } from './pages/ScannerPage';
import { HistoryPage } from './pages/HistoryPage';
import { APMCCentersPage } from './pages/APMCCentersPage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const MainContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('scanner');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm font-semibold">
        Loading SIH26031 Platform...
      </div>
    );
  }

  if (!isAuthenticated || activeTab === 'login') {
    return <LoginPage onSuccess={() => setActiveTab('scanner')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 pb-12">
        {activeTab === 'scanner' && <ScannerPage />}
        {activeTab === 'history' && <HistoryPage />}
        {activeTab === 'centers' && <APMCCentersPage />}
        {activeTab === 'officer' && <OfficerDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>SIH26031 – AI-Powered Onion Quality Assessment & Disease Grading Platform</p>
        <p className="mt-1 text-[11px] text-slate-600">Built with React, Vite, TailwindCSS, Express, Prisma, YOLO11n Computer Vision.</p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
