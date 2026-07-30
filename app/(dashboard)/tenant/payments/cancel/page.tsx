'use client';

import Link from 'next/link';
import { XCircle, Home, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6">
          <XCircle className="w-12 h-12 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Cancelled</h1>
        <p className="text-gray-500 mt-2">
          Your payment was cancelled. You can try again whenever you're ready.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tenant/rentals"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rentals
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