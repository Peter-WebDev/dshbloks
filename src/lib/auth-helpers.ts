import { redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { auth } from './auth';

export async function getSession() {
  'use server';
  const event = getRequestEvent();
  if (!event) return null;

  return await auth.api.getSession({
    headers: event.request.mode === 'same-origin' ? event.request.headers : {},
  });
}

export async function requireAuth() {
  'use server';
  const session = await getSession();

  if (!session || !session.user) {
    throw redirect('/sign-in');
  }

  return session;
}
