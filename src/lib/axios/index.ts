// Client-safe exports only.
// Import createServerClient directly from '@/lib/axios/server' in Server Components.
export { apiClient } from './client';
export { saveTokens, clearTokens, getAccessToken, getRefreshToken } from './token-cookies';
