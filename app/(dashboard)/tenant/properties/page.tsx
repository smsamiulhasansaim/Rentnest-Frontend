'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProperties, useCategories } from '@/hooks/useProperties';
import { PropertyFilters } from '@/types/property';
import {
  Search,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Home,
  Filter,
  X,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function TenantPropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 12,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const { data: propertiesData, isLoading, isFetching } = useProperties(filters);
  const { data: categoriesData } = useCategories();

  const properties = propertiesData?.data || [];
  const meta = propertiesData?.meta;
  const categories = categoriesData?.data || [];

  // Update filters when search changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, city: searchTerm || undefined, page: 1 }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchTerm('');
    setPriceRange([0, 10000]);
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🔍 Find Your Perfect Home</h1>
        <p className="text-gray-500 mt-1">
          {meta?.total || 0} properties available
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by city, area, or property name..."
          className="w-full pl-12 pr-32 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="10000"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.categoryId || filters.bedrooms || filters.minPrice || filters.maxPrice) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              {filters.categoryId && (
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2">
                  Category: {categories.find(c => c.id === filters.categoryId)?.name}
                  <button onClick={() => handleFilterChange('categoryId', undefined)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.bedrooms && (
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2">
                  {filters.bedrooms}+ Beds
                  <button onClick={() => handleFilterChange('bedrooms', undefined)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2">
                  ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                  <button onClick={() => { handleFilterChange('minPrice', undefined); handleFilterChange('maxPrice', undefined); }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/tenant/properties/${property.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                      Available
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {property.city}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">${property.price}</span>
                    <span className="text-xs text-gray-400">/month</span>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
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
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (meta.totalPages > 5 && meta.page > 3) {
                  pageNum = meta.page - 2 + i;
                  if (pageNum > meta.totalPages) return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      meta.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-16 text-center border border-gray-200">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No Properties Found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm ? `No results for "${searchTerm}"` : 'Try adjusting your filters'}
          </p>
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); clearFilters(); }}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}