// app/landlord/properties/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { propertyApi } from '@/lib/api/properties';
import { rentalApi } from '@/lib/api/rentals';
import { Property } from '@/types/property';
import { RentalRequest } from '@/types/rental';
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
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Eye,
  Plus,
  Building2,
} from 'lucide-react';

export default function LandlordPropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [propertyId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propertyRes, requestsRes] = await Promise.all([
        propertyApi.getById(propertyId),
        rentalApi.getLandlordRequests(),
      ]);

      setProperty(propertyRes.data);
      const allRequests = requestsRes.data || [];
      setRequests(allRequests.filter((r) => r.propertyId === propertyId));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load property');
      router.push('/landlord/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    setDeleting(true);
    try {
      await propertyApi.delete(propertyId);
      toast.success('Property deleted successfully');
      router.push('/landlord/properties');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string }> = {
      PENDING: { icon: Clock, color: 'text-yellow-600', label: 'Pending' },
      APPROVED: { icon: CheckCircle, color: 'text-green-600', label: 'Approved' },
      REJECTED: { icon: XCircle, color: 'text-red-600', label: 'Rejected' },
      ACTIVE: { icon: Home, color: 'text-blue-600', label: 'Active' },
      COMPLETED: { icon: CheckCircle, color: 'text-purple-600', label: 'Completed' },
    };
    return configs[status] || { icon: Clock, color: 'text-gray-600', label: status };
  };

  const getPropertyStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      AVAILABLE: { color: 'bg-green-100 text-green-800', label: 'Available' },
      BOOKED: { color: 'bg-yellow-100 text-yellow-800', label: 'Booked' },
      RENTED: { color: 'bg-blue-100 text-blue-800', label: 'Rented' },
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-800', label: status };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Property Not Found</h2>
          <Link href="/landlord/properties" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const propertyStatus = getPropertyStatusBadge(property.status);
  const averageRating = property.reviews?.length
    ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Properties
        </button>
        <div className="flex gap-2">
          <Link
            href={`/landlord/properties/${propertyId}/edit`}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Property
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
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-80 mb-4">
            <Image
              src={property.images?.[selectedImage] || '/images/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${propertyStatus.color}`}>
                {propertyStatus.label}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === index
                      ? 'border-blue-600 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Property Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <MapPin className="w-5 h-5" />
              <span>{property.address}, {property.city}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Bed className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{property.bedrooms}</span> Beds
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Bath className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{property.bathrooms}</span> Baths
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-blue-600">${property.price}</span>/month
              </div>
              {property.category && (
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">{property.category.name}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{property.description || 'No description provided.'}</p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-4">
                <h2 className="font-semibold text-gray-900 mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.reviews && property.reviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-2">
                  Reviews ({property.reviews.length})
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-xl ${
                        star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}>★</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {property.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{review.tenant?.name || 'Anonymous'}</span>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>{star <= review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-gray-600 text-sm mt-1">{review.comment}</p>}
                    </div>
                  ))}
                  {property.reviews.length > 3 && (
                    <Link href={`/tenant/properties/${propertyId}`} className="text-blue-600 text-sm hover:underline">
                      View all {property.reviews.length} reviews →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Requests */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Property Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold ${propertyStatus.color}`}>{propertyStatus.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Total Requests</span>
                <span className="font-bold text-gray-900">{requests.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pending Requests</span>
                <span className="font-bold text-yellow-600">
                  {requests.filter((r) => r.status === 'PENDING').length}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Active Rentals</span>
                <span className="font-bold text-blue-600">
                  {requests.filter((r) => r.status === 'ACTIVE').length}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Completed</span>
                <span className="font-bold text-purple-600">
                  {requests.filter((r) => r.status === 'COMPLETED').length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Recent Requests
              </h2>
              <Link
                href="/landlord/requests"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests.slice(0, 3).map((request) => {
                  const config = getStatusConfig(request.status);
                  const Icon = config.icon;
                  return (
                    <div key={request.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {request.tenant?.name || 'Tenant'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.moveInDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs font-medium ${config.color} flex items-center gap-1`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {requests.length > 3 && (
                  <Link
                    href="/landlord/requests"
                    className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all {requests.length} requests →
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

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Need to add a property?</h3>
            <p className="text-blue-100 text-sm mb-4">List a new property and start earning rent</p>
            <Link
              href="/landlord/properties/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              List New Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}