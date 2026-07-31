'use client';

import { useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useAdminProperties } from '@/hooks/useAdmin';
import { useToast } from '@/providers/ToastProvider';
import { adminApi } from '@/lib/api/admin';
import {
  Loader2,
  Search,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Building2,
  ArrowLeft,
  RefreshCw,
  Eye,
  Calendar,
  Trash2,
  CheckSquare,
  Square,
  X,
} from 'lucide-react';

export default function AdminPropertiesPage() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: propertiesData, isLoading, refetch } = useAdminProperties();
  const properties = propertiesData?.data || [];

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.landlord?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      AVAILABLE: { color: 'bg-green-100 text-green-700', label: 'Available' },
      BOOKED: { color: 'bg-yellow-100 text-yellow-700', label: 'Booked' },
      INACTIVE: { color: 'bg-gray-100 text-gray-700', label: 'Inactive' },
    };
    return badges[status] || badges.AVAILABLE;
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProperties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProperties.map((p) => p.id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: 'Delete this property?',
      text: `Are you sure you want to DELETE "${title}"? This action cannot be undone.`,
      icon: 'warning',
      background: '#1f2937',
      color: '#f3f4f6',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      const response = await adminApi.deleteProperty(id);
      if (response.success) {
        toast.success(`Property "${title}" deleted successfully`);
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
        refetch();
      } else {
        toast.error(response.message || 'Failed to delete property');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to delete property';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} properties?`,
      text: `Are you sure you want to DELETE ${selectedIds.length} selected properties? This action cannot be undone.`,
      icon: 'warning',
      background: '#1f2937',
      color: '#f3f4f6',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: `Yes, delete ${selectedIds.length}`,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsBulkDeleting(true);
    const results = await Promise.allSettled(
      selectedIds.map((id) => adminApi.deleteProperty(id))
    );

    const failedCount = results.filter((r) => r.status === 'rejected').length;
    const succeededCount = results.length - failedCount;

    if (succeededCount > 0) {
      toast.success(`${succeededCount} propert${succeededCount === 1 ? 'y' : 'ies'} deleted successfully`);
    }
    if (failedCount > 0) {
      toast.error(`Failed to delete ${failedCount} propert${failedCount === 1 ? 'y' : 'ies'}`);
    }

    setSelectedIds([]);
    setIsBulkDeleting(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading properties...</p>
      </div>
    );
  }

  const allSelected = filteredProperties.length > 0 && selectedIds.length === filteredProperties.length;

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
                <Building2 className="w-6 h-6 text-green-500" />
                All Properties
              </h1>
              <p className="text-gray-500 text-sm">{properties.length} total properties</p>
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
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, city, or landlord..."
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
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Selection Toolbar */}
        {filteredProperties.length > 0 && (
          <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 rounded-xl px-4 py-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{selectedIds.length} selected</span>
                <button
                  onClick={clearSelection}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isBulkDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map((property) => {
              const status = getStatusBadge(property.status);
              const isSelected = selectedIds.includes(property.id);
              return (
                <div
                  key={property.id}
                  className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow ${
                    isSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100'
                  }`}
                >
                  <div className="relative h-48 bg-gray-100">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Home className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Selection Checkbox - Top Left */}
                    <button
                      onClick={() => toggleSelect(property.id)}
                      className="absolute top-3 left-3 p-2 bg-white/90 hover:bg-white text-gray-700 rounded-xl shadow-lg transition-all"
                      title="Select property"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    {/* Admin Delete Button - Bottom Left */}
                    <button
                      onClick={() => handleDelete(property.id, property.title)}
                      disabled={deletingId === property.id}
                      className="absolute bottom-3 left-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 hover:scale-105"
                      title="Delete Property (Admin)"
                    >
                      {deletingId === property.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 truncate">{property.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {property.city}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-bold text-blue-600">${property.price}</span>
                      <span className="text-xs text-gray-400">/month</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms}
                      </span>
                      <span>•</span>
                      <span>{property.category?.name || 'N/A'}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-sm">
                        <p className="text-gray-500">Landlord</p>
                        <p className="font-medium text-gray-900">{property.landlord?.name || 'N/A'}</p>
                      </div>
                      <div className="text-sm text-right">
                        <p className="text-gray-500">Reviews</p>
                        <p className="font-medium text-gray-900">⭐ {property._count?.reviews || 0}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="flex-1 text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No properties found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || filterStatus !== 'ALL'
                ? 'Try adjusting your filters'
                : 'No properties listed yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}