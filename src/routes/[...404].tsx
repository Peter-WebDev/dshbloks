import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="flex flex-col items-center justify-center min-h-svh text-center mx-auto p-4">
      <img src="/apple-touch-icon.png" alt="" />
      <h1>Not Found</h1>
      <p class="text-sm">The page you are looking for seems to have dashed away.</p>
      <A href="/">
        Home
      </A>
    </main>
  );
}
