'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLandlordProperties } from '@/hooks/useProperties';
import { useRentalRequests } from '@/hooks/useRentalRequests';
import StatsCard from '@/components/Dashboard/StatsCard';
import Link from 'next/link';
import { Home, Plus, FileText, Users, DollarSign } from 'lucide-react';

export default function LandlordDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: propertiesData, isLoading: propertiesLoading } = useLandlordProperties();
  const { data: requestsData, isLoading: requestsLoading } = useRentalRequests();

  useEffect(() => {
    if (!authLoading && user && user.role !== 'LANDLORD') {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [user, authLoading, router]);

  const properties = propertiesData?.data || [];
  const requests = requestsData?.data || [];

  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.status === 'AVAILABLE').length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
  const totalEarnings = requests
    .filter(r => r.status === 'ACTIVE')
    .reduce((sum, r) => sum + (r.property?.price || 0), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 🏠
          </h1>
          <p className="text-gray-600 mt-1">Manage your properties and rental requests</p>
        </div>
        <Link
          href="/dashboard/landlord/properties/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Properties"
          value={totalProperties}
          icon={<Home className="w-6 h-6" />}
        />
        <StatsCard
          title="Available"
          value={availableProperties}
          icon={<Home className="w-6 h-6" />}
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<FileText className="w-6 h-6" />}
        />
        <StatsCard
          title="Earnings"
          value={`$${totalEarnings}`}
          icon={<DollarSign className="w-6 h-6" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/landlord/requests"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Pending Requests</h3>
              <p className="text-gray-600 text-sm">
                {pendingRequests} request{pendingRequests !== 1 ? 's' : ''} waiting for your response
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Link>

        <Link
          href="/dashboard/landlord/properties/new"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">List New Property</h3>
              <p className="text-gray-600 text-sm">Add a new property to your portfolio</p>
            </div>
            <Plus className="w-8 h-8 text-green-600" />
          </div>
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Properties</h2>
          <Link href="/dashboard/landlord/properties" className="text-blue-600 hover:underline text-sm">
            View All
          </Link>
        </div>
        {propertiesLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-16 rounded"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No properties listed yet</p>
            <Link href="/dashboard/landlord/properties/new" className="text-blue-600 hover:underline">
              List your first property
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-sm text-gray-600">{property.city} • ${property.price}/mo</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  property.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                  property.status === 'BOOKED' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {property.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}