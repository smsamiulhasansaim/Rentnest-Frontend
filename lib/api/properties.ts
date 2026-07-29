import apiClient from './client';
import { Property, Category, PropertyFilters } from '@/types/property';

export const propertyApi = {
  getAll: async (filters?: PropertyFilters) => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.bedrooms) params.append('bedrooms', String(filters.bedrooms));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await apiClient.get(`/api/properties?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Property }> => {
    const response = await apiClient.get(`/api/properties/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<{ data: Category[] }> => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },
};

export default propertyApi;