'use client';

import { useParams } from 'next/navigation';
import { type Locale, defaultLocale } from '@/config/i18n';
import { localePathname } from '@/lib/utils';

/**
 * Hook that provides a function to create localized pathnames
 * Automatically uses the current locale from the URL params
 * 
 * @returns Function that takes a pathname and returns localized pathname
 * 
 * @example
 * const getLocalizedPath = useLocalizedPathname();
 * <Link href={getLocalizedPath('/dashboard')}>Dashboard</Link>
 */
export function useLocalizedPathname() {
  const params = useParams();
  const locale = (params.local as Locale) || defaultLocale;

  return (pathname: string): string => {
    return localePathname(locale, pathname);
  };
}

