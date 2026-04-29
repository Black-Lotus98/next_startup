import { type Locale } from '@/config/i18n';

/**
 * Detects the locale from a cookie value or Accept-Language header.
 * Falls back to defaultLocale if neither matches a valid locale.
 */
export function detectLocale(
  cookieLocale: string | undefined,
  acceptLang: string,
  validLocales: readonly Locale[],
  defaultLocale: Locale,
): Locale {
  if (cookieLocale && validLocales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const primaryLanguage = acceptLang
    .split(',')[0]
    ?.split('-')[0]
    ?.trim()
    ?.toLowerCase();

  if (primaryLanguage && validLocales.includes(primaryLanguage as Locale)) {
    return primaryLanguage as Locale;
  }

  return defaultLocale;
}

/**
 * Returns true if pathWithoutLocale matches or is a sub-path of any entry in paths.
 */
export function matchesPath(
  pathWithoutLocale: string,
  paths: readonly string[],
): boolean {
  return paths.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + '/'),
  );
}

/**
 * Strips the locale prefix from a pathname.
 * Returns { locale, pathWithoutLocale } if a valid locale is found, otherwise null.
 */
export function stripLocale(
  pathname: string,
  validLocales: readonly Locale[],
): { locale: Locale; pathWithoutLocale: string } | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment || !validLocales.includes(firstSegment as Locale)) {
    return null;
  }

  return {
    locale: firstSegment as Locale,
    pathWithoutLocale: '/' + segments.slice(1).join('/'),
  };
}
