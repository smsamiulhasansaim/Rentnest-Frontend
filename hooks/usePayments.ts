import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import paymentApi from '@/lib/api/payments';
import { CreatePaymentData } from '@/types/payment';

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentApi.getMyPayments,
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaymentData) => paymentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => paymentApi.confirm(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['rentalRequests'] });
    },
  });
};