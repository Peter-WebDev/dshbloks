import { A } from "@solidjs/router";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main class="max-w-7xl mx-auto text-center">
      <h1 class="text-7xl p-16">Dshbloks</h1>
      <div class="flex flex-col items-center gap-4">
        <Button>Just a button</Button>
        <A href="/about" class="hover:underline">
          About
        </A>
      </div>
    </main>
  );
}
