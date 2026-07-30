'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Category } from '@/types/property';

interface PropertyFiltersProps {
  onFilter: (filters: any) => void;
  categories: Category[];
  isLoading?: boolean;
}

export default function PropertyFilters({ onFilter, categories, isLoading }: PropertyFiltersProps) {
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    categoryId: '',
    bedrooms: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== undefined)
    );
    onFilter(cleanedFilters);
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      categoryId: '',
      bedrooms: '',
    });
    onFilter({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v !== undefined);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleChange}
              placeholder="Search by city..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Search
            </button>
            
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Filters'}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="$0"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="$10000"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}