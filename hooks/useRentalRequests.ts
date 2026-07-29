import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import rentalApi from '@/lib/api/rentals';
import { CreateRentalRequestData } from '@/types/request';
import landlordApi from '@/lib/api/landlord';

export const useRentalRequests = () => {
  return useQuery({
    queryKey: ['rentalRequests'],
    queryFn: rentalApi.getMyRequests,
  });
};

export const useRentalRequest = (id: string) => {
  return useQuery({
    queryKey: ['rentalRequest', id],
    queryFn: () => rentalApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateRentalRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRentalRequestData) => rentalApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentalRequests'] });
    },
  });
};

// Landlord specific
export const useLandlordRequests = () => {
  return useQuery({
    queryKey: ['landlordRequests'],
    queryFn: landlordApi.getMyRequests,
  });
};

export const useRespondToRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) =>
      landlordApi.respondToRequest(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landlordRequests'] });
      queryClient.invalidateQueries({ queryKey: ['rentalRequests'] });
    },
  });
};

export const useCompleteRental = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => landlordApi.completeRental(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landlordRequests'] });
      queryClient.invalidateQueries({ queryKey: ['rentalRequests'] });
    },
  });
};