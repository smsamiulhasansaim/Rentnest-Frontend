'use client';

import { Home } from 'lucide-react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
  variant?: 'default' | 'compact';
}

export const PropertyGrid = ({ properties, isLoading, variant = 'default' }: PropertyGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-xl animate-pulse h-80"></div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">No properties found.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} variant={variant} />
      ))}
    </div>
  );
};

export default PropertyGrid;