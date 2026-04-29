import { z } from 'zod';

// Public env vars — safe to use in client and server components
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),
});

// Server-only env vars — never exposed to the client bundle
const serverEnvSchema = z.object({
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_ALGORITHM: z.string().min(1, 'JWT_ALGORITHM is required'),
  ENCRYPTION_KEY: z.string().min(1, 'ENCRYPTION_KEY is required'),
});

const parsedPublic = publicEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsedPublic.success) {
  console.error('❌ Invalid public environment variables:', parsedPublic.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. Check your .env.local file.');
}

export const env = parsedPublic.data;

// Server env — only validated and exported on the server
// Importing this in a client component will throw at build time
export function getServerEnv() {
  const parsedServer = serverEnvSchema.safeParse({
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ALGORITHM: process.env.JWT_ALGORITHM,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  });

  if (!parsedServer.success) {
    console.error('❌ Invalid server environment variables:', parsedServer.error.flatten().fieldErrors);
    throw new Error('Invalid server environment variables. Check your .env.local file.');
  }

  return parsedServer.data;
}
