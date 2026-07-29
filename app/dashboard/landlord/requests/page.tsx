'use client';

import { useAuth } from '@/hooks/useAuth';
import { useLandlordRequests, useRespondToRequest } from '@/hooks/useRentalRequests';
import { useToast } from '@/providers/ToastProvider';
import RequestTable from '@/components/Requests/RequestTable';
import { FileText } from 'lucide-react';

export default function LandlordRequestsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useLandlordRequests();
  const { mutate, isPending } = useRespondToRequest();
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: 'APPROVED' | 'REJECTED') => {
    mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success(`Request ${status.toLowerCase()} successfully`);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to update request');
        },
      }
    );
  };

  if (user?.role !== 'LANDLORD') {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Access denied. Landlord only.</p>
      </div>
    );
  }

  const requests = data?.data || [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rental Requests</h1>
          <p className="text-gray-600 mt-1">Manage incoming rental requests</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Total: {requests.length} request{requests.length !== 1 ? 's' : ''}
          </p>
          <span className="text-sm text-gray-500">
            Pending: {requests.filter(r => r.status === 'PENDING').length}
          </span>
        </div>
        <RequestTable
          requests={requests}
          isLoading={isLoading}
          showActions={true}
          onStatusChange={handleStatusChange}
          isUpdating={isPending}
        />
      </div>
    </div>
  );
}