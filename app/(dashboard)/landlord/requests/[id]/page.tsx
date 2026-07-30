// app/landlord/requests/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import rentalApi from '@/lib/api/rentals';
import { RentalRequest } from '@/types/rental';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  ArrowLeft,
  Home,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  MessageSquare,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export default function LandlordRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const requestId = params.id as string;

  const [request, setRequest] = useState<RentalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      // Get all landlord requests and find the specific one
      const response = await rentalApi.getLandlordRequests();
      const found = response.data?.find((r) => r.id === requestId);
      
      if (found) {
        setRequest(found);
      } else {
        toast.error('Rental request not found');
        router.push('/landlord/requests');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load request');
      router.push('/landlord/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (status: 'APPROVED' | 'REJECTED') => {
    setProcessing(true);
    try {
      await rentalApi.respondToRequest(requestId, status);
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequest(); // Refresh
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to respond');
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    setProcessing(true);
    try {
      await rentalApi.completeRental(requestId);
      toast.success('Rental marked as completed');
      fetchRequest(); // Refresh
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to complete rental');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; bg: string }> = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pending',
        bg: 'bg-yellow-50 border-yellow-200',
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'text-green-600',
        label: 'Approved',
        bg: 'bg-green-50 border-green-200',
      },
      REJECTED: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Rejected',
        bg: 'bg-red-50 border-red-200',
      },
      ACTIVE: {
        icon: Home,
        color: 'text-blue-600',
        label: 'Active',
        bg: 'bg-blue-50 border-blue-200',
      },
      COMPLETED: {
        icon: CheckCircle,
        color: 'text-purple-600',
        label: 'Completed',
        bg: 'bg-purple-50 border-purple-200',
      },
    };
    return configs[status] || {
      icon: Clock,
      color: 'text-gray-600',
      label: status,
      bg: 'bg-gray-50 border-gray-200',
    };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Request Not Found</h2>
          <Link href="/landlord/requests" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Requests
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Rental Request</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-blue-100 mt-1">
                Requested on {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {request.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleRespond('APPROVED')}
                    disabled={processing}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleRespond('REJECTED')}
                    disabled={processing}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Reject
                  </button>
                </>
              )}
              {request.status === 'ACTIVE' && (
                <button
                  onClick={handleComplete}
                  disabled={processing}
                  className="px-4 py-2 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Property Details */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-blue-600" />
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium text-gray-900">{request.property?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {request.property?.city || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-blue-600">${request.property?.price || 0}/month</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Move-in Date</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(request.moveInDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {request.message && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Tenant's Message
                </p>
                <p className="text-gray-700 mt-1 italic">"{request.message}"</p>
              </div>
            )}
          </div>

          {/* Tenant Details */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              Tenant Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{request.tenant?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {request.tenant?.email || 'N/A'}
                </p>
              </div>
              {request.tenant?.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {request.tenant.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          {request.payment && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-gray-900">${request.payment.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${
                    request.payment.status === 'COMPLETED' ? 'text-green-600' :
                    request.payment.status === 'PENDING' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {request.payment.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium text-gray-900">{request.payment.provider}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {request.status === 'PENDING' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
              <p className="text-yellow-700">
                ⏳ This request is pending your decision. Approve or reject above.
              </p>
            </div>
          )}

          {request.status === 'APPROVED' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-green-700">
                ✅ Request approved! Waiting for tenant to complete payment.
              </p>
            </div>
          )}

          {request.status === 'ACTIVE' && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <p className="text-blue-700">
                🏠 Rental is active! Mark as completed when done.
              </p>
            </div>
          )}

          {request.status === 'COMPLETED' && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
              <p className="text-purple-700">
                ✅ Rental completed! Tenant can now leave a review.
              </p>
            </div>
          )}

          {request.status === 'REJECTED' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <p className="text-red-700">
                ❌ This request has been rejected.
              </p>
            </div>
          )}

          {/* View Property */}
          <Link
            href={`/tenant/properties/${request.propertyId}`}
            target="_blank"
            className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            View Property Details →
          </Link>
        </div>
      </div>
    </div>
  );
}