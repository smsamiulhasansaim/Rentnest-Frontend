import apiClient from './client';
import { Property, CreatePropertyData, UpdatePropertyData } from '@/types/property';
import { RentalRequest, UpdateRentalStatusData } from '@/types/request';

export const landlordApi = {
  // Property Management
  getMyProperties: async (): Promise<{ data: Property[] }> => {
    const response = await apiClient.get('/api/landlord/properties');
    return response.data;
  },

  createProperty: async (data: CreatePropertyData): Promise<{ data: Property }> => {
    const response = await apiClient.post('/api/landlord/properties', data);
    return response.data;
  },

  updateProperty: async (id: string, data: UpdatePropertyData): Promise<{ data: Property }> => {
    const response = await apiClient.put(`/api/landlord/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/landlord/properties/${id}`);
  },

  // Request Management
  getMyRequests: async (): Promise<{ data: RentalRequest[] }> => {
    const response = await apiClient.get('/api/landlord/requests');
    return response.data;
  },

  respondToRequest: async (id: string, data: UpdateRentalStatusData): Promise<{ data: RentalRequest }> => {
    const response = await apiClient.patch(`/api/landlord/requests/${id}`, data);
    return response.data;
  },

  completeRental: async (id: string): Promise<{ data: RentalRequest }> => {
    const response = await apiClient.patch(`/api/landlord/requests/${id}/complete`);
    return response.data;
  },
};

export default landlordApi;