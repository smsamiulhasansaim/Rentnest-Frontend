import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/api/admin';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getUsers,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'ACTIVE' | 'BANNED' }) =>
      adminApi.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
};

export const useAdminProperties = () => {
  return useQuery({
    queryKey: ['adminProperties'],
    queryFn: adminApi.getProperties,
  });
};

export const useAdminProperty = (id: string) => {
  return useQuery({
    queryKey: ['adminProperty', id],
    queryFn: () => adminApi.getPropertyById(id),
    enabled: !!id,
  });
};

export const useAdminDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
};

export const useAdminRentals = () => {
  return useQuery({
    queryKey: ['adminRentals'],
    queryFn: adminApi.getRentals,
  });
};
export const useAdminRental = (id: string) => {
  return useQuery({
    queryKey: ['adminRental', id],
    queryFn: () => adminApi.getRentalById(id),
    enabled: !!id,
  });
};
export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['adminCategories'],
    queryFn: adminApi.getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => adminApi.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      adminApi.updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
  });
};