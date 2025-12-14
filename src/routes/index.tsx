import { A } from "@solidjs/router";
import { onMount, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { showToast } from "~/components/ui/toast";
import { signOut, useSession } from "~/lib/auth-client";

export default function Home() {
  const session = useSession();

  onMount(() => {
    const pendingToast = sessionStorage.getItem("pendingToast");
    if (pendingToast) {
      const toastData = JSON.parse(pendingToast);
      showToast(toastData);
      sessionStorage.removeItem("pendingToast");
    }
  });

  return (
    <main class="max-w-7xl mx-auto text-center px-8">
      <section class="py-12">
        <Show when={session().isPending}>
          <p>Loading...</p>
        </Show>
        <Show when={!session().isPending && !session().data?.user}>
          <div class="space-y-4">
            <h1>Welcome to Dshbloks</h1>
            <p>Please sign in to continue</p>
            <div class="flex flex-col items-center gap-4 pt-8">
              <A href="/sign-in">Sign In</A>
              <A href="/sign-up">Sign Up</A>
            </div>
          </div>
        </Show>
        <Show when={!session().isPending && session().data?.user}>
          <div class="space-y-4">
            <h1 class="text-4xl font-bold">Welcome, {session().data?.user.name}!</h1>
            <p>Email: {session().data?.user.email}</p>
            <Button
              onClick={() => signOut()}
              variant="default"
            >
              Sign Out
            </Button>
          </div>
        </Show>
      </section>
    </main>
  );
}
