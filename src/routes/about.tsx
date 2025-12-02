import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="max-w-7xl mx-auto text-center">
      <h1 class="text-7xl p-16">About this Webapp</h1>
      <p class="mt-8">
        Visit{" "}
        <a href="https://github.com/Peter-WebDev" class="hover:underline">
          github.com/Peter-WebDev
        </a>{" "}
        to learn how I built this Solid app.
      </p>
      <p class="my-4">
        <A href="/" class="hover:underline">
          Home
        </A>
      </p>
    </main>
  );
}
