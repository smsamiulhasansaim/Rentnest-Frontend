export type RentalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';

export interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  moveInDate: string;
  message?: string;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    city: string;
    price: number;
    images: string[];
  };
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
  payment?: Payment;
}

export interface CreateRentalRequestData {
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export interface UpdateRentalStatusData {
  status: 'APPROVED' | 'REJECTED';
}