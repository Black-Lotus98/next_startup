import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './i18n';

// Add new directories here as you create them
const pageDirectories = ['home', 'common'] as const;

// Type for translation messages (supports nested objects)
type TranslationMessages = Record<string, Record<string, string | Record<string, string>>>;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
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
