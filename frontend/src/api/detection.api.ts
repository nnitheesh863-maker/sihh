import { apiClient } from './client';
import { OnionAnalysis, ApiResponse, Certificate } from '../types';

export const detectionApi = {
  analyzeImage: async (file: File, context?: any): Promise<OnionAnalysis> => {
    const formData = new FormData();
    formData.append('image', file);
    if (context) formData.append('context', JSON.stringify(context));

    const res = await apiClient.post<ApiResponse<OnionAnalysis>>('/detection/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Support both direct return or nested analysis object
    const result = res.data.data;
    if ((result as any).analysis) {
      let imageUrl = (result as any).processedImage || (result as any).analysis.processedImageUrl || (result as any).processedImageUrl;
      if (imageUrl && imageUrl.startsWith('/uploads')) {
        imageUrl = `${apiClient.defaults.baseURL?.replace('/api', '')}${imageUrl}`;
      }
      return {
        ...(result as any).analysis,
        defects: (result as any).defects || (result as any).analysis.defects || [],
        processedImageUrl: imageUrl,
        batchReport: (result as any).batchReport || (result as any).analysis.batchReport,
      };
    }
    return result;
  },

  getHistory: async (page = 1, limit = 10): Promise<{ items: OnionAnalysis[]; total: number }> => {
    const res = await apiClient.get<ApiResponse<{ items: OnionAnalysis[]; total: number }>>('/history', {
      params: { page, limit },
    });
    return res.data.data;
  },

  getAnalysisById: async (id: string): Promise<OnionAnalysis> => {
    const res = await apiClient.get<ApiResponse<OnionAnalysis>>(`/history/${id}`);
    return res.data.data;
  },

  getCertificate: async (analysisId: string): Promise<Certificate> => {
    const res = await apiClient.get<ApiResponse<Certificate>>(`/detection/certificate/${analysisId}`);
    return res.data.data;
  },
};
