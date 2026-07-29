'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRentalRequests } from '@/hooks/useRentalRequests';
import { usePayments } from '@/hooks/usePayments';
import StatsCard from '@/components/Dashboard/StatsCard';
import RequestTable from '@/components/Requests/RequestTable';
import { Home, FileText, DollarSign, CheckCircle } from 'lucide-react';

export default function TenantDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: requestsData, isLoading: requestsLoading } = useRentalRequests();
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments();

  useEffect(() => {
    if (!authLoading && user && user.role !== 'TENANT') {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [user, authLoading, router]);

  const requests = requestsData?.data || [];
  const payments = paymentsData?.data || [];

  // Calculate stats
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
  const activeRentals = requests.filter(r => r.status === 'ACTIVE').length;
  const totalSpent = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here&apos;s an overview of your rentals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Requests"
          value={totalRequests}
          icon={<FileText className="w-6 h-6" />}
        />
        <StatsCard
          title="Pending"
          value={pendingRequests}
          icon={<Home className="w-6 h-6" />}
        />
        <StatsCard
          title="Active Rentals"
          value={activeRentals}
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <StatsCard
          title="Total Spent"
          value={`$${totalSpent}`}
          icon={<DollarSign className="w-6 h-6" />}
        />
      </div>

      {/* Request History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Your Rental Requests</h2>
        <RequestTable requests={requests} isLoading={requestsLoading} />
      </div>
    </div>
  );
}