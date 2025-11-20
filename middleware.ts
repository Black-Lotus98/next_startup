// Note: Next.js 16 shows a deprecation warning about middleware.ts,
// but next-intl requires this file. This is expected and safe to ignore.
// The warning will be resolved when next-intl updates to support Next.js 16's new proxy convention.
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/config/i18n';
import type { NextRequest } from 'next/server';

const LOCALE_COOKIE_NAME = 'locale';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL: /en/..., /ar/...
  localeDetection: true // Detect locale from Accept-Language header
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  
  // Extract locale from URL path
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] || defaultLocale;
  
  // Set locale cookie if it's a valid locale
  if (locales.includes(locale as typeof locales[number])) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: true,
    });
  }
  
  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - files with extensions (e.g. .ico, .png)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

