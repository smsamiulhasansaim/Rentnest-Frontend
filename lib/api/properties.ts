import apiClient from './client';
import { Property, Category, PropertyFilters, ApiResponse, PaginatedResponse } from '@/types/property';

export const propertyApi = {
  // PUBLIC APIs 
  
  // Get all properties with filters
  getAll: async (filters?: PropertyFilters): Promise<PaginatedResponse<Property>> => {
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

  // Get single property by ID
  getById: async (id: string): Promise<ApiResponse<Property>> => {
    const response = await apiClient.get(`/api/properties/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  // LANDLORD APIs 
  
  // Get all properties owned by the logged-in landlord
  getMyProperties: async (): Promise<ApiResponse<Property[]>> => {
    const response = await apiClient.get('/api/landlord/properties');
    return response.data;
  },

  // Create a new property
  create: async (data: {
    title: string;
    description?: string;
    address: string;
    city: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    images?: string[];
    categoryId: string;
  }): Promise<ApiResponse<Property>> => {
    const response = await apiClient.post('/api/landlord/properties', data);
    return response.data;
  },

  // Update an existing property
  update: async (id: string, data: Partial<{
    title: string;
    description: string;
    address: string;
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: string[];
    categoryId: string;
  }>): Promise<ApiResponse<Property>> => {
    const response = await apiClient.put(`/api/landlord/properties/${id}`, data);
    return response.data;
  },

  // Delete a property
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/api/landlord/properties/${id}`);
    return response.data;
  },
};

export default propertyApi;