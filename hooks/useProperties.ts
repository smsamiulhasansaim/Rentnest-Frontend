import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import propertyApi from '@/lib/api/properties';
import landlordApi from '@/lib/api/landlord';
import { PropertyFilters, CreatePropertyData, UpdatePropertyData } from '@/types/property';

// Public
export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.getAll(filters),
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: propertyApi.getCategories,
  });
};

// Landlord specific
export const useLandlordProperties = () => {
  return useQuery({
    queryKey: ['landlordProperties'],
    queryFn: landlordApi.getMyProperties,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePropertyData) => landlordApi.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landlordProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyData }) =>
      landlordApi.updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['landlordProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => landlordApi.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landlordProperties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};