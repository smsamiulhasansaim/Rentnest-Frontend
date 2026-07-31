'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdmin';
import { useToast } from '@/providers/ToastProvider';
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Home,
  Building2,
  Clock,
} from 'lucide-react';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const userId = params.id as string;

  const { data: usersData, isLoading, refetch } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();

  const user = usersData?.data?.find((u) => u.id === userId);

  const handleStatusToggle = async () => {
    if (!user) return;
    const newStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    const action = newStatus === 'BANNED' ? 'ban' : 'unban';

    const result = await Swal.fire({
      title: `${action === 'ban' ? 'Ban' : 'Unban'} this user?`,
      text: `Are you sure you want to ${action} ${user.name}?`,
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
      await updateStatus.mutateAsync({ userId: user.id, status: newStatus });
      toast.success(`User ${action}ned successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update user status');
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      TENANT: { color: 'bg-blue-50 text-blue-700', icon: User, label: 'Tenant' },
      LANDLORD: { color: 'bg-green-50 text-green-700', icon: Building2, label: 'Landlord' },
      ADMIN: { color: 'bg-red-50 text-red-700', icon: Shield, label: 'Admin' },
    };
    const config = badges[role] || badges.TENANT;
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return (
        <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Active
        </span>
      );
    }
    return (
      <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 flex items-center gap-2">
        <XCircle className="w-4 h-4" />
        Banned
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">User Not Found</h2>
          <p className="text-gray-500 mt-2">The user you're looking for doesn't exist</p>
          <Link
            href="/admin/users"
            className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/users"
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 flex-wrap">
                {user.name}
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </h1>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="px-4 py-2.5 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleStatusToggle}
              disabled={updateStatus.isPending}
              className={`px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                user.status === 'ACTIVE'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              } disabled:opacity-50`}
            >
              {updateStatus.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : user.status === 'ACTIVE' ? (
                <>
                  <XCircle className="w-4 h-4" />
                  Ban User
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Unban User
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-gray-500 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                User Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Properties</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Rentals</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Reviews</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">$0</p>
                  <p className="text-sm text-gray-500">Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {user.role === 'TENANT' && (
                  <Link
                    href={`/admin/rentals?tenant=${user.id}`}
                    className="block w-full text-center px-4 py-2.5 bg-purple-50 text-purple-600 rounded-xl font-medium hover:bg-purple-100 transition-colors"
                  >
                    <Home className="w-4 h-4 inline mr-2" />
                    View Rentals
                  </Link>
                )}
                {user.role === 'LANDLORD' && (
                  <Link
                    href={`/admin/properties?landlord=${user.id}`}
                    className="block w-full text-center px-4 py-2.5 bg-green-50 text-green-600 rounded-xl font-medium hover:bg-green-100 transition-colors"
                  >
                    <Building2 className="w-4 h-4 inline mr-2" />
                    View Properties
                  </Link>
                )}
                <button
                  onClick={handleStatusToggle}
                  disabled={updateStatus.isPending}
                  className={`block w-full text-center px-4 py-2.5 rounded-xl font-medium transition-colors ${
                    user.status === 'ACTIVE'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  } disabled:opacity-50`}
                >
                  {user.status === 'ACTIVE' ? (
                    <>
                      <XCircle className="w-4 h-4 inline mr-2" />
                      Ban User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Unban User
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Status Info */}
            <div className={`rounded-3xl border p-4 ${
              user.status === 'ACTIVE'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {user.status === 'ACTIVE' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${
                    user.status === 'ACTIVE' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {user.status === 'ACTIVE' ? 'Account Active' : 'Account Banned'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {user.status === 'ACTIVE'
                      ? 'User has full access to the platform'
                      : 'User cannot access the platform'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}