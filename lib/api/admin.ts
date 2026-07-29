import apiClient from './client';
import { User, UserStatus } from '@/types/user';
import { Property } from '@/types/property';
import { RentalRequest } from '@/types/request';
import { Category } from '@/types/property';

export const adminApi = {
  getUsers: async (): Promise<{ data: User[] }> => {
    const response = await apiClient.get('/api/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId: string, status: UserStatus): Promise<{ data: { id: string; status: UserStatus } }> => {
    const response = await apiClient.patch(`/api/admin/users/${userId}`, { status });
    return response.data;
  },

  getProperties: async (): Promise<{ data: Property[] }> => {
    const response = await apiClient.get('/api/admin/properties');
    return response.data;
  },

  getRentals: async (): Promise<{ data: RentalRequest[] }> => {
    const response = await apiClient.get('/api/admin/rentals');
    return response.data;
  },

  createCategory: async (name: string): Promise<{ data: Category }> => {
    const response = await apiClient.post('/api/admin/categories', { name });
    return response.data;
  },
};

export default adminApi;