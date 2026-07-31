import apiClient from './client';

export const landlordApi = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/api/landlord/dashboard/stats');
    return response.data;
  },

  // Properties
  getMyProperties: async () => {
    const response = await apiClient.get('/api/landlord/properties');
    return response.data;
  },

  getPropertyById: async (id: string) => {
    const response = await apiClient.get(`/api/landlord/properties/${id}`);
    return response.data;
  },

  createProperty: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/api/landlord/properties', data);
    return response.data;
  },

  updateProperty: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/api/landlord/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await apiClient.delete(`/api/landlord/properties/${id}`);
    return response.data;
  },

  // Requests
  getMyRequests: async () => {
    const response = await apiClient.get('/api/landlord/requests');
    return response.data;
  },

  getRequestById: async (id: string) => {
    const response = await apiClient.get(`/api/landlord/requests/${id}`);
    return response.data;
  },

  respondToRequest: async (id: string, data: { status: 'APPROVED' | 'REJECTED' }) => {
    const response = await apiClient.patch(`/api/landlord/requests/${id}`, data);
    return response.data;
  },

  completeRental: async (id: string) => {
    const response = await apiClient.patch(`/api/landlord/requests/${id}/complete`);
    return response.data;
  },
};

export default landlordApi;