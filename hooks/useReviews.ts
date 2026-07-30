import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reviewApi from '@/lib/api/reviews';

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { propertyId: string; rating: number; comment?: string }) =>
      reviewApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};