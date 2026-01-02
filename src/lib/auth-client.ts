import { createAuthClient } from 'better-auth/solid';
export const {
  signIn,
  signOut,
  signUp,
  changePassword,
  useSession,
  deleteUser,
} = createAuthClient({});
