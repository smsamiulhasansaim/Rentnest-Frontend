// app/tenant/rentals/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { rentalApi } from '@/lib/api/rentals';
import { RentalRequest } from '@/types/rental';
import { Loader2, Calendar, Home, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

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
      ACTIVE: Home,
      COMPLETED: CheckCircle,
    };
    return icons[status] || AlertCircle;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      ACTIVE: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pending Review',
      APPROVED: 'Approved - Pay Now',
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📋 My Rental Requests</h1>
        <p className="text-gray-500 mt-1">
          {rentals.length} total requests • {statusCounts['PENDING'] || 0} pending
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({rentals.length})
        </button>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                className="block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
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
                      <span>{rental.property?.city || 'N/A'}</span>
                      <span>•</span>
                      <span>${rental.property?.price || 0}/mo</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Move-in: {new Date(rental.moveInDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {rental.status === 'PENDING' && (
                      <span className="text-yellow-600 text-sm font-medium animate-pulse">
                        Awaiting response
                      </span>
                    )}
                    {rental.status === 'APPROVED' && !rental.payment && (
                      <Link
                        href={`/tenant/payments/create/${rental.id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Pay Now
                      </Link>
                    )}
                    <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-16 text-center border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No rental requests</h3>
          <p className="text-gray-500 mt-2">
            {filter === 'ALL'
              ? 'You haven\'t submitted any rental requests yet'
              : `No ${filter.toLowerCase()} requests found`}
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
  );
}