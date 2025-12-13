import { redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { auth } from "../auth";

export async function requireUser() {
    const event = getRequestEvent();
    if (!event) return null;

    // Better Auth: session from request headers
    const session = await auth.api.getSession({
        headers: event.request.headers,
    });

    if (!session?.user) {
        const url = new URL(event.request.url);
        const next = encodeURIComponent(url.pathname + url.search);
        throw redirect(`/sign-in?next=${next}`);
    }

    return session;
}