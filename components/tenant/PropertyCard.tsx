'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { Bed, Bath, MapPin, DollarSign, Home } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.[0] || '/images/placeholder-property.jpg';

  return (
    <Link href={`/tenant/properties/${property.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-blue-600 shadow-sm">
            ${property.price}/mo
          </div>
          {property.status === 'AVAILABLE' && (
            <div className="absolute top-3 left-3 bg-green-500 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm">
              Available
            </div>
          )}
          {property.status === 'BOOKED' && (
            <div className="absolute top-3 left-3 bg-yellow-500 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm">
              Booked
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            {property.category && (
              <div className="flex items-center gap-1">
                <Home className="w-4 h-4 text-gray-400" />
                <span>{property.category.name}</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {property.landlord?.name || 'Property Owner'}
            </span>
            <span className="text-xs text-blue-600 font-medium group-hover:underline">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}