import { apiClient } from './client';
import { User, ApiResponse } from '../types';

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data.data;
  },

  register: async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    village?: string;
    district?: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};
