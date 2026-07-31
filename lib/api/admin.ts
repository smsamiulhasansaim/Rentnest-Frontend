
import apiClient from './client';
import {
  AdminStats,
  AdminUser,
  AdminProperty,
  AdminPropertyDetail,
  AdminRental,
  AdminRentalDetail,
  CategoryWithCount,
} from '@/types/admin';

export const adminApi = {
  // Dashboard
  getStats: async (): Promise<{ data: AdminStats }> => {
    const response = await apiClient.get('/api/admin/dashboard/stats');
    return response.data;
  },

  // Users
  getUsers: async (): Promise<{ data: AdminUser[] }> => {
    const response = await apiClient.get('/api/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId: string, status: 'ACTIVE' | 'BANNED'): Promise<{ data: { id: string; status: string } }> => {
    const response = await apiClient.patch(`/api/admin/users/${userId}`, { status });
    return response.data;
  },

  // Properties
  getProperties: async (): Promise<{ data: AdminProperty[] }> => {
    const response = await apiClient.get('/api/admin/properties');
    return response.data;
  },

  getPropertyById: async (id: string): Promise<{ data: AdminPropertyDetail }> => {
    const response = await apiClient.get(`/api/admin/properties/${id}`);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/api/admin/properties/${id}`);
    return response.data;
  },

  // Rentals
  getRentals: async (): Promise<{ data: AdminRental[] }> => {
    const response = await apiClient.get('/api/admin/rentals');
    return response.data;
  },

  getRentalById: async (id: string): Promise<{ data: AdminRentalDetail }> => {
    const response = await apiClient.get(`/api/admin/rentals/${id}`);
    return response.data;
  },

  // Categories
  getCategories: async (): Promise<{ data: CategoryWithCount[] }> => {
    const response = await apiClient.get('/api/admin/categories');
    return response.data;
  },

  createCategory: async (name: string): Promise<{ data: { id: string; name: string } }> => {
    const response = await apiClient.post('/api/admin/categories', { name });
    return response.data;
  },

  updateCategory: async (id: string, name: string): Promise<{ data: { id: string; name: string } }> => {
    const response = await apiClient.put(`/api/admin/categories/${id}`, { name });
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ data: null }> => {
    const response = await apiClient.delete(`/api/admin/categories/${id}`);
    return response.data;
  },
};

export default adminApi;