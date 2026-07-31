'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Search,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Building2,
  CreditCard,
  Bell,
  UserCircle,
  ChevronDown,
  Inbox,
  PlusCircle,
} from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/tenant/properties', label: 'Browse', icon: Search },
  ];

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    switch (user.role) {
      case 'TENANT':
        return '/tenant/dashboard';
      case 'LANDLORD':
        return '/landlord/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Role-based navigation items
  const getRoleBasedLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'TENANT':
        return [
          { href: '/tenant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/tenant/rentals', label: 'My Rentals', icon: Building2 },
          { href: '/tenant/payments', label: 'Payments', icon: CreditCard },
        ];
      case 'LANDLORD':
        return [
          { href: '/landlord/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/landlord/properties', label: 'My Properties', icon: Building2 },
          { href: '/landlord/requests', label: 'Requests', icon: Inbox },
          { href: '/landlord/properties/create', label: 'Add Property', icon: PlusCircle },
        ];
      case 'ADMIN':
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/admin/users', label: 'Users', icon: User },
          { href: '/admin/properties', label: 'Properties', icon: Building2 },
        ];
      default:
        return [];
    }
  };

  const roleLinks = getRoleBasedLinks();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Rent<span className="text-blue-600">Nest</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive(href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth */}
          <div className="flex items-center gap-3">
            {mounted && (
              <>
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-gray-700">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                              {user?.role}
                            </span>
                          </div>

                          {/* Role-based links in dropdown */}
                          {roleLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <link.icon className="w-4 h-4" />
                              {link.label}
                            </Link>
                          ))}

                          {/* Divider if there are role links */}
                          {roleLinks.length > 0 && (
                            <div className="border-t border-gray-100 my-1" />
                          )}

                          {/* Quick Actions based on role */}
                          {user?.role === 'LANDLORD' && (
                            <Link
                              href="/landlord/properties/create"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <PlusCircle className="w-4 h-4" />
                              List New Property
                            </Link>
                          )}

                          {user?.role === 'TENANT' && (
                            <Link
                              href="/tenant/properties"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Search className="w-4 h-4" />
                              Browse Properties
                            </Link>
                          )}

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && mounted && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {/* Main nav links */}
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                    isActive(href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  
                  {/* Role-based mobile links */}
                  {roleLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}

                  {/* Quick actions for mobile */}
                  {user?.role === 'LANDLORD' && (
                    <Link
                      href="/landlord/properties/create"
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <PlusCircle className="w-5 h-5" />
                      List New Property
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg text-center hover:shadow-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;