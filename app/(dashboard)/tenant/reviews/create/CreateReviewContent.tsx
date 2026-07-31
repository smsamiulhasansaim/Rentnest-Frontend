'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReview } from '@/hooks/useReviews';
import { useProperty } from '@/hooks/useProperties';
import { useToast } from '@/providers/ToastProvider';
import { Loader2, Star, ArrowLeft, Home, User } from 'lucide-react';

export default function CreateReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  
  const propertyId = searchParams.get('propertyId');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const { data: propertyData, isLoading: propertyLoading } = useProperty(propertyId || '');
  const createReview = useCreateReview();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!propertyId) {
      toast.error('No property selected');
      router.push('/tenant/dashboard');
    }
  }, [isAuthenticated, propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await createReview.mutateAsync({
        propertyId: propertyId!,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success('Review submitted successfully!');
      router.push(`/properties/${propertyId}`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit review');
    }
  };

  if (propertyLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const property = propertyData?.data;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-4 shadow-lg shadow-yellow-500/30">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Write a Review</h1>
            <p className="text-gray-500 mt-1">
              {property ? `Reviewing: ${property.title}` : 'Share your experience'}
            </p>
          </div>

          {/* Property Info */}
          {property && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                {property.images?.[0] ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Home className="w-full h-full text-gray-400 p-2" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                <p className="text-sm text-gray-500">{property.city}</p>
                <p className="text-sm font-medium text-blue-600">${property.price}/month</p>
              </div>
            </div>
          )}

          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {rating > 0 ? `${rating} out of 5 stars` : 'Tap a star to rate'}
            </p>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this property..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={createReview.isPending || rating === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {createReview.isPending ? (
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

          <p className="text-xs text-gray-400 text-center mt-4">
            Your review will be visible to the landlord and other tenants
          </p>
        </div>
      </div>
    </div>
  );
}