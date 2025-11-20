import 'server-only';

import { cookies } from 'next/headers';
import { type Locale, defaultLocale, locales } from '@/config/i18n';

const LOCALE_COOKIE_NAME = 'locale';

/**
 * Gets the locale from cookies (server-side)
 * Falls back to defaultLocale if not found
 */
export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME);
  
  if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
    return localeCookie.value as Locale;
  }
  
  return defaultLocale;
}

/**
 * Sets the locale in cookies (server-side)
 */
export async function setLocaleCookie(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    httpOnly: true,
  });
}

