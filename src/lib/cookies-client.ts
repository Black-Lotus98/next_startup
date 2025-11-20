'use client';

import { type Locale, defaultLocale, locales } from '@/config/i18n';

const LOCALE_COOKIE_NAME = 'locale';

/**
 * Gets the locale from cookies (client-side)
 * Falls back to defaultLocale if not found
 */
export function getLocaleFromCookieClient(): Locale {
  if (typeof document === 'undefined') {
    return defaultLocale;
  }

  const cookies = document.cookie.split(';');
  const localeCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${LOCALE_COOKIE_NAME}=`)
  );

  if (localeCookie) {
    const locale = localeCookie.split('=')[1]?.trim();
    if (locale && locales.includes(locale as Locale)) {
      return locale as Locale;
    }
  }

  return defaultLocale;
}

