'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { paymentApi } from '@/lib/api/payments';
import { useToast } from '@/providers/ToastProvider';
import { CheckCircle, Loader2, Home, ArrowRight } from 'lucide-react';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      confirmPayment();
    } else {
      setError('No session ID found');
      toast.error('No session ID found');
      setLoading(false);
    }
  }, [sessionId]);

  const confirmPayment = async () => {
    try {
      const response = await paymentApi.confirm(sessionId!);
      console.log('Payment confirmation response:', response);
      setSuccess(true);
      toast.success('Payment confirmed successfully! 🎉');
    } catch (err: any) {
      console.error('Payment confirmation error:', err);
      setError(err?.message || 'Payment confirmation failed');
      toast.error(err?.message || 'Payment confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-500 mt-4">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Error</h1>
          <p className="text-gray-500 mt-2">{error}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tenant/rentals"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              View My Rentals
            </Link>
            <Link
              href="/tenant/payments"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Payment History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Successful! 🎉</h1>
        <p className="text-gray-500 mt-2">
          Your payment has been confirmed. Your rental is now active.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tenant/rentals"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            View My Rentals
          </Link>
          <Link
            href="/tenant/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}