'use client';

import { useState } from 'react';
import { useCreatePayment } from '@/hooks/usePayments';
import { useToast } from '@/providers/ToastProvider';
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentCheckoutProps {
  rentalRequestId: string;
  amount: number;
  propertyTitle: string;
}

export const PaymentCheckout = ({
  rentalRequestId,
  amount,
  propertyTitle,
}: PaymentCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { mutate } = useCreatePayment();

  const handlePayment = () => {
    setIsLoading(true);
    mutate(
      { rentalRequestId },
      {
        onSuccess: (response) => {
          const checkoutUrl = response.data.data.checkoutUrl;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            toast.error('No checkout URL received');
          }
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Payment creation failed');
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold">Complete Payment</h3>
        <p className="text-gray-500 text-sm mt-1">
          Secure payment via Stripe
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Property:</span>
          <span className="font-semibold">{propertyTitle}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Amount:</span>
          <span className="text-2xl font-bold text-blue-600">${amount}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Pay Now
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center mt-4">
        🔒 Secure payment powered by Stripe
      </p>
    </div>
  );
};

export default PaymentCheckout;