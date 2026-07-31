'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { landlordApi } from '@/lib/api/landlord';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  ArrowLeft,
  Edit,
  Trash2,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  User,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Star,
  Building2,
  AlertCircle,
  Plus
} from 'lucide-react';

interface PropertyDetail {
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
  category: { id: string; name: string };
  reviews: { id: string; rating: number; comment: string; tenant: { id: string; name: string } }[];
  rentalRequests: {
    id: string;
    status: string;
    moveInDate: string;
    message: string;
    tenant: { id: string; name: string; email: string; phone: string };
    payment: { id: string; amount: number; status: string; paidAt: string };
  }[];
  createdAt: string;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await landlordApi.getPropertyById(propertyId);
      setProperty(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to load property';
      toast.error(message);
      router.push('/landlord/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    setDeleting(true);
    try {
      await landlordApi.deleteProperty(propertyId);
      toast.success('Property deleted successfully');
      router.push('/landlord/properties');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to delete property';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      AVAILABLE: { color: 'bg-green-100 text-green-700', label: 'Available' },
      BOOKED: { color: 'bg-yellow-100 text-yellow-700', label: 'Booked' },
      INACTIVE: { color: 'bg-gray-100 text-gray-700', label: 'Inactive' }
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-700', label: status };
  };

  const getRequestStatus = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: any }> = {
      PENDING: { color: 'text-yellow-600', label: 'Pending', icon: Clock },
      APPROVED: { color: 'text-green-600', label: 'Approved', icon: CheckCircle },
      REJECTED: { color: 'text-red-600', label: 'Rejected', icon: XCircle },
      ACTIVE: { color: 'text-blue-600', label: 'Active', icon: Home },
      COMPLETED: { color: 'text-purple-600', label: 'Completed', icon: CheckCircle }
    };
    return badges[status] || { color: 'text-gray-600', label: status, icon: AlertCircle };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-4">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Property Not Found</h2>
          <Link href="/landlord/properties" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(property.status);
  const averageRating = property.reviews.length
    ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
    : 0;

  const pendingRequests = property.rentalRequests.filter(r => r.status === 'PENDING');
  const activeRentals = property.rentalRequests.filter(r => r.status === 'ACTIVE');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex gap-2">
            <Link
              href={`/landlord/properties/${propertyId}/edit`}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="relative h-80 bg-gray-100">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[selectedImage] || property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Building2 className="w-20 h-20 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {property.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-600'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin className="w-5 h-5" />
                <span>{property.address}, {property.city}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="text-2xl font-bold text-blue-600">${property.price}</span>
                <span className="text-gray-400">/month</span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Bed className="w-4 h-4" />
                  {property.bedrooms} beds
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Bath className="w-4 h-4" />
                  {property.bathrooms} baths
                </div>
                {property.category && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    {property.category.name}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {property.description || 'No description provided.'}
                </p>
              </div>

              {property.amenities.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {property.reviews.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Reviews ({property.reviews.length})</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(averageRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {property.reviews.slice(0, 3).map(review => (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">
                            {review.tenant?.name || 'Anonymous'}
                          </span>
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                        )}
                      </div>
                    ))}
                    {property.reviews.length > 3 && (
                      <Link
                        href={`/tenant/properties/${propertyId}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View all {property.reviews.length} reviews
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Property Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-semibold ${statusBadge.color}`}>{statusBadge.label}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Total Requests</span>
                  <span className="font-bold text-gray-900">{property.rentalRequests.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Pending</span>
                  <span className="font-bold text-yellow-600">{pendingRequests.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Active Rentals</span>
                  <span className="font-bold text-blue-600">{activeRentals.length}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Reviews</span>
                  <span className="font-bold text-purple-600">{property.reviews.length}</span>
                </div>
              </div>
            </div>

            {/* Rental Requests */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Requests
                </h3>
                <Link
                  href="/landlord/requests"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {property.rentalRequests.length > 0 ? (
                <div className="space-y-3">
                  {property.rentalRequests.slice(0, 3).map(request => {
                    const status = getRequestStatus(request.status);
                    const Icon = status.icon;
                    return (
                      <div key={request.id} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {request.tenant?.name || 'Tenant'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(request.moveInDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-xs font-medium ${status.color} flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {property.rentalRequests.length > 3 && (
                    <Link
                      href="/landlord/requests"
                      className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all {property.rentalRequests.length} requests
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No requests yet</p>
                </div>
              )}
            </div>

            {/* Quick Action */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h4 className="font-bold text-lg">Need another property?</h4>
              <p className="text-blue-100 text-sm mt-1 mb-4">List a new property and start earning rent</p>
              <Link
                href="/landlord/properties/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                List New Property
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}