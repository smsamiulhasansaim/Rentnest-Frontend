// app/tenant/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import rentalApi from '@/lib/api/rentals';
import propertyApi from '@/lib/api/properties';
import { RentalRequest } from '@/types/rental';
import { Property } from '@/types/property';
import {
  Home,
  Search,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Building2,
  MapPin,
  Bed,
  Bath,
  Inbox,
  Heart,
  Eye,
} from 'lucide-react';

export default function TenantDashboard() {
  const { user } = useAuth();
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get tenant's rental requests
      const requestsRes = await rentalApi.getMyRequests();
      setRentalRequests(requestsRes.data || []);

      // Get available properties
      const propertiesRes = await propertyApi.getAll({ page: 1, limit: 6 });
      setProperties(propertiesRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; bg: string }> = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pending',
        bg: 'bg-yellow-50',
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'text-green-600',
        label: 'Approved',
        bg: 'bg-green-50',
      },
      REJECTED: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Rejected',
        bg: 'bg-red-50',
      },
      ACTIVE: {
        icon: Home,
        color: 'text-blue-600',
        label: 'Active',
        bg: 'bg-blue-50',
      },
      COMPLETED: {
        icon: CheckCircle,
        color: 'text-purple-600',
        label: 'Completed',
        bg: 'bg-purple-50',
      },
    };
    return configs[status] || {
      icon: Clock,
      color: 'text-gray-600',
      label: status,
      bg: 'bg-gray-50',
    };
  };

  const stats = {
    total: rentalRequests.length,
    pending: rentalRequests.filter((r) => r.status === 'PENDING').length,
    approved: rentalRequests.filter((r) => r.status === 'APPROVED').length,
    active: rentalRequests.filter((r) => r.status === 'ACTIVE').length,
    completed: rentalRequests.filter((r) => r.status === 'COMPLETED').length,
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0] || 'Tenant'}! 🏠
            </h1>
            <p className="text-gray-500 mt-1">
              Find your perfect rental home
            </p>
          </div>
          <Link
            href="/tenant/properties"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Search className="w-5 h-5" />
            Browse Properties
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Active</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Completed</p>
          <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
        </div>
      </div>

      {/* Recent Rental Requests */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-600" />
            Your Rental Requests
          </h2>
          <Link
            href="/tenant/rentals"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {rentalRequests.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {rentalRequests.slice(0, 5).map((request) => {
              const config = getStatusConfig(request.status);
              const Icon = config.icon;
              return (
                <Link
                  key={request.id}
                  href={`/tenant/rentals/${request.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 truncate">
                        {request.property?.title || 'Property'}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} flex items-center gap-1`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{request.property?.city || 'N/A'}</span>
                      <span>•</span>
                      <DollarSign className="w-4 h-4" />
                      <span>${request.property?.price || 0}/mo</span>
                      <span>•</span>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(request.moveInDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No rental requests yet</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Start your journey by browsing available properties and submitting a rental request.
            </p>
            <Link
              href="/tenant/properties"
              className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>

      {/* Available Properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Available Properties
          </h2>
          <Link
            href="/tenant/properties"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/tenant/properties/${property.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {property.city}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Available
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">${property.price}</span>
                  <span className="text-xs text-gray-400">/month</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {property.bedrooms}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {property.bathrooms}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/tenant/properties/${property.id}`;
                  }}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No properties available</h3>
            <p className="text-gray-500 mt-2">Check back later for new listings</p>
          </div>
        )}
      </div>
    </div>
  );
}