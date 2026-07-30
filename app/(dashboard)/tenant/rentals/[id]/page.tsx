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
  Star,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
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
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Transaction ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; bg: string; border: string }> = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pending Review',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'text-green-600',
        label: 'Approved',
        bg: 'bg-green-50',
        border: 'border-green-200',
      },
      REJECTED: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Rejected',
        bg: 'bg-red-50',
        border: 'border-red-200',
      },
      ACTIVE: {
        icon: Sparkles,
        color: 'text-blue-600',
        label: 'Active Rental',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      },
      COMPLETED: {
        icon: CheckCircle,
        color: 'text-purple-600',
        label: 'Completed',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
      },
    };
    return configs[status] || {
      icon: AlertCircle,
      color: 'text-gray-600',
      label: status,
      bg: 'bg-gray-50',
      border: 'border-gray-200',
    };
  };

  const formatTransactionId = (id: string) => {
    if (!id) return 'N/A';
    if (id.length <= 16) return id;
    return `${id.slice(0, 10)}...${id.slice(-6)}`;
  };

  if (loading) {
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
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">Rental Not Found</h2>
          <p className="text-gray-500 mt-2">The rental request you&apos;re looking for doesn&apos;t exist</p>
          <Link
            href="/tenant/rentals"
            className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
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
  const canReview = rental.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-all hover:translate-x-[-4px]"
        >
          <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Rentals</span>
        </button>

        {/* Status Banner */}
        <div className={`p-4 rounded-2xl border ${StatusConfig.bg} ${StatusConfig.border} mb-6 shadow-sm`}>
          <div className="flex items-center gap-3 flex-wrap">
            <StatusIcon className={`w-6 h-6 ${StatusConfig.color}`} />
            <span className={`font-semibold ${StatusConfig.color}`}>
              Status: {StatusConfig.label}
            </span>
            {rental.status === 'PENDING' && (
              <span className="text-sm text-yellow-600 animate-pulse ml-2 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Waiting for landlord response...
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                Property Details
              </h2>
              <Link
                href={`/tenant/properties/${rental.propertyId}`}
                className="block hover:bg-gray-50 rounded-xl p-3 -m-3 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">{rental.property?.title || 'Property'}</h3>
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{rental.property?.address || 'N/A'}, {rental.property?.city || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    ${rental.property?.price || 0}/month
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Move-in: {new Date(rental.moveInDate).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                Payment Information
              </h2>
              {rental.payment ? (
                <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                  {/* Transaction ID */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200 gap-2">
                    <span className="text-gray-500 text-sm">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 max-w-[140px] sm:max-w-[220px] truncate">
                        {formatTransactionId(rental.payment.transactionId)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(rental.payment.transactionId)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                        title="Copy full Transaction ID"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Full ID - visible on desktop */}
                  <div className="text-xs text-gray-400 bg-gray-100 rounded-lg p-2 border border-gray-200 break-all hidden sm:block">
                    <span className="font-mono">{rental.payment.transactionId}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500 text-sm">Amount</span>
                    <span className="font-bold text-gray-900">${rental.payment.amount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500 text-sm">Status</span>
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
                      <span className="text-gray-500 text-sm">Paid At</span>
                      <span className="text-gray-900 text-sm">
                        {new Date(rental.payment.paidAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500">No payment has been made yet</p>
                  {canPay && (
                    <button
                      onClick={handlePayment}
                      disabled={processing}
                      className="mt-4 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
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
                    <p className="text-sm text-yellow-600 mt-2 flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      Payment will be available after landlord approval
                    </p>
                  )}
                  {rental.status === 'REJECTED' && (
                    <p className="text-sm text-red-600 mt-2 flex items-center justify-center gap-1">
                      <XCircle className="w-4 h-4" />
                      This request was rejected. Payment is not possible.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Message */}
            {rental.message && (
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  Your Message
                </h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600 whitespace-pre-wrap">{rental.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tenant Info */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                Your Info
              </h2>
              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="truncate">{rental.tenant?.name || user?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="truncate">{rental.tenant?.email || user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span>{rental.tenant?.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                Timeline
              </h2>
              <div className="space-y-4 relative pl-4 border-l-2 border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 mt-1 rounded-full bg-blue-600 flex-shrink-0 shadow-md" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                    <p className="text-xs text-gray-400">
                      {new Date(rental.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {rental.status !== 'PENDING' && (
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 mt-1 rounded-full flex-shrink-0 shadow-md ${
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
                    <div className="w-3 h-3 mt-1 rounded-full bg-green-600 flex-shrink-0 shadow-md" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment Completed</p>
                      <p className="text-xs text-gray-400">
                        {rental.payment?.paidAt ? new Date(rental.payment.paidAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
                {rental.status === 'COMPLETED' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 mt-1 rounded-full bg-purple-600 flex-shrink-0 shadow-md" />
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

            {/* Active Rental Card */}
            {rental.status === 'ACTIVE' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  Rental Active
                </h2>
                <p className="text-sm text-gray-600">
                  Your rental is currently active. Enjoy your stay!
                </p>
                <Link
                  href={`/tenant/properties/${rental.propertyId}`}
                  className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  View Property →
                </Link>
              </div>
            )}

            {/* Review Card */}
            {canReview && mounted && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl border-2 border-yellow-200 p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  Review This Property
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  Share your experience and help others make informed decisions.
                </p>
                <Link
                  href={`/tenant/reviews/create?rentalId=${rental.id}&propertyId=${rental.propertyId}`}
                  className="inline-block w-full text-center px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50"
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Write a Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}