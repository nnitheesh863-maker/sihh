import { apiClient } from './client';
import { OnionAnalysis, ApiResponse, Certificate } from '../types';

export const onionApi = {
  analyzeImage: async (file: File): Promise<OnionAnalysis> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await apiClient.post<ApiResponse<OnionAnalysis>>('/onions/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Support both direct return or nested analysis object
    const result = res.data.data;
    if ((result as any).analysis) {
      return {
        ...(result as any).analysis,
        defects: (result as any).defects || (result as any).analysis.defects || [],
        processedImageUrl: (result as any).processedImage || (result as any).analysis.processedImageUrl,
      };
    }
    return result;
  },

  getHistory: async (page = 1, limit = 10): Promise<{ items: OnionAnalysis[]; total: number }> => {
    const res = await apiClient.get<ApiResponse<{ items: OnionAnalysis[]; total: number }>>('/onions/history', {
      params: { page, limit },
    });
    return res.data.data;
  },

  getAnalysisById: async (id: string): Promise<OnionAnalysis> => {
    const res = await apiClient.get<ApiResponse<OnionAnalysis>>(`/onions/${id}`);
    return res.data.data;
  },

  getCertificate: async (analysisId: string): Promise<Certificate> => {
    const res = await apiClient.get<ApiResponse<Certificate>>(`/certificate/${analysisId}`);
    return res.data.data;
  },
};
