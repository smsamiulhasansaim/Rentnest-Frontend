export interface Review {
  id: string;
  rating: number;
  comment?: string;
  tenantId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    name: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorDetails: string | null;
  data: T;
}