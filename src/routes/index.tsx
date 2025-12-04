import { A } from "@solidjs/router";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main class="max-w-7xl mx-auto text-center px-8">
      <section class="py-12">
        <header>  
          <h1>Dshbloks</h1>
          <div class="flex flex-col items-center gap-4 pt-8">
            <Button>Just a button</Button>
            <A href="/about">
              About
            </A>
          </div>
        </header>
      </section>
    </main>
  );
}
