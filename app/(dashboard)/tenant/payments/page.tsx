'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { paymentApi } from '@/lib/api/payments';
import { Payment } from '@/types/payment';
import {
  Loader2,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Home,
  Wallet,
  Sparkles,
} from 'lucide-react';

export default function PaymentsPage() {
  const { user, isAuthenticated } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }
    fetchPayments();
  }, [isAuthenticated]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentApi.getMyPayments();
      setPayments(response.data || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      setError(error?.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; bg: string; border: string }> = {
      COMPLETED: {
        icon: CheckCircle,
        color: 'text-green-600',
        label: 'Completed',
        bg: 'bg-green-50',
        border: 'border-green-200',
      },
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pending',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
      },
      FAILED: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Failed',
        bg: 'bg-red-50',
        border: 'border-red-200',
      },
      REFUNDED: {
        icon: XCircle,
        color: 'text-gray-600',
        label: 'Refunded',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
      },
    };
    return configs[status] || {
      icon: CreditCard,
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
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading payment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">Something went wrong</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={fetchPayments}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                  <p className="text-gray-500 text-sm">
                    {payments.length} {payments.length === 1 ? 'transaction' : 'transactions'} found
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/tenant/dashboard"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Payments List */}
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => {
              const StatusConfig = getStatusConfig(payment.status);
              const StatusIcon = StatusConfig.icon;
              return (
                <div
                  key={payment.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all p-6 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {payment.rentalRequest?.property?.title || 'Property Payment'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${StatusConfig.bg} ${StatusConfig.border} ${StatusConfig.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {StatusConfig.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="font-bold text-blue-600 text-lg">${payment.amount}</span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-gray-400" />
                          {payment.provider}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                          {formatTransactionId(payment.transactionId)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm flex-shrink-0 flex-wrap">
                      <span className="text-gray-400 hidden sm:block">
                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {payment.paidAt && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      )}
                      {payment.rentalRequest && (
                        <Link
                          href={`/tenant/rentals/${payment.rentalRequestId}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Rental
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No payments yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              You haven't made any payments. Browse available properties and start your rental journey.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tenant/properties"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Browse Properties
              </Link>
              <Link
                href="/tenant/rentals"
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors border border-gray-200"
              >
                View My Rentals
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}