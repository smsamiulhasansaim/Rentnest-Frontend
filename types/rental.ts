import { Property } from './property';
import { Payment } from './payment';

export interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  moveInDate: string;
  message?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  property?: Property;
  payment?: Payment;
  tenant?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorDetails: string | null;
  data: T;
}