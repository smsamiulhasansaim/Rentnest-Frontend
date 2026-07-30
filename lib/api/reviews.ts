import apiClient from './client';
import { Review, ApiResponse } from '@/types/review';

export const reviewApi = {
  create: (data: { propertyId: string; rating: number; comment?: string }) => {
    return apiClient.post<ApiResponse<Review>>('/reviews', data);
  },
};