'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Eye,
  Sparkles,
  User,
  LayoutDashboard,
  TrendingUp,
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
      const requestsRes = await rentalApi.getMyRequests();
      setRentalRequests(requestsRes.data || []);

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
        icon: Sparkles,
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name?.split(' ')[0] || 'Tenant'}!
                  </h1>
                  <p className="text-gray-500 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </span>
                    <span className="mx-2">•</span>
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      {stats.total} total requests
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/tenant/properties"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Properties
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 font-medium">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 font-medium">Active</p>
            <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
          </div>
        </div>

        {/* Recent Rental Requests */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                <Inbox className="w-5 h-5 text-blue-600" />
              </div>
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
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              {rentalRequests.slice(0, 5).map((request, index) => {
                const config = getStatusConfig(request.status);
                const Icon = config.icon;
                return (
                  <Link
                    key={request.id}
                    href={`/tenant/rentals/${request.id}`}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      index !== rentalRequests.slice(0, 5).length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-gray-900 truncate">
                          {request.property?.title || 'Property'}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} flex items-center gap-1`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{request.property?.city || 'N/A'}</span>
                        <span className="hidden sm:inline">•</span>
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span>${request.property?.price || 0}/mo</span>
                        <span className="hidden sm:inline">•</span>
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">{new Date(request.moveInDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">No rental requests yet</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Start your journey by browsing available properties and submitting a rental request.
              </p>
              <Link
                href="/tenant/properties"
                className="inline-block mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
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
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
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
                  className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all p-5 overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {property.city}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Available
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">${property.price}</span>
                    <span className="text-xs text-gray-400">/month</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.bedrooms}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms}
                    </span>
                    {property.category && (
                      <>
                        <span>•</span>
                        <span>{property.category.name}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-blue-600 font-medium group-hover:underline flex items-center gap-1">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">No properties available</h3>
              <p className="text-gray-500 mt-2">Check back later for new listings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}