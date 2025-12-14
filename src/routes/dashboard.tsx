import { Show } from "solid-js";
import { useSession } from "~/lib/auth-client";

export default function Dashboard() {
    const session = useSession();

    return (
        <main class="min-h-screen p-6">
            <h1>Dashboard</h1>
            <p>
                Welcome, <strong>
                    <Show when={!session().isPending} fallback="loading...">
                        {session().data?.user.name}
                    </Show>
                </strong>
            </p>
            <p>
                Email: <Show when={!session().isPending} fallback="loading...">
                    {session().data?.user.email}
                </Show>
            </p>
        </main>
    );
}