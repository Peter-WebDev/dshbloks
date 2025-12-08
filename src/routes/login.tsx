import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { signIn, signUp } from "~/lib/auth-client";

export default function Login() {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [name, setName] = createSignal("");
    const [isSignUp, setIsSignUp] = createSignal(false);
    const [error, setError] = createSignal("");
    const navigate = useNavigate();

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError("");

        try {
            if (isSignUp()) {
                await signUp.email({
                    email: email(),
                    password: password(),
                    name: name(),
                });
            } else {
                await signIn.email({
                    email: email(),
                    password: password(),
                });
            }
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
        }
    };

    return (
        <main class="min-h-screen flex items-center justify-center">
            <div class="max-w-md w-full space-y-8 p-8 rounded-lg shadow">
                <div>
                    <h2 class="text-3xl font-bold text-center">
                        {isSignUp() ? "Create Account" : "Sign In"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} class="space-y-6">
                    {isSignUp() && (
                        <div>
                            <label for="name" class="block text-sm font-medium">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required={isSignUp()}
                                value={name()}
                                onInput={(e) => setName(e.currentTarget.value)}
                                class="mt-1 block w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                    )}

                    <div>
                        <label for="email" class="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email()}
                            onInput={(e) => setEmail(e.currentTarget.value)}
                            class="mt-1 block w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password()}
                            onInput={(e) => setPassword(e.currentTarget.value)}
                            class="mt-1 block w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    {error() && (
                        <div class="text-red-600 text-sm">{error()}</div>
                    )}
                    <div class="flex flex-col gap-4">
                        <Button
                            type="submit"
                            variant="default"
                        >
                            {isSignUp() ? "Sign Up" : "Sign In"}
                        </Button>

                        <Button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp())}
                            variant="secondary"
                        >
                            {isSignUp()
                                ? "Already have an account? Sign in"
                                : "Don't have an account? Sign up"}
                        </Button>
                    </div>

                </form>
            </div>
        </main>
    );
}