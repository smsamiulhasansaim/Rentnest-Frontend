import apiClient from './client';
import { RentalRequest, CreateRentalRequestData } from '@/types/request';

export const rentalApi = {
  create: async (data: CreateRentalRequestData): Promise<{ data: RentalRequest }> => {
    const response = await apiClient.post('/api/rentals', data);
    return response.data;
  },

  getMyRequests: async (): Promise<{ data: RentalRequest[] }> => {
    const response = await apiClient.get('/api/rentals');
    return response.data;
  },

  getById: async (id: string): Promise<{ data: RentalRequest }> => {
    const response = await apiClient.get(`/api/rentals/${id}`);
    return response.data;
  },
};

export default rentalApi;