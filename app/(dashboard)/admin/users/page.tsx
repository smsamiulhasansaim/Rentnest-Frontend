// app/admin/users/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdmin';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  ArrowLeft,
  RefreshCw,
  Eye,
} from 'lucide-react';

export default function AdminUsersPage() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const { data: usersData, isLoading, refetch } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();

  const users = usersData?.data || [];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesStatus = filterStatus === 'ALL' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    const action = newStatus === 'BANNED' ? 'ban' : 'unban';

    const result = await Swal.fire({
      title: `${action === 'ban' ? 'Ban' : 'Unban'} this user?`,
      text: `Are you sure you want to ${action} this user?`,
      icon: 'warning',
      background: '#1f2937',
      color: '#f3f4f6',
      showCancelButton: true,
      confirmButtonColor: action === 'ban' ? '#dc2626' : '#16a34a',
      cancelButtonColor: '#4b5563',
      confirmButtonText: action === 'ban' ? 'Yes, ban user' : 'Yes, unban user',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await updateStatus.mutateAsync({ userId, status: newStatus });
      toast.success(`User ${action}ned successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update user status');
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; icon: any }> = {
      TENANT: { color: 'bg-blue-50 text-blue-700', icon: User },
      LANDLORD: { color: 'bg-green-50 text-green-700', icon: Shield },
      ADMIN: { color: 'bg-red-50 text-red-700', icon: Shield },
    };
    const config = badges[role] || badges.TENANT;
    const Icon = config.icon;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon className="w-3 h-3" />
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Banned
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-500" />
                User Management
              </h1>
              <p className="text-gray-500 text-sm">{users.length} total users</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="TENANT">Tenant</option>
            <option value="LANDLORD">Landlord</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const isThisUserUpdating =
                      updateStatus.isPending && updateStatus.variables?.userId === user.id;

                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                              {user.phone && (
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {user.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                        <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                            <button
                              onClick={() => handleStatusToggle(user.id, user.status)}
                              disabled={updateStatus.isPending}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                user.status === 'ACTIVE'
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              } disabled:opacity-50`}
                            >
                              {isThisUserUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : user.status === 'ACTIVE' ? (
                                'Ban'
                              ) : (
                                'Unban'
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No users found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL'
                ? 'Try adjusting your filters'
                : 'No users registered yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}