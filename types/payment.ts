export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type PaymentProvider = 'STRIPE' | 'SSLCOMMERZ';

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  rentalRequestId: string;
  tenantId: string;
  paidAt?: string;
  createdAt: string;
  rentalRequest?: {
    id: string;
    property: {
      id: string;
      title: string;
    };
  };
}

export interface CreatePaymentData {
  rentalRequestId: string;
}

export interface PaymentSession {
  checkoutUrl: string;
  payment: Payment;
}

export interface ConfirmPaymentData {
  sessionId: string;
}