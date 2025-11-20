"use client";

import { localePathname } from "./utils";
import { getLocaleFromCookieClient } from "./cookies-client";

/**
 * Creates a localized pathname using the locale from cookies (client-side)
 * @param pathname - The pathname to localize (e.g., '/dashboard' or 'dashboard')
 * @returns Localized pathname (e.g., '/en/dashboard')
 *
 * @example
 * // In a client component
 * const path = localizedPathClient('/dashboard'); // '/en/dashboard' or '/ar/dashboard'
 */
export function localizedPathClient(pathname: string): string {
  const locale = getLocaleFromCookieClient();
  return localePathname(locale, pathname);
}
