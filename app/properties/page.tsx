'use client';

import { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import PropertyGrid from '@/components/Properties/PropertyGrid';
import PropertyFilters from '@/components/Properties/PropertyFilters';
import { PropertyFilters as FilterType } from '@/types/property';

export default function PropertiesPage() {
  const [filters, setFilters] = useState<FilterType>({ page: 1, limit: 12 });
  const { data, isLoading } = useProperties(filters);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters({ ...newFilters, page: 1, limit: 12 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Browse Properties</h1>
        <p className="text-gray-600">Find your perfect rental property</p>
      </div>

      <PropertyFilters onFilterChange={handleFilterChange} initialFilters={filters} />

      <PropertyGrid properties={data?.data || []} isLoading={isLoading} />

      {data?.meta && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setFilters({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })}
            disabled={filters.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {filters.page || 1} of {data.meta.totalPages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: Math.min(data.meta.totalPages, (filters.page || 1) + 1) })}
            disabled={filters.page === data.meta.totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}