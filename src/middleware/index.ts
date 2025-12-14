// src/middleware.ts
import { createMiddleware } from "@solidjs/start/middleware";
import { auth } from "../lib/auth";

export default createMiddleware({
  onRequest: [
    async (event) => {
      const url = new URL(event.request.url);
      
      const protectedPaths = ["/dashboard", "/account"];
      const isProtected = protectedPaths.some(path => url.pathname.startsWith(path));

      if (isProtected) {
        const session = await auth.api.getSession({
          headers: event.request.headers,
        });

        if (!session) {
          return Response.redirect(new URL("/sign-in", event.request.url));
        }
      }
    },
  ],
});