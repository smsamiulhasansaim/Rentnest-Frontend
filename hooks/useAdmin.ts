import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/api/admin';
import { UserStatus } from '@/types/user';

export const useUsers = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getUsers,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      adminApi.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};

export const useAdminProperties = () => {
  return useQuery({
    queryKey: ['adminProperties'],
    queryFn: adminApi.getProperties,
  });
};

export const useAdminRentals = () => {
  return useQuery({
    queryKey: ['adminRentals'],
    queryFn: adminApi.getRentals,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => adminApi.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};