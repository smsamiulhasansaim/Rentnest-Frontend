// app/auth/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Loader2, Mail, Lock, Building2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role.toLowerCase();
      router.push(`/${role}/dashboard`);
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role: 'tenant' | 'landlord') => {
    if (role === 'tenant') {
      setEmail('tenant@rentnest.com');
      setPassword('tenant123');
    } else {
      setEmail('landlord@rentnest.com');
      setPassword('landlord123');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your RentNest account</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
              <span className="text-red-500 text-lg">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fillDemo('tenant')}
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-sm font-medium text-blue-700 transition-all"
                disabled={isLoading}
              >
                🏠 Tenant
              </button>
              <button
                onClick={() => fillDemo('landlord')}
                className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-sm font-medium text-purple-700 transition-all"
                disabled={isLoading}
              >
                🏢 Landlord
              </button>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-gray-400">Admin: admin@rentnest.com / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}