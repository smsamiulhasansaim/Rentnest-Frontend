export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  tenantId: string;
  propertyId: string;
  createdAt: string;
  tenant?: {
    id: string;
    name: string;
  };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: 'AVAILABLE' | 'BOOKED' | 'RENTED';
  categoryId: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  reviews?: Review[];
}

export interface PropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  categoryId: string;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  status?: Property['status'];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorDetails: string | null;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  errorDetails: string | null;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}