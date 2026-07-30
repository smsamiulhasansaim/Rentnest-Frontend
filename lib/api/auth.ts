// lib/api/auth.ts
import apiClient from './client';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/user';

export const authApi = {
  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/register', data);
    // Backend returns: { success, message, errorDetails, data: { token, user } }
    // We need to return response.data.data
    return response.data.data;
  },

  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', data);
    // Backend returns: { success, message, errorDetails, data: { token, user } }
    // We need to return response.data.data
    console.log('Login raw response:', response.data); // Debug
    return response.data.data;
  },

  getMe: async (): Promise<{ data: User }> => {
    const response = await apiClient.get('/api/auth/me');
    // Backend returns: { success, message, errorDetails, data: User }
    return response.data;
  },
};

export default authApi;