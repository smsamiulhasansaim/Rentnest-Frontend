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
  MessageSquare,
  Wifi,
  Wind,
  Coffee,
  Shield,
  Smartphone,
  Tv,
  Utensils,
  Droplets,
  Sun,
  Sparkles,
  Clock,
  Users,
  Building2,
  Car,
  Sofa,
  TreePine,
  Fan,
  Dumbbell,
  Flame,
  Waves,
  Snowflake,
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
  const [reviewData, setReviewData] = useState<{
    rating: number;
    comment: string;
    hover: number;
  }>({
    rating: 0,
    comment: '',
    hover: 0,
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await propertyApi.getById(propertyId);
      setProperty(response.data);

      if (isAuthenticated && user?.role === 'TENANT') {
        try {
          const rentals = await rentalApi.getMyRequests();
          const completed = rentals.data?.some(
            (r) => r.propertyId === propertyId && r.status === 'COMPLETED'
          );
          
          const existingReview = response.data.reviews?.some(
            (r) => r.tenantId === user?.id
          );
          
          setCanReview(!!completed && !existingReview);
          setHasExistingReview(!!existingReview);
        } catch (error) {
          console.error('Error checking rental status:', error);
        }
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
      toast.success('🎉 Rental request submitted successfully!');
      setShowRequestForm(false);
      setRequestData({ moveInDate: '', message: '' });
      fetchProperty();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to submit request';
      if (error?.response?.status === 409) {
        toast.error('You already have a pending request for this property');
      } else {
        toast.error(msg);
      }
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
      toast.success('⭐ Review submitted successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 0, comment: '', hover: 0 });
      setCanReview(false);
      setHasExistingReview(true);
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

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    const icons: Record<string, any> = {
      'wifi': Wifi,
      'wi-fi': Wifi,
      'internet': Wifi,
      'parking': Car,
      'car parking': Car,
      'ac': Wind,
      'air conditioning': Wind,
      'air conditioner': Wind,
      'coffee': Coffee,
      'security': Shield,
      'cctv': Shield,
      'smart': Smartphone,
      'smart home': Smartphone,
      'tv': Tv,
      'television': Tv,
      'kitchen': Utensils,
      'pool': Droplets,
      'swimming pool': Droplets,
      'gym': Dumbbell,
      'fitness': Dumbbell,
      'garden': TreePine,
      'balcony': Sun,
      'terrace': Sun,
      'fireplace': Flame,
      'sea view': Waves,
      'ocean view': Waves,
      'lake view': Waves,
      'heating': Snowflake,
      'furnished': Sofa,
      'furniture': Sofa,
    };
    const Icon = icons[lower] || Sparkles;
    return <Icon className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">Property not found</h2>
          <p className="text-gray-500 mt-2">The property you&apos;re looking for doesn&apos;t exist</p>
          <Link
            href="/tenant/properties"
            className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
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

  const isAvailable = property.status === 'AVAILABLE';
  const isBooked = property.status === 'BOOKED';
  const isRented = property.status === 'RENTED';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-all hover:translate-x-[-4px]"
        >
          <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <div className="relative bg-gray-100 h-[420px]">
                <Image
                  src={property.images?.[selectedImage] || '/images/placeholder-property.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {isAvailable && (
                    <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full text-sm font-semibold text-white shadow-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Available
                    </span>
                  )}
                  {isBooked && (
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full text-sm font-semibold text-white shadow-lg flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Booked
                    </span>
                  )}
                  {isRented && (
                    <span className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 rounded-full text-sm font-semibold text-white shadow-lg flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Rented
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-110"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-110">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Image Counter */}
                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium">
                    {selectedImage + 1} / {property.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50/50">
                  {property.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                        selectedImage === index
                          ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md'
                          : 'opacity-60 hover:opacity-100'
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
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-5">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>{property.address}, {property.city}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 py-4 border-t border-b border-gray-100">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                  <Bed className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{property.bedrooms}</span>
                  <span className="text-gray-500 text-sm">Beds</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                  <Bath className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{property.bathrooms}</span>
                  <span className="text-gray-500 text-sm">Baths</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                  <Home className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600 text-sm">{property.category?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({property.reviews?.length || 0} reviews)</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Rent Price</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-blue-600">${property.price}</span>
                      <span className="text-gray-500 text-sm font-medium mb-1">/month</span>
                    </div>
                  </div>
                  {isAvailable && isAuthenticated && user?.role === 'TENANT' && (
                    <button
                      onClick={() => setShowRequestForm(!showRequestForm)}
                      className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <Home className="w-5 h-5" />
                      Request to Rent
                    </button>
                  )}
                  {isAvailable && (!isAuthenticated || user?.role !== 'TENANT') && (
                    <Link
                      href="/auth/login"
                      className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      Login to Rent
                    </Link>
                  )}
                  {!isAvailable && (
                    <div className="px-8 py-3.5 bg-gray-200 text-gray-600 rounded-2xl font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {isBooked ? 'Currently Booked' : 'Not Available'}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                  {property.description || 'No description provided.'}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl text-sm font-medium flex items-center gap-2 border border-gray-200 hover:shadow-md transition-all hover:scale-105"
                      >
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Form */}
              {showRequestForm && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 border-2 border-blue-200 shadow-xl animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Home className="w-6 h-6 text-blue-500" />
                    Submit Rental Request
                  </h3>
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
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5" />
                            Submit Request
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRequestForm(false)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Landlord Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Property Owner
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-lg">
                    {property.landlord?.name || 'Unknown'}
                  </p>
                  {property.landlord?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{property.landlord.email}</span>
                    </div>
                  )}
                  {property.landlord?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{property.landlord.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  Reviews
                </h2>
                {canReview && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="text-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-yellow-400/30 transition-all hover:scale-105"
                  >
                    <Star className="w-4 h-4 inline mr-1" />
                    Write Review
                  </button>
                )}
                {hasExistingReview && (
                  <span className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Reviewed
                  </span>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-4 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 animate-fadeIn">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Share Your Experience
                  </h3>
                  <form onSubmit={handleReview} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() =>
                              setReviewData((prev) => ({ ...prev, hover: star }))
                            }
                            onMouseLeave={() =>
                              setReviewData((prev) => ({ ...prev, hover: 0 }))
                            }
                            onClick={() =>
                              setReviewData((prev) => ({ ...prev, rating: star }))
                            }
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-9 h-9 ${
                                star <= (reviewData.hover || reviewData.rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {reviewData.rating > 0 
                          ? `${reviewData.rating} out of 5 stars` 
                          : 'Tap a star to rate'}
                      </p>
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
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting || reviewData.rating === 0}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium hover:from-yellow-500 hover:to-orange-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/25"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4" />
                            Submit Review
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReviewForm(false);
                          setReviewData({ rating: 0, comment: '', hover: 0 });
                        }}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              {property.reviews && property.reviews.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              {review.tenant?.name || 'Anonymous'}
                            </span>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 text-sm mt-2 ml-12">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No reviews yet</p>
                  <p className="text-gray-400 text-sm">Be the first to review this property</p>
                </div>
              )}
            </div>

            {/* Status Card */}
            {!isAvailable && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                  Status
                </h2>
                <p className="text-gray-600">
                  {isBooked && '🏠 This property is currently booked.'}
                  {isRented && '📋 This property has been rented.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for scrollbar and animation */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}