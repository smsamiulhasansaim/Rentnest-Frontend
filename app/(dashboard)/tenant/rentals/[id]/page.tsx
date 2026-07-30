// app/tenant/rentals/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { rentalApi } from '@/lib/api/rentals';
import { paymentApi } from '@/lib/api/payments';
import { RentalRequest } from '@/types/rental';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Building2,
} from 'lucide-react';

export default function RentalRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const rentalId = params.id as string;

  const [rental, setRental] = useState<RentalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRentalDetails();
  }, [rentalId]);

  const fetchRentalDetails = async () => {
    setLoading(true);
    try {
      const response = await rentalApi.getById(rentalId);
      setRental(response.data);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load rental details');
      router.push('/tenant/rentals');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!rental) return;
    setProcessing(true);
    try {
      const response = await paymentApi.create({
        rentalRequestId: rental.id,
      });
      // Redirect to Stripe Checkout
      if (response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error('Payment session creation failed');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Payment initiation failed');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; bg: string }> = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pending Review',
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
        label: 'Active Rental',
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
      icon: AlertCircle,
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

  if (!rental) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Rental Not Found</h2>
          <p className="text-gray-500 mt-2">The rental request you're looking for doesn't exist</p>
          <Link
            href="/tenant/rentals"
            className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            View My Rentals
          </Link>
        </div>
      </div>
    );
  }

  const StatusConfig = getStatusConfig(rental.status);
  const StatusIcon = StatusConfig.icon;
  const canPay = rental.status === 'APPROVED' && !rental.payment;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Rentals
      </button>

      {/* Status Banner */}
      <div className={`p-4 rounded-2xl border ${StatusConfig.bg} mb-6`}>
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-6 h-6 ${StatusConfig.color}`} />
          <span className={`font-semibold ${StatusConfig.color}`}>
            Status: {StatusConfig.label}
          </span>
          {rental.status === 'PENDING' && (
            <span className="text-sm text-yellow-600 animate-pulse ml-2">
              Waiting for landlord response...
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Property Details
            </h2>
            <Link
              href={`/tenant/properties/${rental.propertyId}`}
              className="block hover:bg-gray-50 rounded-xl p-3 -m-3 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900">{rental.property?.title || 'Property'}</h3>
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{rental.property?.address || 'N/A'}, {rental.property?.city || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${rental.property?.price || 0}/month
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Move-in: {new Date(rental.moveInDate).toLocaleDateString()}
                </span>
              </div>
            </Link>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Information
            </h2>
            {rental.payment ? (
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-sm text-gray-900">{rental.payment.transactionId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-gray-900">${rental.payment.amount}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-semibold ${
                    rental.payment.status === 'COMPLETED' ? 'text-green-600' :
                    rental.payment.status === 'PENDING' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {rental.payment.status}
                  </span>
                </div>
                {rental.payment.paidAt && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Paid At</span>
                    <span className="text-gray-900">
                      {new Date(rental.payment.paidAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No payment has been made yet</p>
                {canPay && (
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="mt-4 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay Now ${rental.property?.price || 0}
                      </>
                    )}
                  </button>
                )}
                {rental.status === 'PENDING' && (
                  <p className="text-sm text-yellow-600 mt-2">
                    Payment will be available after landlord approval
                  </p>
                )}
                {rental.status === 'REJECTED' && (
                  <p className="text-sm text-red-600 mt-2">
                    This request was rejected. Payment is not possible.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Message */}
          {rental.message && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Your Message</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{rental.message}</p>
            </div>
          )}
        </div>

        {/* Sidebar - Tenant Info & Timeline */}
        <div className="space-y-6">
          {/* Tenant Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Your Info
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span>{rental.tenant?.name || user?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{rental.tenant?.email || user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{rental.tenant?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                  <p className="text-xs text-gray-400">
                    {new Date(rental.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {rental.status !== 'PENDING' && (
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                    rental.status === 'APPROVED' || rental.status === 'ACTIVE' || rental.status === 'COMPLETED'
                      ? 'bg-green-600'
                      : 'bg-red-600'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {rental.status === 'APPROVED' || rental.status === 'ACTIVE' || rental.status === 'COMPLETED'
                        ? 'Approved'
                        : 'Rejected'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(rental.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {rental.status === 'ACTIVE' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Completed - Active</p>
                    <p className="text-xs text-gray-400">
                      {rental.payment?.paidAt ? new Date(rental.payment.paidAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              {rental.status === 'COMPLETED' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rental Completed</p>
                    <p className="text-xs text-gray-400">
                      {new Date(rental.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {rental.status === 'ACTIVE' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Rental Active</h2>
              <p className="text-sm text-gray-500">
                Your rental is currently active. Enjoy your stay!
              </p>
              <Link
                href={`/tenant/properties/${rental.propertyId}`}
                className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Property →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}