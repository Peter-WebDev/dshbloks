// src/middleware.ts
import { createMiddleware } from '@solidjs/start/middleware';
import { auth } from '../lib/auth';

export default createMiddleware({
  onRequest: [
    async (event) => {
      const url = new URL(event.request.url);

      // Skip middleware for server actions and api routes
      if (
        url.pathname.startsWith('/_server') ||
        url.pathname.startsWith('/api/')
      ) {
        return;
      }

      const protectedPaths = ['/dashboard', '/account'];
      const isProtected = protectedPaths.some((path) =>
        url.pathname.startsWith(path)
      );

      if (isProtected) {
        try {
          const session = await auth.api.getSession({
            headers: event.request.headers,
          });

          if (!session) {
            return new Response(null, {
              status: 302,
              headers: {
                location: new URL('/sign-in', event.request.url).toString(),
              },
            });
          }
        } catch (error) {
          console.error('Auth middleware error:', error);
        }
      }
    },
  ],
});
