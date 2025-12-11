// Note: Next.js 16 shows a deprecation warning about middleware.ts,
// but next-intl requires this file. This is expected and safe to ignore.
// The warning will be resolved when next-intl updates to support Next.js 16's new proxy convention.
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './config/i18n';

const LOCALE_COOKIE_NAME = 'locale';
const SUPPORTED_LOCALES = locales as readonly string[];

/**
 * Extracts locale from pathname (e.g., '/en/dashboard' -> 'en')
 */
function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment)) {
    return firstSegment as Locale;
  }

  return null;
}

/**
 * Removes locale from pathname (e.g., '/en/dashboard' -> '/dashboard')
 */
function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;

  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
  return pathWithoutLocale;
}

/**
 * Detects locale from Accept-Language header or cookie
 */
function detectLocale(request: NextRequest): Locale {
  // Check cookie first
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Parse Accept-Language header (e.g., "en-US,en;q=0.9,ar;q=0.8")
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [locale] = lang.trim().split(';');
        return locale.split('-')[0].toLowerCase(); // Extract base locale (e.g., 'en' from 'en-US')
      });

    // Find first supported locale
    for (const lang of languages) {
      if (SUPPORTED_LOCALES.includes(lang)) {
        return lang as Locale;
      }
    }
  }

  // Fallback to default locale
  return defaultLocale;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Get locale from URL
  const localeFromPath = getLocaleFromPathname(pathname);

  // If no locale in URL, redirect to detected/default locale
  if (!localeFromPath) {
    const detectedLocale = detectLocale(request);
    const url = request.nextUrl.clone();
    // Ensure pathname starts with locale
    url.pathname = pathname === '/' ? `/${detectedLocale}` : `/${detectedLocale}${pathname}`;
    
    // Preserve search params if any
    url.search = request.nextUrl.search;
    
    const response = NextResponse.redirect(url, 307);
    // Set locale cookie
    response.cookies.set(LOCALE_COOKIE_NAME, detectedLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: true,
    });
    // Set header for next-intl
    response.headers.set('x-next-intl-locale', detectedLocale);
    return response;
  }

  // Validate locale - if invalid, redirect to default locale
  if (!SUPPORTED_LOCALES.includes(localeFromPath)) {
    const url = request.nextUrl.clone();
    const pathWithoutLocale = removeLocaleFromPathname(pathname);
    url.pathname = `/${defaultLocale}${pathWithoutLocale}`;
    
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE_NAME, defaultLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: true,
    });
    response.headers.set('x-next-intl-locale', defaultLocale);
    return response;
  }

  // Valid locale in path - continue with request
  const response = NextResponse.next();
  
  // Set locale cookie
  response.cookies.set(LOCALE_COOKIE_NAME, localeFromPath, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    httpOnly: true,
  });
  
  // Set header for next-intl to read the locale
  response.headers.set('x-next-intl-locale', localeFromPath);
  // Set pathname header for layouts to read
  response.headers.set('x-pathname', pathname);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next (Next.js internals)  
     * - files with extensions (e.g., .ico, .png, .jpg)
     * 
     * Explicit patterns that work with Next.js 16 + Turbopack
     */
    '/',
    '/((?!api|_next|.*\\..*).*)',
  ],
};
