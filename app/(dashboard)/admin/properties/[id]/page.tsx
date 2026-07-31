'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useAdminProperty, useAdminDeleteProperty } from '@/hooks/useAdmin';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  User,
  Mail,
  Building2,
  AlertCircle,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export default function AdminPropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const propertyId = params.id as string;

  const { data: propertyData, isLoading, refetch } = useAdminProperty(propertyId);
  const deleteProperty = useAdminDeleteProperty();

  const property = propertyData?.data;

  const handleDelete = async () => {
    if (!property) return;

    const result = await Swal.fire({
      title: 'Delete this property?',
      text: `Are you sure you want to DELETE "${property.title}"? This cannot be undone.`,
      icon: 'warning',
      background: '#1f2937',
      color: '#f3f4f6',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProperty.mutateAsync(propertyId);
      toast.success('Property deleted successfully');
      router.push('/admin/properties');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete property');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      AVAILABLE: { color: 'bg-green-100 text-green-700', label: 'Available' },
      BOOKED: { color: 'bg-yellow-100 text-yellow-700', label: 'Booked' },
      INACTIVE: { color: 'bg-gray-100 text-gray-700', label: 'Inactive' },
    };
    return badges[status] || badges.AVAILABLE;
  };

  const getRequestStatus = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      PENDING: { color: 'text-yellow-600', label: 'Pending' },
      APPROVED: { color: 'text-green-600', label: 'Approved' },
      REJECTED: { color: 'text-red-600', label: 'Rejected' },
      ACTIVE: { color: 'text-blue-600', label: 'Active' },
      COMPLETED: { color: 'text-purple-600', label: 'Completed' },
      CANCELLED: { color: 'text-gray-600', label: 'Cancelled' },
    };
    return configs[status] || { color: 'text-gray-600', label: status };
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Property Not Found</h2>
          <Link href="/admin/properties" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(property.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/properties"
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                {property.title}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              </h1>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {property.address}, {property.city}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="px-4 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteProperty.isPending}
              className="px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {deleteProperty.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Property
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
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Building2 className="w-20 h-20 text-gray-300" />
                  </div>
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {property.images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-bold text-2xl text-blue-600">${property.price}<span className="text-sm text-gray-400 font-normal">/month</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{property.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    Bedrooms
                  </p>
                  <p className="font-medium text-gray-900">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    Bathrooms
                  </p>
                  <p className="font-medium text-gray-900">{property.bathrooms}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700 mt-1">{property.description || 'No description'}</p>
                </div>
                {property.amenities.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Amenities</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {property.amenities.map((amenity, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rental Requests */}
            {property.rentalRequests && property.rentalRequests.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Rental Requests</h3>
                <div className="space-y-3">
                  {property.rentalRequests.map((request) => {
                    const status = getRequestStatus(request.status);
                    return (
                      <div key={request.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-medium text-gray-900">{request.tenant?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{request.tenant?.email || 'N/A'}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-sm font-medium ${status.color}`}>
                              {status.label}
                            </span>
                            <span className="text-sm text-gray-400">
                              {new Date(request.moveInDate).toLocaleDateString()}
                            </span>
                            {request.payment && (
                              <span className="text-sm font-bold text-green-600">
                                ${request.payment.amount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Landlord Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Landlord
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{property.landlord?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {property.landlord?.email || 'N/A'}
                </p>
                {property.landlord?.phone && (
                  <p className="text-sm text-gray-500">{property.landlord.phone}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Reviews</span>
                  <span className="font-bold">{property._count?.reviews || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Rental Requests</span>
                  <span className="font-bold">{property._count?.rentalRequests || 0}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Created</span>
                  <span className="text-sm">{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700 text-sm">Admin Action</p>
                  <p className="text-red-600 text-xs">Delete will remove all related data (reviews, requests, payments)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}