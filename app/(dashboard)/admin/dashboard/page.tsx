'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAdminStats } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  User,
  LayoutDashboard,
  TrendingUp,
  Tag,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: statsData, isLoading, error } = useAdminStats();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [isAuthenticated, user, router, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  const stats = statsData?.data;

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users.total || 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      sub: `${stats?.users.tenants || 0} Tenants • ${stats?.users.landlords || 0} Landlords`,
    },
    {
      title: 'Properties',
      value: stats?.properties.total || 0,
      icon: Building2,
      color: 'bg-green-50 text-green-600',
      sub: `${stats?.properties.available || 0} Available • ${stats?.properties.booked || 0} Booked`,
    },
    {
      title: 'Rental Requests',
      value: stats?.rentals.total || 0,
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600',
      sub: `${stats?.rentals.pending || 0} Pending • ${stats?.rentals.active || 0} Active`,
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.revenue || 0}`,
      icon: DollarSign,
      color: 'bg-yellow-50 text-yellow-600',
      sub: 'From completed payments',
    },
  ];

  // Recent Transactions from recentActivities
  const recentTransactions = stats?.recentActivities?.filter(
    (activity) => activity.payment
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome, {user?.name?.split(' ')[0] || 'Admin'}!
                  </h1>
                  <p className="text-gray-500 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Platform Overview
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/users"
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:border-blue-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Users</p>
                <p className="text-sm text-gray-500">Manage all users</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/properties"
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:border-green-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Properties</p>
                <p className="text-sm text-gray-500">View all properties</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/rentals"
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:border-purple-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Rentals</p>
                <p className="text-sm text-gray-500">All rental requests</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:border-yellow-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition-colors">
                <Tag className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Categories</p>
                <p className="text-sm text-gray-500">Manage categories</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activities - Full Width Stack */}
        <div className="space-y-6">
          {/* Recent Activities */}
          {stats?.recentActivities && stats.recentActivities.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recent Activities
                </h2>
                <Link
                  href="/admin/rentals"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {stats.recentActivities.slice(0, 5).map((activity) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'text-yellow-600 bg-yellow-50',
                    APPROVED: 'text-green-600 bg-green-50',
                    REJECTED: 'text-red-600 bg-red-50',
                    ACTIVE: 'text-blue-600 bg-blue-50',
                    COMPLETED: 'text-purple-600 bg-purple-50',
                    CANCELLED: 'text-gray-600 bg-gray-50',
                  };
                  return (
                    <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {activity.tenant?.name || 'Tenant'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.property?.title || 'Property'} • {activity.property?.city || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[activity.status] || 'bg-gray-50 text-gray-600'}`}>
                            {activity.status}
                          </span>
                          <span className="text-sm text-gray-400">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {recentTransactions.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Recent Transactions
                </h2>
                <Link
                  href="/admin/rentals"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentTransactions.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.tenant?.name || 'Tenant'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.property?.title || 'Property'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-green-600">
                          ${activity.payment?.amount || 0}
                        </span>
                        <span className="text-xs text-gray-400">
                          {activity.payment?.paidAt 
                            ? new Date(activity.payment.paidAt).toLocaleDateString()
                            : new Date(activity.createdAt).toLocaleDateString()
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}