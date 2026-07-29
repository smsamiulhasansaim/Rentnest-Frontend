import apiClient from './client';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/user';

export const authApi = {
  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<{ data: User }> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};

export default authApi;