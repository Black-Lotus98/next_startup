import 'server-only';

import axios from 'axios';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

/**
 * Creates a server-side Axios instance with the access token from cookies.
 * Use this inside Server Components and Route Handlers for authenticated requests.
 *
 * @example
 * const api = await createServerClient();
 * const { data } = await api.get('/courses');
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  return axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
}
