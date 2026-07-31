'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { landlordApi } from '@/lib/api/landlord';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Home,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Eye,
  Filter,
  RefreshCw,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface RentalRequest {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
  moveInDate: string;
  message: string;
  createdAt: string;
  tenant: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  property: {
    id: string;
    title: string;
    city: string;
    price: number;
    images: string[];
    status: string;
  };
  payment: {
    id: string;
    amount: number;
    status: string;
    paidAt: string;
    provider: string;
  } | null;
}

export default function LandlordRequestsPage() {
  const toast = useToast();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await landlordApi.getMyRequests();
      setRequests(response.data || []);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to load requests';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    try {
      await landlordApi.respondToRequest(id, { status });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to respond';
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (id: string) => {
    setProcessingId(id);
    try {
      await landlordApi.completeRental(id);
      toast.success('Rental marked as completed');
      fetchRequests();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to complete rental';
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; bg: string }> = {
      PENDING: { icon: Clock, color: 'text-yellow-600', label: 'Pending', bg: 'bg-yellow-50' },
      APPROVED: { icon: CheckCircle, color: 'text-green-600', label: 'Approved', bg: 'bg-green-50' },
      REJECTED: { icon: XCircle, color: 'text-red-600', label: 'Rejected', bg: 'bg-red-50' },
      ACTIVE: { icon: Sparkles, color: 'text-blue-600', label: 'Active', bg: 'bg-blue-50' },
      COMPLETED: { icon: CheckCircle, color: 'text-purple-600', label: 'Completed', bg: 'bg-purple-50' }
    };
    return configs[status] || { icon: AlertCircle, color: 'text-gray-600', label: status, bg: 'bg-gray-50' };
  };

  const filteredRequests = filter === 'ALL'
    ? requests
    : requests.filter(r => r.status === filter);

  const statusCounts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pendingCount = statusCounts['PENDING'] || 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-4">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
                <Inbox className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rental Requests</h1>
                <p className="text-gray-500 text-sm">
                  {requests.length} total • {pendingCount} pending
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchRequests}
            className="px-4 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
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
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
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
            {filteredRequests.map(request => {
              const config = getStatusConfig(request.status);
              const Icon = config.icon;

              return (
                <div key={request.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left - Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {request.property?.title || 'Property'}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} flex items-center gap-1`}>
                          <Icon className="w-3 h-3" />
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

                      <div className="mt-2 flex items-center gap-2 text-sm flex-wrap">
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
                            disabled={processingId === request.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {processingId === request.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleRespond(request.id, 'REJECTED')}
                            disabled={processingId === request.id}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {processingId === request.id ? (
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
                          onClick={() => handleComplete(request.id)}
                          disabled={processingId === request.id}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {processingId === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Complete
                        </button>
                      )}

                      <Link
                        href={`/landlord/requests/${request.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </Link>
                    </div>
                  </div>

                  {/* Payment Status */}
                  {request.payment && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 text-sm">
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
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            {filter !== 'ALL' ? (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No {filter.toLowerCase()} requests</h3>
                <p className="text-gray-500 mt-2">No requests with status "{filter}" found</p>
                <button
                  onClick={() => setFilter('ALL')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Show All
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No rental requests yet</h3>
                <p className="text-gray-500 mt-2">When tenants request your properties, they'll appear here</p>
                <Link
                  href="/landlord/properties"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  View Your Properties
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}