'use client';

import { RentalStatus } from '@/types/request';

interface RequestStatusBadgeProps {
  status: RentalStatus;
}

export const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  const statusMap: Record<RentalStatus, { label: string; className: string }> = {
    PENDING: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    APPROVED: {
      label: 'Approved',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    REJECTED: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    ACTIVE: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    COMPLETED: {
      label: 'Completed',
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
  };

  const { label, className } = statusMap[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${
        status === 'PENDING' ? 'bg-yellow-500' :
        status === 'APPROVED' ? 'bg-blue-500' :
        status === 'REJECTED' ? 'bg-red-500' :
        status === 'ACTIVE' ? 'bg-green-500' :
        'bg-gray-500'
      }`} />
      {label}
    </span>
  );
};

export default RequestStatusBadge;