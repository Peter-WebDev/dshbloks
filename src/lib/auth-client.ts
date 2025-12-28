import { createAuthClient } from 'better-auth/solid';

const baseURL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/auth`
    : process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

export const { signIn, signOut, signUp, changePassword, useSession } =
  createAuthClient({
    baseURL,
    basePath: '/api/auth',
  });
