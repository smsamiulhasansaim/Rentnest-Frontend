// app/tenant/properties/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { propertyApi } from '@/lib/api/properties';
import { rentalApi } from '@/lib/api/rentals';
import { reviewApi } from '@/lib/api/reviews';
import { Property } from '@/types/property';
import { useToast } from '@/providers/ToastProvider';
import {
  Bed,
  Bath,
  MapPin,
  DollarSign,
  Home,
  Calendar,
  Star,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Heart,
  Share2,
} from 'lucide-react';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    moveInDate: '',
    message: '',
  });
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasRental, setHasRental] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await propertyApi.getById(propertyId);
      setProperty(response.data);
      // Check if user has completed rental for this property
      if (isAuthenticated) {
        const rentals = await rentalApi.getMyRequests();
        const completed = rentals.data?.some(
          (r) => r.propertyId === propertyId && r.status === 'COMPLETED'
        );
        setHasRental(!!completed);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load property');
      router.push('/tenant/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRentalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a rental request');
      router.push('/auth/login');
      return;
    }

    if (!requestData.moveInDate) {
      toast.error('Please select a move-in date');
      return;
    }

    setSubmitting(true);
    try {
      await rentalApi.create({
        propertyId,
        moveInDate: requestData.moveInDate,
        message: requestData.message,
      });
      toast.success('Rental request submitted successfully!');
      setShowRequestForm(false);
      setRequestData({ moveInDate: '', message: '' });
      fetchProperty();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      router.push('/auth/login');
      return;
    }

    if (reviewData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await reviewApi.create({
        propertyId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 0, comment: '' });
      fetchProperty();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : i < rating
            ? 'text-yellow-400 fill-yellow-400 opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Property not found</h2>
          <p className="text-gray-500 mt-2">The property you're looking for doesn't exist</p>
          <Link
            href="/tenant/properties"
            className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = property.reviews?.length
    ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-96 mb-4">
            <Image
              src={property.images?.[selectedImage] || '/images/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
            />
            {property.status === 'AVAILABLE' && (
              <div className="absolute top-4 left-4 bg-green-500 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                Available
              </div>
            )}
            {property.status === 'BOOKED' && (
              <div className="absolute top-4 left-4 bg-yellow-500 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                Booked
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === index
                      ? 'border-blue-600 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${property.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Property Details */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin className="w-5 h-5" />
              <span>{property.address}, {property.city}</span>
            </div>

            <div className="flex items-center gap-6 mt-4 flex-wrap">
              <div className="flex items-center gap-1 text-gray-700">
                <Bed className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{property.bedrooms}</span> Beds
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Bath className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{property.bathrooms}</span> Baths
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Home className="w-5 h-5 text-gray-400" />
                <span>{property.category?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-gray-400">({property.reviews?.length || 0} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rent Price</p>
                  <p className="text-3xl font-bold text-blue-600">${property.price}<span className="text-lg font-normal text-gray-500">/month</span></p>
                </div>
                {property.status === 'AVAILABLE' && isAuthenticated && user?.role === 'TENANT' && (
                  <button
                    onClick={() => setShowRequestForm(!showRequestForm)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                  >
                    Request to Rent
                  </button>
                )}
                {property.status === 'AVAILABLE' && (!isAuthenticated || user?.role !== 'TENANT') && (
                  <Link
                    href="/auth/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                  >
                    Login to Rent
                  </Link>
                )}
                {property.status !== 'AVAILABLE' && (
                  <div className="px-6 py-3 bg-gray-200 text-gray-600 rounded-xl font-semibold">
                    {property.status === 'BOOKED' ? 'Currently Booked' : 'Not Available'}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {property.description || 'No description provided.'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rental Request Form */}
            {showRequestForm && (
              <div className="mt-6 p-6 bg-white border-2 border-blue-200 rounded-2xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Rental Request</h3>
                <form onSubmit={handleRentalRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Move-in Date *
                    </label>
                    <input
                      type="date"
                      value={requestData.moveInDate}
                      onChange={(e) =>
                        setRequestData((prev) => ({ ...prev, moveInDate: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      value={requestData.message}
                      onChange={(e) =>
                        setRequestData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Any special requests or questions..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Landlord Info & Reviews */}
        <div className="space-y-6">
          {/* Landlord Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Property Owner</h2>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  {property.landlord?.name || 'Unknown'}
                </p>
                {property.landlord?.email && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{property.landlord.email}</span>
                  </div>
                )}
                {property.landlord?.phone && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{property.landlord.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
              {hasRental && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Write Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <form onSubmit={handleReview} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating *
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewData((prev) => ({ ...prev, rating: star }))
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= reviewData.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comment
                    </label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                      }
                      placeholder="Share your experience..."
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {property.reviews && property.reviews.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {property.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {review.tenant?.name || 'Anonymous'}
                        </span>
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No reviews yet</p>
                <p className="text-gray-400 text-sm">Be the first to review this property</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}