import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { signOut, useSession } from "~/lib/auth-client";

export default function Home() {
  const session = useSession();

  return (
    <main class="max-w-7xl mx-auto text-center px-8">
      <section class="py-12">
        <Show
          when={session().data?.user}
          fallback={
            <div class="space-y-4">
              <h1>Welcome to Dshbloks</h1>
              <p>Please sign in to continue</p>
              <div class="flex flex-col items-center gap-4 pt-8">
                <Button>Just a button</Button>
                <A href="/login">
                  Sign In
                </A>
              </div>
            </div>
          }
        >
          <div class="space-y-4">
            <h1 class="text-4xl font-bold">Welcome, {session().data?.user.name}!</h1>
            <p>Email: {session().data?.user.email}</p>
            <Button
              onClick={() => signOut()}
              variant="link"
            >
              Sign Out
            </Button>
          </div>
        </Show>
      </section>
    </main>
  );
}
