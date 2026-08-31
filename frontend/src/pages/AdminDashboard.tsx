import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { User, ApiResponse } from '../types';
import { ShieldCheck, Users, Cpu, Activity, CheckCircle2, XCircle, Search } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<ApiResponse<{ items: User[] }>>('/admin/users');
      setUsers(res.data.data.items || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const action = (user as any).isActive !== false ? 'deactivate' : 'activate';
      await apiClient.patch(`/admin/users/${user.id}/${action}`);
      fetchUsers();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          System Administration
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Governance & Model Config</h1>
        <p className="text-xs text-slate-400 mt-1">Manage user access rights, review platform active sessions, and monitor neural net weights.</p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">YOLO11n-onion</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300">Active</span>
          </div>
          <h3 className="text-lg font-black text-white">Disease & Lesion Detector</h3>
          <p className="text-xs text-slate-400">Accuracy Benchmark: <strong className="text-emerald-400">96.4% mAP50</strong></p>
          <p className="text-[11px] text-slate-500">Framework: Ultralytics YOLO11 PyTorch</p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">EfficientNet-B3</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300">Active</span>
          </div>
          <h3 className="text-lg font-black text-white">Quality Classifier</h3>
          <p className="text-xs text-slate-400">Accuracy Benchmark: <strong className="text-emerald-400">97.2% Top-1</strong></p>
          <p className="text-[11px] text-slate-500">Framework: PyTorch Vision</p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">OpenCV-4.9.0</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300">Active</span>
          </div>
          <h3 className="text-lg font-black text-white">Pre-processing Engine</h3>
          <p className="text-xs text-slate-400">Normalizer: <strong className="text-emerald-400">YUV Equalization</strong></p>
          <p className="text-[11px] text-slate-500">Framework: OpenCV Headless</p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              Registered Platform Users ({users.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Control farmer, officer and administrator access status.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Contact</th>
                <th className="p-3">District</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-semibold text-white">
                    {u.name}
                    <span className="block text-[10px] text-slate-500 font-normal">{u.email}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-emerald-500/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{u.phone}</td>
                  <td className="p-3">{u.district || 'Nashik'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(u)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        (u as any).isActive !== false
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                      }`}
                    >
                      {(u as any).isActive !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
