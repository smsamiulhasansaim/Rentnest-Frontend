'use client';

import { useParams } from 'next/navigation';
import { useRentalRequest } from '@/hooks/useRentalRequests';
import { useAuth } from '@/hooks/useAuth';
import PaymentCheckout from '@/components/Payment/PaymentCheckout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PaymentPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, isLoading } = useRentalRequest(id as string);

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-gray-200 h-64 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const request = data?.data;

  if (!request) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <p className="text-gray-600">Rental request not found</p>
        <Link href="/dashboard/tenant" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (request.status !== 'APPROVED') {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <p className="text-gray-600">
          This request is {request.status.toLowerCase()}. Payment is only available for approved requests.
        </p>
        <Link href="/dashboard/tenant" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (request.payment && request.payment.status === 'COMPLETED') {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 font-semibold text-lg">✓ Payment Already Completed</p>
          <p className="text-green-600 mt-2">This rental has already been paid for.</p>
          <Link href="/dashboard/tenant" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        href="/dashboard/tenant"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <PaymentCheckout
        rentalRequestId={request.id}
        amount={request.property?.price || 0}
        propertyTitle={request.property?.title || 'Property'}
      />
    </div>
  );
}