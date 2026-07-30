// app/landlord/requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { rentalApi } from '@/lib/api/rentals';
import { RentalRequest } from '@/types/rental';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Home,
  User,
  Calendar,
  DollarSign,
  MapPin,
  ArrowRight,
  Eye,
  Filter,
  RefreshCw,
} from 'lucide-react';

export default function LandlordRequestsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await rentalApi.getLandlordRequests();
      setRequests(response.data || []);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load rental requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessing(requestId);
    try {
      await rentalApi.respondToRequest(requestId, status);
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to respond to request');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; bg: string }> = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pending',
        bg: 'bg-yellow-50 border-yellow-200',
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'text-green-600',
        label: 'Approved',
        bg: 'bg-green-50 border-green-200',
      },
      REJECTED: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Rejected',
        bg: 'bg-red-50 border-red-200',
      },
      ACTIVE: {
        icon: Home,
        color: 'text-blue-600',
        label: 'Active',
        bg: 'bg-blue-50 border-blue-200',
      },
      COMPLETED: {
        icon: CheckCircle,
        color: 'text-purple-600',
        label: 'Completed',
        bg: 'bg-purple-50 border-purple-200',
      },
    };
    return configs[status] || {
      icon: Clock,
      color: 'text-gray-600',
      label: status,
      bg: 'bg-gray-50 border-gray-200',
    };
  };

  const filteredRequests = filter === 'ALL'
    ? requests
    : requests.filter((r) => r.status === filter);

  const statusCounts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pendingCount = statusCounts['PENDING'] || 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📩 Rental Requests</h1>
          <p className="text-gray-500 mt-1">
            {requests.length} total requests • {pendingCount} pending
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
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
          All ({requests.length})
        </button>
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = getStatusConfig(status);
          const Icon = config.icon;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-1 ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const config = getStatusConfig(request.status);
            const StatusIcon = config.icon;

            return (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left - Property & Tenant Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {request.property?.title || 'Property'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.property?.city || 'N/A'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${request.property?.price || 0}/mo</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(request.moveInDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{request.tenant?.name || 'Tenant'}</span>
                      </div>
                      {request.tenant?.email && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500">{request.tenant.email}</span>
                        </>
                      )}
                      {request.message && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-400 italic">"{request.message}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    {request.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleRespond(request.id, 'APPROVED')}
                          disabled={processing === request.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {processing === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleRespond(request.id, 'REJECTED')}
                          disabled={processing === request.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {processing === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Reject
                        </button>
                      </>
                    )}

                    {request.status === 'ACTIVE' && (
                      <button
                        onClick={async () => {
                          try {
                            await rentalApi.completeRental(request.id);
                            toast.success('Rental marked as completed');
                            fetchRequests();
                          } catch (error: any) {
                            toast.error(error?.response?.data?.message || 'Failed to complete rental');
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}

                    <Link
                      href={`/tenant/rentals/${request.id}`}
                      target="_blank"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Payment Status */}
                {request.payment && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Payment:</span>
                    <span className={`font-medium ${
                      request.payment.status === 'COMPLETED' ? 'text-green-600' :
                      request.payment.status === 'PENDING' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {request.payment.status}
                    </span>
                    {request.payment.amount && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-600">${request.payment.amount}</span>
                      </>
                    )}
                    {request.payment.paidAt && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400">
                          {new Date(request.payment.paidAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-16 text-center border border-gray-200">
          {filter !== 'ALL' ? (
            <>
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                No {filter.toLowerCase()} requests
              </h3>
              <p className="text-gray-500 mt-2">
                No requests with status "{filter}" found
              </p>
              <button
                onClick={() => setFilter('ALL')}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Show All
              </button>
            </>
          ) : (
            <>
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No rental requests yet</h3>
              <p className="text-gray-500 mt-2">
                When tenants request to rent your properties, they'll appear here
              </p>
              <Link
                href="/landlord/properties"
                className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                View Your Properties
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}