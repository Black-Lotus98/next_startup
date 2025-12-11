import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { locales, defaultLocale, type Locale } from './i18n';

// Add new directories here as you create them
const pageDirectories = ['home', 'common'] as const;

// Type for translation messages (supports nested objects)
type TranslationMessages = Record<string, Record<string, string | Record<string, string>>>;

export default getRequestConfig(async ({ requestLocale }) => {
  // Try to get locale from requestLocale first (from URL path)
  let locale = await requestLocale;

  // If not found, try to get from header (set by middleware)
  if (!locale) {
    const headersList = await headers();
    const headerLocale = headersList.get('x-next-intl-locale');
    if (headerLocale && locales.includes(headerLocale as Locale)) {
      locale = headerLocale as Locale;
    }
  }

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  // Load all page translations and merge them
  const messages: TranslationMessages = {};

  for (const page of pageDirectories) {
    try {
      // Supports nested objects in JSON files
      const pageMessages = (await import(`../messages/${page}/${locale}.json`)).default as Record<string, string | Record<string, string>>;
      messages[page] = pageMessages;
    } catch (error) {
      console.error(`Failed to load messages for page "${page}" and locale "${locale}":`, error);
    }
  }

  return {
    locale,
    messages
  };
});
