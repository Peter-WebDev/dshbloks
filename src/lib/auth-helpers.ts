import { redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { auth } from './auth';

export async function getSession() {
  'use server';
  const event = getRequestEvent();
  if (!event) return null;

  try {
    // Better Auth behöver hela headers-objektet (inkl. cookies)
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });
    return session;
  } catch (error) {
    console.warn('Failed to get session:', error);
    return null;
  }
}

export async function requireAuth() {
  'use server';
  const session = await getSession();

  if (!session || !session.user) {
    throw redirect('/sign-in');
  }

  return session;
}

export async function revokeCurrentSession() {
  'use server';
  const event = getRequestEvent();
  if (!event) return null;

  try {
    const response = await auth.api.signOut({
      headers: event.request.headers,
    });

    return response;
  } catch (error) {
    console.error('Error revoking session:', error);
    return null;
  }
}
