import { createAuthClient } from 'better-auth/solid';
export const { signIn, signOut, signUp, changePassword, useSession } =
  createAuthClient({
    baseURL:
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000',
  });
