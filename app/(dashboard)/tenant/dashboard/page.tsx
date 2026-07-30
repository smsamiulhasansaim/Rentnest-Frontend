// app/tenant/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { propertyApi } from '@/lib/api/properties';
import { rentalApi } from '@/lib/api/rentals';
import { paymentApi } from '@/lib/api/payments';
import { Property } from '@/types/property';
import { RentalRequest } from '@/types/rental';
import { Payment } from '@/types/payment';
import PropertyCard from '@/components/tenant/PropertyCard';
import { Home, Search, Calendar, CreditCard, Star, ArrowRight, Loader2 } from 'lucide-react';

export default function TenantDashboard() {
  const { user } = useAuth();
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [recentRentals, setRecentRentals] = useState<RentalRequest[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRentals: 0,
    pendingRequests: 0,
    activeRentals: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [propertiesRes, rentalsRes, paymentsRes] = await Promise.all([
        propertyApi.getAll({ limit: 4 }),
        rentalApi.getMyRequests(),
        paymentApi.getMyPayments(),
      ]);

      setRecentProperties(propertiesRes.data || []);
      setRecentRentals(rentalsRes.data || []);
      setRecentPayments(paymentsRes.data || []);

      const rentals = rentalsRes.data || [];
      const payments = paymentsRes.data || [];
      
      setStats({
        totalRentals: rentals.length,
        pendingRequests: rentals.filter((r) => r.status === 'PENDING').length,
        activeRentals: rentals.filter((r) => r.status === 'ACTIVE').length,
        totalPayments: payments.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      ACTIVE: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statsCards = [
    {
      title: 'Total Rentals',
      value: stats.totalRentals,
      icon: Home,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: Calendar,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Active Rentals',
      value: stats.activeRentals,
      icon: Home,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Total Payments',
      value: stats.totalPayments,
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Tenant'}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Find your perfect home or manage your rentals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/tenant/properties"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-5 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <Search className="w-8 h-8 mb-2" />
              <h3 className="font-semibold text-lg">Find Properties</h3>
              <p className="text-blue-100 text-sm">Browse available rentals</p>
            </div>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/tenant/rentals"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-5 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <Calendar className="w-8 h-8 mb-2" />
              <h3 className="font-semibold text-lg">My Rentals</h3>
              <p className="text-purple-100 text-sm">View rental requests</p>
            </div>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/tenant/payments"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-5 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <CreditCard className="w-8 h-8 mb-2" />
              <h3 className="font-semibold text-lg">Payments</h3>
              <p className="text-green-100 text-sm">Payment history</p>
            </div>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">🏠 Recently Added Properties</h2>
          <Link href="/tenant/properties" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No properties available right now</p>
            <p className="text-gray-400 text-sm">Check back later for new listings</p>
          </div>
        )}
      </div>

      {/* Recent Rentals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">📋 Recent Rental Requests</h2>
          <Link href="/tenant/rentals" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentRentals.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {recentRentals.slice(0, 5).map((rental) => (
              <Link
                key={rental.id}
                href={`/tenant/rentals/${rental.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {rental.property?.title || 'Property'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {rental.property?.city || 'N/A'} • ${rental.property?.price || 0}/mo
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                    {rental.status}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(rental.createdAt).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No rental requests yet</p>
            <p className="text-gray-400 text-sm">Browse properties and submit a request</p>
          </div>
        )}
      </div>
    </div>
  );
}