'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { XCircle, Home, ArrowLeft, CreditCard, HelpCircle, RotateCcw } from 'lucide-react';

export default function PaymentCancelContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/';
    
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
    if (!isAuthenticated || !user) return 'Go Home';
    
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
    if (!isAuthenticated || !user) return 'from-blue-500 to-indigo-600';
    
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

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gradient-to-b from-yellow-50/30 to-white">
      <div className="text-center max-w-md bg-white rounded-3xl shadow-2xl border border-yellow-100 p-8 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-100 rounded-full opacity-20" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-100 rounded-full opacity-20" />

        {/* Icon */}
        <div className="relative">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-6 shadow-2xl shadow-yellow-500/30 border-4 border-white">
            <XCircle className="w-14 h-14 text-white" />
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-yellow-200 animate-ping opacity-75" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-4 border-yellow-100 animate-ping opacity-50 delay-150" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Cancelled</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Your payment was cancelled. You can try again whenever you&apos;re ready.
        </p>

        {/* Cancellation badge */}
        <div className="mt-4 inline-block px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
          <span className="text-sm font-medium text-yellow-700 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Payment Not Completed
          </span>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-yellow-500" />
            Why was it cancelled?
          </p>
          <ul className="text-xs text-gray-500 mt-2 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              You closed the payment window before completing
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              Your bank declined the transaction
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              Insufficient balance in your account
            </li>
          </ul>
        </div>

        {/* Countdown */}
        <div className="mt-6 text-sm text-gray-400">
          Redirecting in <span className="font-bold text-yellow-600">{countdown}s</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tenant/rentals"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rentals
          </Link>
          <Link
            href={getDashboardLink()}
            className={`px-6 py-3 bg-gradient-to-r ${getRoleColor()} text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2`}
          >
            <Home className="w-4 h-4" />
            {getDashboardLabel()}
          </Link>
        </div>

        {/* Try Again Link */}
        <div className="mt-4">
          <Link
            href="/tenant/rentals"
            className="text-sm text-yellow-600 hover:text-yellow-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Payment Again
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-400 mt-6">
          Need help? <Link href="#" className="text-blue-500 hover:text-blue-600">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}