// app/tenant/payments/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { paymentApi } from '@/lib/api/payments';
import { useToast } from '@/providers/ToastProvider';
import { CheckCircle, Loader2, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionId) {
      confirmPayment();
    } else {
      toast.error('No session ID found');
      router.push('/tenant/rentals');
    }
  }, [sessionId]);

  const confirmPayment = async () => {
    try {
      await paymentApi.confirm({ sessionId: sessionId! });
      setSuccess(true);
      toast.success('Payment confirmed successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Payment confirmation failed');
      router.push('/tenant/rentals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Successful! 🎉</h1>
        <p className="text-gray-500 mt-2">
          Your payment has been confirmed. Your rental is now active.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tenant/rentals"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
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