/**
 * Paths after the locale segment (e.g. `/en/home` → `/home`).
 * Used by middleware for auth redirects — keep in sync with your app routes.
 */
export const PROTECTED_PATHS: readonly string[] = [
  '/dashboard',
];

export const AUTH_PATHS: readonly string[] = ['/auth'];
