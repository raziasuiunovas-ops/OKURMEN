import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude API routes, Next.js internals, and static files from next-intl
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/(ky|ru|en)/:path*'],
};
