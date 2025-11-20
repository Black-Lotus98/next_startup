export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// RTL locales
export const rtlLocales: readonly Locale[] = ['ar'] as const;

// Helper function to check if locale is RTL
export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

