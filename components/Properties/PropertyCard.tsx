'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { Bed, Bath, MapPin, Home } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const { id, title, price, city, address, bedrooms, bathrooms, images, status } = property;

  return (
    <Link href={`/properties/${id}`}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-200">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <Home className="w-16 h-16 text-gray-400" />
            </div>
          )}
          {status === 'BOOKED' && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              BOOKED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{title}</h3>
            <span className="text-xl font-bold text-blue-600">${price}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{city}, {address}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            {bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms > 0 && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{bathrooms}</span>
              </div>
            )}
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs text-gray-500">+{property.amenities.length - 3}</span>
              )}
            </div>
          )}

          {/* Status Badge */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                status === 'AVAILABLE'
                  ? 'bg-green-100 text-green-700'
                  : status === 'BOOKED'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;