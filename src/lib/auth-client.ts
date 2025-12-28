import { createAuthClient } from 'better-auth/solid';
export const { signIn, signOut, signUp, changePassword, useSession } =
  createAuthClient({
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'https://dshbloks.popjosef.se'
        : 'http://localhost:3000',
  });
