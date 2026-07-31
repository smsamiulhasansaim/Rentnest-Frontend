'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { paymentApi } from '@/lib/api/payments';
import { useToast } from '@/providers/ToastProvider';
import { CheckCircle, Loader2, Home, ArrowRight, Sparkles, PartyPopper } from 'lucide-react';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (sessionId) {
      confirmPayment();
    } else {
      setError('No session ID found. Please contact support.');
      toast.error('No session ID found');
      setLoading(false);
    }
  }, [sessionId]);

  // Auto-redirect after success
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (success && countdown === 0) {
      router.push('/tenant/rentals');
    }
  }, [success, countdown, router]);

  const confirmPayment = async () => {
    try {
      const response = await paymentApi.confirm(sessionId!);
      console.log('Payment confirmed:', response);
      setSuccess(true);
      toast.success('Payment confirmed successfully! 🎉');
    } catch (err: any) {
      console.error('Payment confirmation error:', err);
      
      // Better error messages
      let errorMessage = 'Payment confirmation failed. Please try again.';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Payment session not found. Please contact support.';
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Invalid payment session. Please try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'This payment has already been processed.';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get role-based redirect links
  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'TENANT':
        return '/tenant/dashboard';
      case 'LANDLORD':
        return '/landlord/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Go Home';
    switch (user.role) {
      case 'TENANT':
        return 'Dashboard';
      case 'LANDLORD':
        return 'Dashboard';
      case 'ADMIN':
        return 'Admin Panel';
      default:
        return 'Go Home';
    }
  };

  const getRoleColor = () => {
    if (!user) return 'from-blue-500 to-indigo-600';
    switch (user.role) {
      case 'TENANT':
        return 'from-blue-500 to-indigo-600';
      case 'LANDLORD':
        return 'from-green-500 to-emerald-600';
      case 'ADMIN':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full" />
            </div>
          </div>
          <p className="text-gray-500 mt-6 text-sm animate-pulse">
            Confirming your payment...
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Please wait while we verify your transaction
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 border-4 border-red-200">
            <CheckCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Error</h1>
          <p className="text-gray-500 mt-2 text-sm">{error}</p>
          
          <div className="mt-2 p-3 bg-red-50 rounded-xl border border-red-100 text-left">
            <p className="text-xs text-red-600 font-mono break-all">
              Session ID: {sessionId || 'N/A'}
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tenant/rentals"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              View My Rentals
            </Link>
            <Link
              href="/tenant/payments"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Payment History
            </Link>
          </div>

          <button
            onClick={() => router.push('/')}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Home className="w-3 h-3 inline mr-1" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gradient-to-b from-green-50/30 to-white">
      <div className="text-center max-w-md bg-white rounded-3xl shadow-2xl border border-green-100 p-8 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-20" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 rounded-full opacity-20" />

        {/* Success Animation */}
        <div className="relative">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-2xl shadow-green-500/30 border-4 border-white">
            <PartyPopper className="w-14 h-14 text-white" />
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-green-200 animate-ping opacity-75" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-4 border-green-100 animate-ping opacity-50 delay-150" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Your payment has been confirmed. Your rental is now active.
        </p>

        {/* Confirmation badge */}
        <div className="mt-4 inline-block px-4 py-2 bg-green-50 border border-green-200 rounded-full">
          <span className="text-sm font-medium text-green-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Transaction Completed
          </span>
        </div>

        {/* Countdown */}
        <div className="mt-6 text-sm text-gray-400">
          Redirecting to rentals in <span className="font-bold text-blue-600">{countdown}s</span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tenant/rentals"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            View My Rentals
          </Link>
          <Link
            href={getDashboardLink()}
            className={`px-6 py-3 bg-gradient-to-r ${getRoleColor()} text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2`}
          >
            <Home className="w-4 h-4" />
            {getDashboardLabel()}
          </Link>
        </div>

        {/* Additional info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-100 text-left">
          <p className="text-xs text-gray-400">
            <span className="font-medium text-gray-500">Transaction ID:</span>{' '}
            <span className="font-mono">{sessionId || 'N/A'}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            <span className="font-medium text-gray-500">Status:</span>{' '}
            <span className="text-green-600 font-medium">Completed</span>
          </p>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}