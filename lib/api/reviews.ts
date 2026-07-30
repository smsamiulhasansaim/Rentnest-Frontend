import apiClient from './client';
import { Review, ApiResponse } from '@/types/review';

export const reviewApi = {
  create: async (data: { propertyId: string; rating: number; comment?: string }) => {
    const response = await apiClient.post<ApiResponse<Review>>('/api/reviews', data);
    return response.data;
  },
};

export default reviewApi;