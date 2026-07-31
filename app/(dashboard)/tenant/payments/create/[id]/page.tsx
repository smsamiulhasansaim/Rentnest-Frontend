import { Suspense } from 'react';
import CreateReviewContent from './CreateReviewContent';

export default function CreateReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    }>
      <CreateReviewContent />
    </Suspense>
  );
}