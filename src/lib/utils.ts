import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Locale } from "@/config/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // Check if first segment is a valid locale
  if (firstSegment && ['en', 'ar'].includes(firstSegment)) {
    return firstSegment as Locale;
  }
  
  return null;
}

/**
 * Creates a localized pathname with the given locale prefix
 * @param locale - The locale to use (e.g., 'en', 'ar')
 * @param pathname - The pathname to localize (e.g., '/dashboard' or 'dashboard')
 * @returns Localized pathname (e.g., '/en/dashboard')
 * 
 * @example
 * localePathname('en', '/dashboard') // '/en/dashboard'
 * localePathname('ar', 'dashboard') // '/ar/dashboard'
 * localePathname('en', '/en/dashboard') // '/en/dashboard' (removes existing locale)
 */
export function localePathname(locale: Locale, pathname: string): string {
  // Remove leading/trailing slashes and split
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  const segments = cleanPath.split('/').filter(Boolean);
  
  // Remove existing locale prefix if present
  if (segments.length > 0 && ['en', 'ar'].includes(segments[0])) {
    segments.shift();
  }
  
  // Build the localized pathname
  const path = segments.length > 0 ? segments.join('/') : '';
  return path ? `/${locale}/${path}` : `/${locale}`;
}

