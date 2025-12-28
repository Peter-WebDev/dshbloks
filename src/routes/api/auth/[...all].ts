import { toSolidStartHandler } from 'better-auth/solid-start';
import { auth } from '~/lib/auth';

const handler = toSolidStartHandler(auth);

export const GET = async (event: any) => {
  console.log('[auth] GET', event?.request?.url);
  return handler.GET?.(event);
};

export const POST = async (event: any) => {
  console.log('[auth] POST', event?.request?.url);
  return handler.POST?.(event);
};

// Hantera preflight / OPTIONS så den inte returnerar 404
export const OPTIONS = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
