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
  // Let next-intl middleware handle the redirect first
  const response = intlMiddleware(request);
  
  // Extract locale from the final URL (after redirect if applicable)
  let locale: string | null = null;
  
  // Check if this is a redirect response
  const isRedirect = response.status === 307 || response.status === 308;
  
  if (isRedirect) {
    // Extract locale from redirect location
    const location = response.headers.get('location');
    if (location) {
      try {
        const redirectUrl = new URL(location, request.url);
        const segments = redirectUrl.pathname.split('/').filter(Boolean);
        const potentialLocale = segments[0];
        if (potentialLocale && locales.includes(potentialLocale as typeof locales[number])) {
          locale = potentialLocale;
        }
      } catch {
        // Invalid URL, skip
      }
    }
  } else {
    // Extract locale from current pathname
    const pathname = request.nextUrl.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const potentialLocale = segments[0];
    if (potentialLocale && locales.includes(potentialLocale as typeof locales[number])) {
      locale = potentialLocale;
    }
  }
  
  // Set locale cookie if we found a valid locale
  if (locale) {
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
  // Note: The pattern explicitly includes '/' to match root path
  matcher: [
    '/',
    '/((?!api|_next|.*\\..*).*)'
  ]
};

