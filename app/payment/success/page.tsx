'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirmPayment } from '@/hooks/usePayments';
import { useToast } from '@/providers/ToastProvider';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, isPending } = useConfirmPayment();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      toast.error('No session ID found');
      router.push('/dashboard/tenant');
      return;
    }

    if (!confirmed && !isPending) {
      mutate(sessionId, {
        onSuccess: () => {
          setConfirmed(true);
          toast.success('Payment confirmed successfully!');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Payment confirmation failed');
          router.push('/dashboard/tenant');
        },
      });
    }
  }, [sessionId, confirmed, isPending, mutate, router, toast]);

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">Confirming payment...</h2>
        <p className="text-gray-500 mt-2">Please wait while we verify your payment</p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Your payment has been confirmed. Your rental is now active.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">
            Transaction ID: <span className="font-mono text-gray-700">{sessionId}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/tenant"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/properties"
            className="text-blue-600 hover:underline"
          >
            Browse More Properties
          </Link>
        </div>
      </div>
    </div>
  );
}