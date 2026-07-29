import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/properties', '/properties/:path*', '/auth/login', '/auth/register'];
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes(':path*')) {
      const baseRoute = route.replace('/:path*', '');
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });

  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Redirect to login if trying to access protected route without token
  if (!token && (isDashboardRoute || (!isPublicRoute && !isAuthRoute))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect to home if trying to access auth routes while logged in
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role-based dashboard redirection
  if (token && isDashboardRoute) {
    const userCookie = request.cookies.get('user')?.value;
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        const requestedRole = pathname.split('/')[2]; // 'tenant', 'landlord', 'admin'
        
        if (user.role.toLowerCase() !== requestedRole) {
          return NextResponse.redirect(new URL(`/dashboard/${user.role.toLowerCase()}`, request.url));
        }
      } catch {
        // Invalid user cookie, redirect to login
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/properties/:path*',
    '/auth/:path*',
    '/dashboard/:path*',
    '/payment/:path*',
  ],
};