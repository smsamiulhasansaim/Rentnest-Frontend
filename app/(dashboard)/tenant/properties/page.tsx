// app/tenant/properties/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { propertyApi } from '@/lib/api/properties';
import { Property, Category } from '@/types/property';
import PropertyCard from '@/components/tenant/PropertyCard';
import PropertyFilters from '@/components/tenant/PropertyFilters';
import { Loader2, Home, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    categoryId: searchParams.get('categoryId') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  });

  useEffect(() => {
    fetchCategories();
    fetchProperties();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const res = await propertyApi.getCategories();
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };
      const response = await propertyApi.getAll(params);
      setProperties(response.data || []);
      setPagination({
        total: response.meta?.total || 0,
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 12,
        totalPages: response.meta?.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🏠 Available Properties</h1>
        <p className="text-gray-500 mt-1">
          {pagination.total} properties found in your area
        </p>
      </div>

      {/* Filters */}
      <PropertyFilters
        onFilter={handleFilter}
        categories={categories}
        isLoading={loading}
      />

      {/* View Toggle & Results */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <p className="text-sm text-gray-500">
          Showing {properties.length} of {pagination.total} results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
          }
        >
          {properties.map((property) => (
            <div key={property.id} className={viewMode === 'list' ? 'max-w-2xl mx-auto' : ''}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-16 text-center border border-gray-200 mt-6">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No properties found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search criteria
          </p>
          <button
            onClick={() => {
              setFilters({ city: '', minPrice: '', maxPrice: '', categoryId: '', bedrooms: '' });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum = i + 1;
            if (pagination.totalPages > 5 && pagination.page > 3) {
              pageNum = pagination.page - 2 + i;
              if (pageNum > pagination.totalPages) return null;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.page === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}