'use client';

import { useParams } from 'next/navigation';
import { useProperty } from '@/hooks/useProperties';
import PropertyGallery from '@/components/Properties/PropertyGallery';
import Link from 'next/link';
import { Bed, Bath, MapPin, Home, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import RequestForm from '@/components/Requests/RequestForm';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useProperty(id as string);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-xl mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-200 h-12 w-3/4 mb-4"></div>
              <div className="bg-gray-200 h-6 w-1/2 mb-6"></div>
              <div className="bg-gray-200 h-32 w-full"></div>
            </div>
            <div className="bg-gray-200 h-64 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const property = data?.data;

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Property not found</h1>
        <Link href="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Gallery */}
      <PropertyGallery images={property.images || []} title={property.title} />

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <span className="text-2xl font-bold text-blue-600">${property.price}/mo</span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{property.address}, {property.city}</span>
          </div>

          <div className="flex gap-6 mb-6">
            <div className="flex items-center text-gray-700">
              <Bed className="w-5 h-5 mr-2" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Bath className="w-5 h-5 mr-2" />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Home className="w-5 h-5 mr-2" />
              <span>{property.category?.name || 'Uncategorized'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Landlord Info */}
          {property.landlord && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-3">Listed By</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">{property.landlord.name}</p>
                  <p className="text-sm text-gray-500">{property.landlord.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {property.reviews && property.reviews.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-3">Reviews</h2>
              <div className="space-y-4">
                {property.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.tenant?.name || 'Anonymous'}</p>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Request Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <div className="mb-4 pb-4 border-b">
              <p className="text-2xl font-bold text-blue-600">${property.price}</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>

            {property.status === 'AVAILABLE' ? (
              user ? (
                user.role === 'TENANT' ? (
                  <RequestForm propertyId={property.id} />
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    Only tenants can request to rent.
                    <br />
                    <Link href="/auth/register" className="text-blue-600 hover:underline">
                      Register as Tenant
                    </Link>
                  </p>
                )
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">Sign in to request this property</p>
                  <Link
                    href={`/auth/login?redirect=/properties/${property.id}`}
                    className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )
            ) : (
              <div className="text-center py-4">
                <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
                  Not Available
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  This property is currently {property.status.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}