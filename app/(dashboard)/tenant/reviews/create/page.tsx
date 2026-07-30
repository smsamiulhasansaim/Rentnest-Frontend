'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReview } from '@/hooks/useReviews';
import { useRentalRequest } from '@/hooks/useRentalRequests';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  ArrowLeft,
  Star,
  Home,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export default function CreateReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  const rentalId = searchParams.get('rentalId');
  const propertyId = searchParams.get('propertyId');

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: rentalData, isLoading: rentalLoading } = useRentalRequest(rentalId || '');
  const createReview = useCreateReview();

  const rental = rentalData?.data;

  useEffect(() => {
    if (!rentalId || !propertyId) {
      toast.error('Missing rental or property information');
      router.push('/tenant/rentals');
    }
  }, [rentalId, propertyId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createReview.mutateAsync({
        propertyId: propertyId!,
        rating,
        comment: comment.trim() || undefined,
      });
      
      if (response?.success) {
        toast.success('Review submitted successfully!');
        router.push(`/tenant/properties/${propertyId}`);
      } else {
        toast.error(response?.message || 'Failed to submit review');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (rentalLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
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

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-8 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Star className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Write a Review</h1>
                <p className="text-yellow-100 text-sm">Share your experience with this property</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Property Info */}
            {rental?.property && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 mb-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden shadow-md">
                    {rental.property.images?.[0] ? (
                      <img
                        src={rental.property.images[0]}
                        alt={rental.property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {rental.property.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {rental.property.city}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      Stayed: {new Date(rental.moveInDate).toLocaleDateString()}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-all hover:scale-110"
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-md'
                            : 'text-gray-200 hover:text-gray-300'
                        } transition-all`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {rating > 0 ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      {rating} out of 5 stars
                    </span>
                  ) : (
                    'Tap a star to rate'
                  )}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none transition-all"
                    rows={5}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {comment.length} characters
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    Submit Review
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Your review will be visible to the property owner and other users
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}