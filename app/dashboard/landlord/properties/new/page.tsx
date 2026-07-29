'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCreateProperty } from '@/hooks/useProperties';
import { useToast } from '@/providers/ToastProvider';
import PropertyForm from '@/components/Forms/PropertyForm';
import { CreatePropertyData } from '@/types/property';

export default function NewPropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, isPending } = useCreateProperty();

  const handleSubmit = (data: CreatePropertyData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Property created successfully!');
        router.push('/dashboard/landlord');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create property');
      },
    });
  };

  if (user?.role !== 'LANDLORD') {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Access denied. Landlord only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">List New Property</h1>
        <p className="text-gray-600 mt-1">Fill in the details to list your property</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <PropertyForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
}