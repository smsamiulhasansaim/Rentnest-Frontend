// lib/api/rentals.ts
import apiClient from './client';
import { RentalRequest, ApiResponse } from '@/types/rental';

export const rentalApi = {
  // ============ TENANT APIs ============
  
  // Create a rental request (Tenant)
  create: async (data: { 
    propertyId: string; 
    moveInDate: string; 
    message?: string 
  }): Promise<ApiResponse<RentalRequest>> => {
    const response = await apiClient.post('/api/rentals', data);
    return response.data;
  },

  // Get all rental requests for the logged-in tenant
  getMyRequests: async (): Promise<ApiResponse<RentalRequest[]>> => {
    const response = await apiClient.get('/api/rentals');
    return response.data;
  },

  // Get single rental request by ID
  getById: async (id: string): Promise<ApiResponse<RentalRequest>> => {
    const response = await apiClient.get(`/api/rentals/${id}`);
    return response.data;
  },

  // ============ LANDLORD APIs ============
  
  // Get all rental requests for landlord's properties
  getLandlordRequests: async (): Promise<ApiResponse<RentalRequest[]>> => {
    const response = await apiClient.get('/api/landlord/requests');
    return response.data;
  },

  // Respond to a rental request (Approve or Reject)
  respondToRequest: async (id: string, status: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<RentalRequest>> => {
    const response = await apiClient.patch(`/api/landlord/requests/${id}`, { status });
    return response.data;
  },

  // Complete a rental (Landlord marks as completed)
  completeRental: async (id: string): Promise<ApiResponse<RentalRequest>> => {
    const response = await apiClient.patch(`/api/landlord/requests/${id}/complete`);
    return response.data;
  },
};

export default rentalApi;