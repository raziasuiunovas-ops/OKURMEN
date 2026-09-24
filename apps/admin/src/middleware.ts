import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth pages
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }

  // Check if accessing admin routes
  if (pathname.startsWith('/admin') || pathname === '/') {
    // Check for auth token cookie
    const token = request.cookies.get('auth-token');

    if (!token) {
      // Redirect to signin
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
