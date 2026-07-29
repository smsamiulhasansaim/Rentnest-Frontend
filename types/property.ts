export type PropertyStatus = 'AVAILABLE' | 'BOOKED' | 'INACTIVE';

export interface Category {
  id: string;
  name: string;
  createdAt: string;
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
  status: PropertyStatus;
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

export interface Review {
  id: string;
  rating: number;
  comment: string;
  propertyId: string;
  tenantId: string;
  createdAt: string;
  tenant?: {
    id: string;
    name: string;
  };
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
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  images?: string[];
  categoryId: string;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  status?: PropertyStatus;
}