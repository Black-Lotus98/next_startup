import 'server-only';

import { type Locale } from '@/config/i18n';
import { localePathname } from './utils';

/**
 * Creates a localized pathname using the locale from cookies (server-side)
 * @param pathname - The pathname to localize (e.g., '/dashboard' or 'dashboard')
 * @returns Localized pathname (e.g., '/en/dashboard')
 * 
 * @example
 * // In a server component
 * const path = await localizedPath('/dashboard'); // '/en/dashboard' or '/ar/dashboard'
 */
export async function localizedPath(pathname: string): Promise<string> {
  const { getLocaleFromCookie } = await import('./cookies');
  const locale = await getLocaleFromCookie();
  return localePathname(locale, pathname);
}

