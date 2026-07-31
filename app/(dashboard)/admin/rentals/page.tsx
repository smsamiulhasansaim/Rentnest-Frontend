'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminRentals } from '@/hooks/useAdmin';
import {
  Loader2,
  Search,
  Calendar,
  Home,
  User,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Eye,
} from 'lucide-react';

export default function AdminRentalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const { data: rentalsData, isLoading, refetch } = useAdminRentals();
  const rentals = rentalsData?.data || [];

  const filteredRentals = rentals.filter((r) => {
    const matchesSearch =
      r.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.property?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; label: string; icon: any }> = {
      PENDING: { color: 'text-yellow-600 bg-yellow-50', label: 'Pending', icon: Clock },
      APPROVED: { color: 'text-green-600 bg-green-50', label: 'Approved', icon: CheckCircle },
      REJECTED: { color: 'text-red-600 bg-red-50', label: 'Rejected', icon: XCircle },
      ACTIVE: { color: 'text-blue-600 bg-blue-50', label: 'Active', icon: Sparkles },
      COMPLETED: { color: 'text-purple-600 bg-purple-50', label: 'Completed', icon: CheckCircle },
      CANCELLED: { color: 'text-gray-600 bg-gray-50', label: 'Cancelled', icon: XCircle },
    };
    return configs[status] || { color: 'text-gray-600 bg-gray-50', label: status, icon: Clock };
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading rentals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-500" />
                All Rentals
              </h1>
              <p className="text-gray-500 text-sm">{rentals.length} total rental requests</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by tenant, property, or city..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Rentals Table */}
        {filteredRentals.length > 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Move-in</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRentals.map((rental) => {
                    const status = getStatusConfig(rental.status);
                    const Icon = status.icon;
                    return (
                      <tr key={rental.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{rental.tenant?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{rental.tenant?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{rental.property?.title || 'N/A'}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {rental.property?.city || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} flex items-center gap-1 w-fit`}>
                            <Icon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {rental.payment ? (
                            <div>
                              <p className="font-bold text-gray-900">${rental.payment.amount}</p>
                              <p className={`text-xs ${rental.payment.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {rental.payment.status}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No payment</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {new Date(rental.moveInDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/rentals/${rental.id}`}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No rentals found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || filterStatus !== 'ALL'
                ? 'Try adjusting your filters'
                : 'No rental requests yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}