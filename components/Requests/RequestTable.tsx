'use client';

import { RentalRequest } from '@/types/request';
import RequestStatusBadge from './RequestStatusBadge';
import Link from 'next/link';
import { Eye, Calendar } from 'lucide-react';

interface RequestTableProps {
  requests: RentalRequest[];
  isLoading?: boolean;
  showActions?: boolean;
  onStatusChange?: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  isUpdating?: boolean;
}

export const RequestTable = ({
  requests,
  isLoading,
  showActions = false,
  onStatusChange,
  isUpdating = false,
}: RequestTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No rental requests found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Property</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tenant</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Move-in Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            {showActions && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            )}
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{request.property?.title || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{request.property?.city || ''}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{request.tenant?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{request.tenant?.email || ''}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(request.moveInDate).toLocaleDateString()}
                </div>
              </td>
              <td className="px-4 py-3">
                <RequestStatusBadge status={request.status} />
              </td>
              {showActions && onStatusChange && (
                <td className="px-4 py-3">
                  {request.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onStatusChange(request.id, 'APPROVED')}
                        disabled={isUpdating}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onStatusChange(request.id, 'REJECTED')}
                        disabled={isUpdating}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {request.status === 'ACTIVE' && (
                    <span className="text-sm text-green-600 font-medium">Active ✓</span>
                  )}
                </td>
              )}
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/tenant/requests/${request.id}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;