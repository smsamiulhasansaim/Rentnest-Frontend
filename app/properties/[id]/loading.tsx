'use client';

export default function PropertyDetailsLoading() {
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