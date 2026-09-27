import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем наличие auth токена
  const authToken = request.cookies.get('auth-token')?.value;

  // Публичные пути (signin, signup)
  const isPublicPath = pathname.startsWith('/auth');

  // Если нет токена и путь не публичный - редирект на signin
  if (!authToken && !isPublicPath) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Если есть токен и пользователь на странице входа - редирект в dashboard
  if (authToken && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.svg|logo-dark.svg).*)'],
};
