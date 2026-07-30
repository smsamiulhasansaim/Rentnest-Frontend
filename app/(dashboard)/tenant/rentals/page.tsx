'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { rentalApi } from '@/lib/api/rentals';
import { RentalRequest } from '@/types/rental';
import {
  Loader2,
  Calendar,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Inbox,
  Sparkles,
} from 'lucide-react';

export default function MyRentalsPage() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const response = await rentalApi.getMyRequests();
      setRentals(response.data || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      REJECTED: XCircle,
      ACTIVE: Sparkles,
      COMPLETED: CheckCircle,
    };
    return icons[status] || AlertCircle;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      APPROVED: 'bg-green-50 text-green-700 border-green-200',
      REJECTED: 'bg-red-50 text-red-700 border-red-200',
      ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
      COMPLETED: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pending Review',
      APPROVED: 'Approved',
      REJECTED: 'Rejected',
      ACTIVE: 'Active Rental',
      COMPLETED: 'Completed',
    };
    return labels[status] || status;
  };

  const filteredRentals = filter === 'ALL'
    ? rentals
    : rentals.filter((r) => r.status === filter);

  const statusCounts = rentals.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading your rentals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Inbox className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Rental Requests</h1>
                  <p className="text-gray-500 text-sm">
                    {rentals.length} total requests • {statusCounts['PENDING'] || 0} pending
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/tenant/properties"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 text-sm flex items-center gap-2"
            >
              Browse Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'ALL'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All ({rentals.length})
          </button>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {getStatusLabel(status)} ({count})
            </button>
          ))}
        </div>

        {/* Rentals List */}
        {filteredRentals.length > 0 ? (
          <div className="space-y-4">
            {filteredRentals.map((rental) => {
              const StatusIcon = getStatusIcon(rental.status);
              return (
                <Link
                  key={rental.id}
                  href={`/tenant/rentals/${rental.id}`}
                  className="block bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all p-6 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {rental.property?.title || 'Property'}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            rental.status
                          )}`}
                        >
                          <span className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {getStatusLabel(rental.status)}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400">📍</span>
                          {rental.property?.city || 'N/A'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="font-medium text-gray-700">${rental.property?.price || 0}/mo</span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          Move-in: {new Date(rental.moveInDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {rental.status === 'PENDING' && (
                        <span className="text-yellow-600 text-sm font-medium animate-pulse flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Awaiting response
                        </span>
                      )}
                      {rental.status === 'APPROVED' && !rental.payment && (
                        <Link
                          href={`/tenant/payments/create/${rental.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Pay Now
                        </Link>
                      )}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No rental requests</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              {filter === 'ALL'
                ? "You haven't submitted any rental requests yet"
                : `No ${filter.toLowerCase()} requests found`}
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
    </div>
  );
}