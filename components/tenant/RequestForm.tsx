'use client';

import { useState } from 'react';
import { useCreateRentalRequest } from '@/hooks/useRentalRequests';
import { useToast } from '@/providers/ToastProvider';
import { Loader2, Calendar, MessageSquare } from 'lucide-react';

interface RequestFormProps {
  propertyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RequestForm = ({ propertyId, onSuccess, onCancel }: RequestFormProps) => {
  const toast = useToast();
  const [moveInDate, setMoveInDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createRentalRequest = useCreateRentalRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!moveInDate) {
      toast.error('Please select a move-in date');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createRentalRequest.mutateAsync({
        propertyId,
        moveInDate,
        message: message.trim() || undefined,
      });

      if (response?.success) {
        toast.success('Rental request submitted successfully! 🎉');
        setMoveInDate('');
        setMessage('');
        if (onSuccess) onSuccess();
      } else {
        toast.error(response?.message || 'Failed to submit request');
      }
    } catch (error: any) {
      // Handle error properly
      let errorMessage = 'Failed to submit rental request';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Check for specific error codes
      if (error?.response?.status === 409) {
        errorMessage = 'You already have a pending request for this property';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Property not found';
      } else if (error?.response?.status === 400) {
        errorMessage = error.response.data.message || 'This property is not available';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Move-in Date *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message (Optional)
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Any special requests or questions..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default RequestForm; 