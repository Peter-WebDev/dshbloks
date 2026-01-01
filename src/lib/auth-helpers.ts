import { redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { auth } from './auth';

export async function getSession() {
  'use server';
  const event = getRequestEvent();
  if (!event) return null;

  try {
    // Försök klona request (fungerar oftast)
    const clonedRequest = event.request.clone();
    return await auth.api.getSession({
      headers: clonedRequest.headers,
    });
  } catch (error) {
    // Om kloning misslyckas (t.ex. vid server actions), använd headers direkt
    console.warn(
      'Request clone failed, falling back to direct headers:',
      error
    );
    try {
      return await auth.api.getSession({
        headers: event.request.headers,
      });
    } catch (fallbackError) {
      console.error('Failed to get session:', fallbackError);
      return null;
    }
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
    const clonedRequest = event.request.clone();
    return await auth.api.signOut({
      headers: clonedRequest.headers,
    });
  } catch (error) {
    console.warn(
      'Request clone failed for signOut, falling back to direct headers:',
      error
    );
    try {
      return await auth.api.signOut({
        headers: event.request.headers,
      });
    } catch (fallbackError) {
      console.error('Error revoking session:', fallbackError);
      return null;
    }
  }
}
