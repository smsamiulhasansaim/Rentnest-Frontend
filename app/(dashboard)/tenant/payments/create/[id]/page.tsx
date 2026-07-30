// app/tenant/payments/create/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { paymentApi } from '@/lib/api/payments';
import { rentalApi } from '@/lib/api/rentals';
import { useToast } from '@/providers/ToastProvider';
import { Loader2, ArrowLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';

export default function PaymentCreatePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const rentalId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rentalDetails, setRentalDetails] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchRentalDetails();
  }, [rentalId, isAuthenticated]);

  const fetchRentalDetails = async () => {
    setLoading(true);
    try {
      const response = await rentalApi.getById(rentalId);
      setRentalDetails(response.data);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load rental details');
      router.push('/tenant/rentals');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await paymentApi.create({
        rentalRequestId: rentalId,
      });
      
      if (response.data?.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error('Payment session creation failed. Please try again.');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Payment initiation failed';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!rentalDetails) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Rental Not Found</h2>
          <Link href="/tenant/rentals" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Rentals
          </Link>
        </div>
      </div>
    );
  }

  const property = rentalDetails.property;
  const amount = property?.price || 0;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
            <p className="text-gray-500 mt-1">Secure payment via Stripe</p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Property</span>
                <span className="text-gray-900 font-medium">{property?.title || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-900">{property?.city || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Move-in Date</span>
                <span className="text-gray-900">
                  {new Date(rentalDetails.moveInDate).toLocaleDateString()}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-700">Total Amount</span>
                  <span className="text-2xl text-blue-600">${amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Protected</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={processing || amount <= 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ${amount} with Stripe
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            You will be redirected to Stripe for secure payment
          </p>
        </div>
      </div>
    </div>
  );
}