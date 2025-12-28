import { createAuthClient } from 'better-auth/solid';

export const {
  signIn,
  signOut,
  signUp,
  changePassword,
  useSession,
  getSession,
} = createAuthClient({
  baseURL: 'https://dshbloks.popjosef.se',
  basePath: '/api/auth',
});
