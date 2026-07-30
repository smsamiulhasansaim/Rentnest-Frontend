// app/tenant/reviews/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
      await createReview.mutateAsync({
        propertyId: propertyId!,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success('Review submitted successfully! 🎉');
      router.push(`/tenant/properties/${propertyId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (rentalLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-8 text-white">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Write a Review</h1>
          </div>
          <p className="text-yellow-100 mt-1">Share your experience with this property</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Info */}
          {rental?.property && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                  {rental.property.images?.[0] ? (
                    <img
                      src={rental.property.images[0]}
                      alt={rental.property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Home className="w-8 h-8 text-gray-400 m-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{rental.property.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {rental.property.city}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Stayed: {new Date(rental.moveInDate).toLocaleDateString()}
                  </p>
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
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {rating > 0 ? `${rating} out of 5 stars` : 'Tap a star to rate'}
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
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
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/30"
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
          </form>
        </div>
      </div>
    </div>
  );
}