import { apiClient } from './client';
import { ProcurementCenter, OnionAnalysis, ApiResponse } from '../types';

export interface ProcurementDashboardStats {
  totalSamples: number;
  recentWeek: number;
  averageScore: number;
  gradeBreakdown: { grade: string; count: number }[];
}

export const procurementApi = {
  getCenters: async (): Promise<ProcurementCenter[]> => {
    const res = await apiClient.get<ApiResponse<{ items: ProcurementCenter[] }>>('/procurement/centers');
    return res.data.data.items || [];
  },

  getDashboardStats: async (): Promise<ProcurementDashboardStats> => {
    const res = await apiClient.get<ApiResponse<ProcurementDashboardStats>>('/procurement/dashboard');
    return res.data.data;
  },

  getAllAnalyses: async (page = 1, limit = 20): Promise<{ items: OnionAnalysis[]; total: number }> => {
    const res = await apiClient.get<ApiResponse<{ items: OnionAnalysis[]; total: number }>>('/procurement/analyses', {
      params: { page, limit },
    });
    return res.data.data;
  },
};
