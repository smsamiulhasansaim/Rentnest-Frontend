'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Home, RefreshCw, AlertTriangle, ArrowLeft, LayoutDashboard } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
    // In production, you could send to error tracking service
  }, [error]);

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
        return 'Go to Dashboard';
      case 'LANDLORD':
        return 'Go to Dashboard';
      case 'ADMIN':
        return 'Go to Admin Panel';
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
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-500 mb-2 text-sm">
          We&apos;re sorry for the inconvenience. Please try again or return home.
        </p>

        {/* Error Message */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-gray-400 font-mono break-all">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 font-mono mt-1">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className={`bg-gradient-to-r ${getRoleColor()} text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2`}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href={getDashboardLink()}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            {isAuthenticated ? (
              <>
                <LayoutDashboard className="w-4 h-4" />
                {getDashboardLabel()}
              </>
            ) : (
              <>
                <Home className="w-4 h-4" />
                Go Home
              </>
            )}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-400 mt-6">
          If this issue persists, please contact support.
        </p>
      </div>
    </div>
  );
}