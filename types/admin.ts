export interface AdminStats {
  users: {
    total: number;
    tenants: number;
    landlords: number;
  };
  properties: {
    total: number;
    available: number;
    booked: number;
  };
  rentals: {
    total: number;
    pending: number;
    active: number;
    completed: number;
  };
  revenue: number;
  recentActivities: {
    id: string;
    status: string;
    createdAt: string;
    tenant: { id: string; name: string; email: string };
    property: { id: string; title: string; city: string; price: number };
    payment: { id: string; amount: number; status: string; paidAt: string } | null;
  }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'TENANT' | 'LANDLORD';
  status: 'ACTIVE' | 'BANNED';
  createdAt: string;
}

export interface AdminProperty {
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
  status: 'AVAILABLE' | 'BOOKED' | 'INACTIVE';
  createdAt: string;
  landlord: { id: string; name: string; email: string };
  category: { id: string; name: string };
  _count: { reviews: number; rentalRequests: number };
}

export interface AdminPropertyDetail {
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
  status: 'AVAILABLE' | 'BOOKED' | 'INACTIVE';
  createdAt: string;
  landlord: { id: string; name: string; email: string; phone?: string };
  category: { id: string; name: string };
  _count: { reviews: number; rentalRequests: number };
  reviews: { id: string; rating: number; comment: string; tenant: { name: string } }[];
  rentalRequests: {
    id: string;
    status: string;
    moveInDate: string;
    tenant: { name: string; email: string };
    payment: { amount: number; status: string } | null;
  }[];
}

export interface AdminRental {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  moveInDate: string;
  message: string | null;
  createdAt: string;
  tenant: { id: string; name: string; email: string };
  property: { id: string; title: string; city: string; price: number };
  payment: {
    id: string;
    amount: number;
    status: string;
    paidAt: string | null;
    provider: string;
  } | null;
}
export interface AdminRentalDetail {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  moveInDate: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  propertyId: string;
  tenant: {
    id: string;
    name: string;
    email: string;
  };
  property: {
    id: string;
    title: string;
    city: string;
    price: number;
  };
  payment: {
    id: string;
    transactionId: string;
    amount: number;
    status: string;
    provider: string;
    paidAt: string | null;
  } | null;
}
export interface CategoryWithCount {
  id: string;
  name: string;
  createdAt: string;
  _count: { properties: number };
}