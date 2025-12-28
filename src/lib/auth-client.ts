import { createAuthClient } from 'better-auth/solid';
export const { signIn, signOut, signUp, changePassword, useSession } =
  createAuthClient({
    baseURL:
      typeof window !== 'undefined'
        ? `${window.location.origin}/api/auth`
        : process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  });
