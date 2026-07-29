'use client';

import { useState } from 'react';
import { useCreateRentalRequest } from '@/hooks/useRentalRequests';
import { useToast } from '@/providers/ToastProvider';
import { Calendar, MessageSquare, Loader2 } from 'lucide-react';

interface RequestFormProps {
  propertyId: string;
}

export const RequestForm = ({ propertyId }: RequestFormProps) => {
  const [moveInDate, setMoveInDate] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { mutate, isPending } = useCreateRentalRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!moveInDate) {
      toast.error('Please select a move-in date');
      return;
    }

    mutate(
      {
        propertyId,
        moveInDate,
        message: message.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Rental request submitted successfully!');
          setMoveInDate('');
          setMessage('');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to submit request');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Move-in Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message (Optional)
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message for the landlord..."
            rows={3}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Request to Rent'
        )}
      </button>
    </form>
  );
};

export default RequestForm;