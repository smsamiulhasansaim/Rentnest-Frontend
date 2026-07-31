'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminRental } from '@/hooks/useAdmin';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Home,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Building2,
} from 'lucide-react';

export default function AdminRentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const rentalId = params.id as string;

  const { data: rentalData, isLoading, refetch } = useAdminRental(rentalId);
  const rental = rentalData?.data;

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; label: string; icon: any; bg: string; border: string }> = {
      PENDING: { color: 'text-yellow-600', label: 'Pending', icon: Clock, bg: 'bg-yellow-50', border: 'border-yellow-200' },
      APPROVED: { color: 'text-green-600', label: 'Approved', icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200' },
      REJECTED: { color: 'text-red-600', label: 'Rejected', icon: XCircle, bg: 'bg-red-50', border: 'border-red-200' },
      ACTIVE: { color: 'text-blue-600', label: 'Active', icon: Sparkles, bg: 'bg-blue-50', border: 'border-blue-200' },
      COMPLETED: { color: 'text-purple-600', label: 'Completed', icon: CheckCircle, bg: 'bg-purple-50', border: 'border-purple-200' },
      CANCELLED: { color: 'text-gray-600', label: 'Cancelled', icon: XCircle, bg: 'bg-gray-50', border: 'border-gray-200' },
    };
    return configs[status] || { color: 'text-gray-600', label: status, icon: Clock, bg: 'bg-gray-50', border: 'border-gray-200' };
  };

  const getPaymentStatus = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      COMPLETED: { color: 'text-green-600', label: 'Completed' },
      PENDING: { color: 'text-yellow-600', label: 'Pending' },
      FAILED: { color: 'text-red-600', label: 'Failed' },
    };
    return configs[status] || { color: 'text-gray-600', label: status };
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading rental details...</p>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Rental Not Found</h2>
          <Link href="/admin/rentals" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Rentals
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(rental.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/rentals"
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 flex-wrap">
                Rental Request
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig.label}
                </span>
              </h1>
              <p className="text-gray-500 text-sm">
                Requested on {new Date(rental.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-500" />
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-bold text-gray-900">{rental.property?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {rental.property?.city || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-bold text-blue-600">${rental.property?.price || 0}<span className="text-sm text-gray-400 font-normal">/month</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Move-in Date</p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(rental.moveInDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-gray-700">
                    {new Date(rental.createdAt).toLocaleString()}
                  </p>
                </div>
                {rental.message && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Message</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-xl italic">"{rental.message}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tenant Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                Tenant Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{rental.tenant?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {rental.tenant?.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-500" />
                Payment Information
              </h2>
              {rental.payment ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-gray-900">${rental.payment.amount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${getPaymentStatus(rental.payment.status).color}`}>
                      {getPaymentStatus(rental.payment.status).label}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Provider</span>
                    <span className="text-gray-700">{rental.payment.provider || 'N/A'}</span>
                  </div>
                  {rental.payment.paidAt && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Paid At</span>
                      <span className="text-gray-700">
                        {new Date(rental.payment.paidAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {rental.payment.transactionId && (
                    <div className="flex justify-between py-2 border-t border-gray-100 pt-2">
                      <span className="text-gray-500 text-sm">Transaction ID</span>
                      <span className="text-xs text-gray-500 font-mono truncate max-w-[120px]">
                        {rental.payment.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-sm">No payment recorded</p>
                </div>
              )}
            </div>

            {/* Status Info */}
            <div className={`rounded-2xl p-4 border ${statusConfig.bg} ${statusConfig.border}`}>
              <div className="flex items-start gap-3">
                <StatusIcon className={`w-5 h-5 ${statusConfig.color} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`font-medium ${statusConfig.color}`}>
                    Status: {statusConfig.label}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {rental.status === 'PENDING' && 'Awaiting landlord response'}
                    {rental.status === 'APPROVED' && 'Approved by landlord, waiting for payment'}
                    {rental.status === 'REJECTED' && 'This request was rejected by the landlord'}
                    {rental.status === 'ACTIVE' && 'Rental is currently active'}
                    {rental.status === 'COMPLETED' && 'Rental has been completed'}
                    {rental.status === 'CANCELLED' && 'This request was cancelled'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <Link
                href={`/admin/properties/${rental.propertyId}`}
                className="block w-full text-center px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                View Property
              </Link>
              <Link
                href={`/admin/users/${rental.tenantId}`}
                className="block w-full text-center px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
              >
                <User className="w-4 h-4 inline mr-2" />
                View Tenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}