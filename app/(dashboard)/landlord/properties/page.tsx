// app/landlord/properties/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import propertyApi from '@/lib/api/properties';
import { Property } from '@/types/property';
import { useToast } from '@/providers/ToastProvider';
import {
  Plus,
  Building2,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Search,
  Filter,
  Home,
  Calendar,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  CheckCircle,
} from 'lucide-react';

export default function LandlordPropertiesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyApi.getMyProperties();
      setProperties(response.data || []);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    setDeleting(propertyId);
    try {
      await propertyApi.delete(propertyId);
      toast.success('Property deleted successfully');
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete property');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: any }> = {
      AVAILABLE: { color: 'bg-green-100 text-green-800', label: 'Available', icon: Home },
      BOOKED: { color: 'bg-yellow-100 text-yellow-800', label: 'Booked', icon: Calendar },
      RENTED: { color: 'bg-blue-100 text-blue-800', label: 'Rented', icon: CheckCircle },
    };
    const config = badges[status] || badges.AVAILABLE;
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = properties.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📋 My Properties</h1>
          <p className="text-gray-500 mt-1">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>
        <Link
          href="/landlord/properties/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          Add New Property
        </Link>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            filterStatus === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({properties.length})
        </button>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status} ({count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search properties by title or city..."
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
        />
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{property.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{property.address}, {property.city}</span>
                    </div>
                  </div>
                  {getStatusBadge(property.status)}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${property.price}</span>
                  <span className="text-xs text-gray-400">/month</span>
                </div>

                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
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

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/tenant/properties/${property.id}`}
                    target="_blank"
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <Link
                    href={`/landlord/properties/${property.id}/edit`}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    disabled={deleting === property.id}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {deleting === property.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-16 text-center border border-gray-200">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            {searchTerm || filterStatus !== 'ALL'
              ? 'No properties match your filters'
              : 'No properties listed yet'}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || filterStatus !== 'ALL'
              ? 'Try adjusting your search or filter criteria'
              : 'List your first property and start earning rent'}
          </p>
          {(searchTerm || filterStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('ALL');
              }}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
          {!searchTerm && filterStatus === 'ALL' && properties.length === 0 && (
            <Link
              href="/landlord/properties/create"
              className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              List Your First Property →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}