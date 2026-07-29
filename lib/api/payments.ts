import apiClient from './client';
import { Payment, CreatePaymentData, PaymentSession } from '@/types/payment';

export const paymentApi = {
  create: async (data: CreatePaymentData): Promise<{ data: PaymentSession }> => {
    const response = await apiClient.post('/api/payments/create', data);
    return response.data;
  },

  confirm: async (sessionId: string): Promise<{ data: Payment }> => {
    const response = await apiClient.post('/api/payments/confirm', { sessionId });
    return response.data;
  },

  getMyPayments: async (): Promise<{ data: Payment[] }> => {
    const response = await apiClient.get('/api/payments');
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Payment }> => {
    const response = await apiClient.get(`/api/payments/${id}`);
    return response.data;
  },
};

export default paymentApi;