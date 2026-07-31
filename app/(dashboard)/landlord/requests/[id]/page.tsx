'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { landlordApi } from '@/lib/api/landlord';
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
  AlertCircle,
  Timer,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';

interface RequestDetail {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
  moveInDate: string;
  message: string;
  createdAt: string;
  tenant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  property: {
    id: string;
    title: string;
    city: string;
    price: number;
    address: string;
    description: string;
    images: string[];
    status: string;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
  };
  payment: {
    id: string;
    transactionId: string;
    amount: number;
    status: string;
    provider: string;
    paidAt: string;
    createdAt: string;
  } | null;
}

type ActionType = 'APPROVED' | 'REJECTED' | 'COMPLETE' | null;

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const requestId = params.id as string;

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<ActionType>(null);

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const response = await landlordApi.getRequestById(requestId);
      setRequest(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to load request';
      toast.error(message);
      router.push('/landlord/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (status: 'APPROVED' | 'REJECTED') => {
    setActiveAction(status);
    try {
      await landlordApi.respondToRequest(requestId, { status });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      // Refetch to update UI
      await fetchRequest();
      // Redirect to requests list after response
      router.push('/landlord/requests');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to respond';
      toast.error(message);
      setActiveAction(null);
    }
  };

  const handleComplete = async () => {
    setActiveAction('COMPLETE');
    try {
      await landlordApi.completeRental(requestId);
      toast.success('Rental marked as completed');
      await fetchRequest();
      router.push('/landlord/requests');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to complete rental';
      toast.error(message);
    } finally {
      setActiveAction(null);
    }
  };

  const isProcessing = activeAction !== null;

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; bg: string }> = {
      PENDING: { icon: Clock, color: 'text-yellow-600', label: 'Pending', bg: 'bg-yellow-50' },
      APPROVED: { icon: CheckCircle, color: 'text-green-600', label: 'Approved', bg: 'bg-green-50' },
      REJECTED: { icon: XCircle, color: 'text-red-600', label: 'Rejected', bg: 'bg-red-50' },
      ACTIVE: { icon: Sparkles, color: 'text-blue-600', label: 'Active', bg: 'bg-blue-50' },
      COMPLETED: { icon: CheckCircle, color: 'text-purple-600', label: 'Completed', bg: 'bg-purple-50' }
    };
    return configs[status] || { icon: AlertCircle, color: 'text-gray-600', label: status, bg: 'bg-gray-50' };
  };

  const getStatusMessage = (status: string) => {
    const messages: Record<string, { icon: any; text: string }> = {
      PENDING: { icon: Timer, text: 'This request is pending your decision. Approve or reject above.' },
      APPROVED: { icon: ThumbsUp, text: 'Request approved. Waiting for tenant to complete payment.' },
      REJECTED: { icon: ThumbsDown, text: 'This request has been rejected.' },
      ACTIVE: { icon: Home, text: 'Rental is active. Mark as completed when done.' },
      COMPLETED: { icon: CheckCircle, text: 'Rental completed. Tenant can now leave a review.' }
    };
    return messages[status] || { icon: AlertCircle, text: status };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-4">Loading request...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Request Not Found</h2>
          <Link href="/landlord/requests" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;
  const statusMessage = getStatusMessage(request.status);
  const MessageIcon = statusMessage.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Requests</span>
        </button>

        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <InboxIcon className="w-6 h-6" />
                    <h1 className="text-xl font-bold">Rental Request</h1>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </span>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Requested on {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {request.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleRespond('APPROVED')}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {activeAction === 'APPROVED' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleRespond('REJECTED')}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {activeAction === 'REJECTED' ? (
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
                    disabled={isProcessing}
                    className="px-4 py-2 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {activeAction === 'COMPLETE' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Property Details */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-medium text-gray-900">{request.property?.bedrooms || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-medium text-gray-900">{request.property?.bathrooms || 0}</p>
                </div>
              </div>
              {request.message && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Tenant's Message
                  </p>
                  <p className="text-gray-700 mt-1 italic">"{request.message}"</p>
                </div>
              )}
            </div>

            {/* Tenant Details */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                Tenant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <div className="bg-gray-50 rounded-xl p-5">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  Payment Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

            {/* Status Message */}
            <div className={`rounded-xl p-4 text-center ${
              request.status === 'PENDING' ? 'bg-yellow-50 border border-yellow-200' :
              request.status === 'APPROVED' ? 'bg-green-50 border border-green-200' :
              request.status === 'ACTIVE' ? 'bg-blue-50 border border-blue-200' :
              request.status === 'COMPLETED' ? 'bg-purple-50 border border-purple-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <p className={`flex items-center justify-center gap-2 ${
                request.status === 'PENDING' ? 'text-yellow-700' :
                request.status === 'APPROVED' ? 'text-green-700' :
                request.status === 'ACTIVE' ? 'text-blue-700' :
                request.status === 'COMPLETED' ? 'text-purple-700' :
                'text-red-700'
              }`}>
                <MessageIcon className="w-5 h-5" />
                {statusMessage.text}
              </p>
            </div>

            {/* View Property Link: Goes to landlord property details */}
            <Link
              href={`/landlord/properties/${request.property?.id}`}
              className="block w-full text-center px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
            >
              View Property Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon component
function InboxIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}