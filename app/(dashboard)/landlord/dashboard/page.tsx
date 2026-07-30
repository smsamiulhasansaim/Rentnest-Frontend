'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import propertyApi from '@/lib/api/properties';
import rentalApi from '@/lib/api/rentals';
import { Property } from '@/types/property';
import { RentalRequest } from '@/types/rental';
import {
  Home,
  Plus,
  Building2,
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  Loader2,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Inbox,
} from 'lucide-react';

export default function LandlordDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    bookedProperties: 0,
    pendingRequests: 0,
    activeRentals: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch landlord's properties
      const propertiesRes = await propertyApi.getMyProperties();
      const allProperties = propertiesRes.data || [];
      setProperties(allProperties);

      // Fetch rental requests for landlord's properties
      const requestsRes = await rentalApi.getLandlordRequests();
      const allRequests = requestsRes.data || [];
      setRequests(allRequests);

      // Calculate stats
      const available = allProperties.filter((p) => p.status === 'AVAILABLE');
      const booked = allProperties.filter((p) => p.status === 'BOOKED');
      const pending = allRequests.filter((r) => r.status === 'PENDING');
      const active = allRequests.filter((r) => r.status === 'ACTIVE');

      // Calculate earnings from completed payments
      const completedRequests = allRequests.filter(
        (r) => r.status === 'COMPLETED' && r.payment?.status === 'COMPLETED'
      );
      const totalEarnings = completedRequests.reduce(
        (sum, r) => sum + (r.property?.price || 0),
        0
      );

      setStats({
        totalProperties: allProperties.length,
        availableProperties: available.length,
        bookedProperties: booked.length,
        pendingRequests: pending.length,
        activeRentals: active.length,
        totalEarnings,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      // Set empty arrays on error
      setProperties([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      AVAILABLE: { color: 'bg-green-100 text-green-800', label: 'Available' },
      BOOKED: { color: 'bg-yellow-100 text-yellow-800', label: 'Booked' },
      RENTED: { color: 'bg-blue-100 text-blue-800', label: 'Rented' },
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-800', label: status };
  };

  const statsCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Available',
      value: stats.availableProperties,
      icon: Home,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Booked',
      value: stats.bookedProperties,
      icon: Calendar,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Active Rentals',
      value: stats.activeRentals,
      icon: CheckCircle,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

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
              Welcome back, {user?.name?.split(' ')[0] || 'Landlord'}! 🏠
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your properties and rental requests
            </p>
          </div>
          <Link
            href="/landlord/properties/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Plus className="w-5 h-5" />
            List New Property
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Properties */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">📋 Your Properties</h2>
          <Link
            href="/landlord/properties"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.slice(0, 6).map((property) => {
              const badge = getStatusBadge(property.status);
              return (
                <Link
                  key={property.id}
                  href={`/landlord/properties/${property.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-5 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {property.city}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">${property.price}</span>
                    <span className="text-xs text-gray-400">/month</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span>{property.bedrooms} beds</span>
                    <span>•</span>
                    <span>{property.bathrooms} baths</span>
                    {property.reviews && (
                      <>
                        <span>•</span>
                        <span>⭐ {property.reviews.length} reviews</span>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No properties listed yet</p>
            <Link
              href="/landlord/properties/create"
              className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              List your first property →
            </Link>
          </div>
        )}
      </div>

      {/* Recent Rental Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-600" />
            Recent Rental Requests
          </h2>
          <Link
            href="/landlord/requests"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {requests.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {requests.slice(0, 5).map((request) => {
              const statusConfig = {
                PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                APPROVED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                REJECTED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
                ACTIVE: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                COMPLETED: { icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
              };
              const config = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.PENDING;
              const Icon = config.icon;

              return (
                <Link
                  key={request.id}
                  href={`/landlord/requests/${request.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 truncate">
                        {request.property?.title || 'Property'}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} flex items-center gap-1`}>
                        <Icon className="w-3 h-3" />
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {request.tenant?.name || 'Tenant'} • {request.property?.city || 'Unknown'}
                    </p>
                    {request.message && (
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-md">
                        "{request.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No rental requests yet</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              When tenants request to rent your properties, they'll appear here instantly.
            </p>
            {properties.length === 0 ? (
              <Link
                href="/landlord/properties/create"
                className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                List Your First Property
              </Link>
            ) : (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Your properties are ready to receive requests</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}