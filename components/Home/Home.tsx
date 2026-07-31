'use client';

import { useProperties } from '@/hooks/useProperties';
import PropertyGrid from '@/components/Properties/PropertyGrid';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Home, Search, Users, Shield, Sparkles, Building2, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useProperties({ limit: 8 });

  // Role check
  const role = user?.role || 'GUEST';
  const isAuthenticated = !!user;

  // Role-specific hero configs
  const heroConfigs = {
    GUEST: {
      title: 'Find Your Dream Rental Property',
      subtitle: 'Browse thousands of properties, connect with landlords, and find your perfect home.',
      ctaPrimary: { text: 'Browse Properties', href: '/tenant/properties', icon: ArrowRight },
      ctaSecondary: { text: 'Get Started', href: '/auth/register', icon: Sparkles },
      badge: null,
    },
    TENANT: {
      title: 'Find Your Next Home',
      subtitle: `Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Discover available properties and submit rental requests instantly.`,
      ctaPrimary: { text: 'Browse Properties', href: '/tenant/properties', icon: Search },
      ctaSecondary: { text: 'My Rentals', href: '/tenant/rentals', icon: Home },
      badge: { text: 'Tenant Dashboard', color: 'bg-blue-500' },
    },
    LANDLORD: {
      title: 'List Your Property & Earn',
      subtitle: `Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Manage your properties, review tenant requests, and track your earnings.`,
      ctaPrimary: { text: 'List New Property', href: '/landlord/properties/create', icon: PlusCircle },
      ctaSecondary: { text: 'My Properties', href: '/landlord/properties', icon: Building2 },
      badge: { text: 'Landlord Dashboard', color: 'bg-green-500' },
    },
    ADMIN: {
      title: 'Admin Control Panel',
      subtitle: `Welcome${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Monitor platform activity, manage users, and oversee all rentals.`,
      ctaPrimary: { text: 'Go to Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ctaSecondary: { text: 'Manage Users', href: '/admin/users', icon: Users },
      badge: { text: 'Admin Access', color: 'bg-red-500' },
    },
  };

  const config = heroConfigs[role as keyof typeof heroConfigs] || heroConfigs.GUEST;

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section 
        className="relative text-white py-20 md:py-28 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Role Badge */}
            {config.badge && (
              <div className="inline-block mb-4">
                <span className={`${config.badge.color} px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm bg-opacity-80`}>
                  {config.badge.text}
                </span>
              </div>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <Home className="w-16 h-16" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              {config.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md max-w-2xl mx-auto">
              {config.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={config.ctaPrimary.href}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
              >
                {config.ctaPrimary.text}
                <config.ctaPrimary.icon className="w-5 h-5" />
              </Link>
              <Link
                href={config.ctaSecondary.href}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-colors text-lg border border-white/20 ${
                  isAuthenticated 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                {config.ctaSecondary.text}
                <config.ctaSecondary.icon className="w-5 h-5" />
              </Link>
            </div>

            {/* Quick Stats for Guests */}
            {!isAuthenticated && (
              <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-white/70">Properties</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <p className="text-2xl font-bold">200+</p>
                  <p className="text-sm text-white/70">Landlords</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-white/70">Satisfaction</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isAuthenticated && role === 'ADMIN' 
              ? 'Admin Features' 
              : isAuthenticated && role === 'LANDLORD'
              ? 'Landlord Tools'
              : isAuthenticated && role === 'TENANT'
              ? 'Tenant Features'
              : 'Why Choose RentNest?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">Find properties with advanced filters and instant search.</p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Connect</h3>
              <p className="text-gray-600">Connect directly with landlords and manage rentals.</p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Safe and secure payment processing with Stripe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {isAuthenticated && role === 'LANDLORD' 
                ? 'Recent Properties' 
                : 'Featured Properties'}
            </h2>
            <Link
              href="/tenant/properties"
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <PropertyGrid properties={data?.data || []} isLoading={isLoading} />
        </div>
      </section>

      {/* CTA Section - Role Specific */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          {!isAuthenticated ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users finding their perfect rental property or listing their properties.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/tenant/properties"
                  className="border border-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            </>
          ) : role === 'ADMIN' ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Manage the Platform</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Oversee all users, properties, rentals, and payments from one central dashboard.
              </p>
              <Link
                href="/admin/dashboard"
                className="inline-block bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Admin Dashboard
              </Link>
            </>
          ) : role === 'LANDLORD' ? (
            <>
              <h2 className="text-3xl font-bold mb-4">List Your Property Today</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Start earning rent by listing your property. Reach thousands of potential tenants.
              </p>
              <Link
                href="/landlord/properties/create"
                className="inline-block bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                List New Property
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Find Your Perfect Home</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Browse hundreds of properties and find the one that feels like home.
              </p>
              <Link
                href="/tenant/properties"
                className="inline-block bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}