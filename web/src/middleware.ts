import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Every path except API routes, Next.js internals and files (anything with a dot),
  // so a link without a locale such as /guide/x360ce gets one added
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};