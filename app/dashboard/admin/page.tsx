'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers, useAdminProperties, useAdminRentals } from '@/hooks/useAdmin';
import StatsCard from '@/components/Dashboard/StatsCard';
import { Users, Home, FileText, DollarSign } from 'lucide-react';
import DataTable from '@/components/Dashboard/DataTable';

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: propertiesData, isLoading: propertiesLoading } = useAdminProperties();
  const { data: rentalsData, isLoading: rentalsLoading } = useAdminRentals();

  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [user, authLoading, router]);

  const users = usersData?.data || [];
  const properties = propertiesData?.data || [];
  const rentals = rentalsData?.data || [];

  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const pendingRentals = rentals.filter(r => r.status === 'PENDING').length;
  const totalRevenue = rentals
    .filter(r => r.status === 'ACTIVE' || r.status === 'COMPLETED')
    .reduce((sum, r) => sum + (r.property?.price || 0), 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-gray-600 mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={users.length}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Active Users"
          value={activeUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Total Properties"
          value={properties.length}
          icon={<Home className="w-6 h-6" />}
        />
        <StatsCard
          title="Pending Rentals"
          value={pendingRentals}
          icon={<FileText className="w-6 h-6" />}
        />
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        <DataTable
          data={users.slice(0, 5)}
          columns={['Name', 'Email', 'Role', 'Status']}
          isLoading={usersLoading}
        />
      </div>

      {/* Recent Rentals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Rental Requests</h2>
        <DataTable
          data={rentals.slice(0, 5)}
          columns={['Property', 'Tenant', 'Status', 'Amount']}
          isLoading={rentalsLoading}
        />
      </div>
    </div>
  );
}