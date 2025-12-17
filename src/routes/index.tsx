import { For, onMount, Show } from "solid-js";
import AppDrawer from "~/components/app-drawer";
import Dropdown from "~/components/app-menu";
import { AppSidebar } from "~/components/app-sidebar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger, useIsMobile } from "~/components/ui/sidebar";
import { showToast } from "~/components/ui/toast";

const widgets = [
  { id: 1, name: "Widget name" },
  { id: 2, name: "Widget name" },
  { id: 3, name: "Widget name" },
  { id: 4, name: "Widget name" },
  { id: 5, name: "Widget name" },
  { id: 6, name: "Widget name" },
];

export default function Home() {
  const isMobile = useIsMobile();

  onMount(() => {
    const pendingToast = sessionStorage.getItem("pendingToast");
    if (pendingToast) {
      const toastData = JSON.parse(pendingToast);
      showToast(toastData);
      sessionStorage.removeItem("pendingToast");
    }
  });

  return (
    <main class="mx-auto px-8">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header class="flex justify-between shrink-0 items-start border-b py-4 sticky top-0 bg-background z-10">
            <Show when={!isMobile()}>
              <SidebarTrigger class="-ml-1" type="button" variant="default" size="icon" />
            </Show>
            <Show when={isMobile()}>
              <div class="flex items-center gap-2">
                <AppDrawer />
                <Dropdown />
              </div>
            </Show>
            <div class="flex flex-col items-end">
              <h1>Dshbloks</h1>
              <span>Information in a dash</span>
            </div>
          </header>
          <section>
            <div class="grid grid-cols-[repeat(auto-fit,minmax(min(350px,100%),1fr))] mx-auto min-h-svh gap-6 py-8">
              <For each={widgets}>{(widget) => (
                <Card class="w-full flex flex-col justify-between bg-accent">
                  <CardHeader>
                    <div class="flex flex-col gap-2">
                      <h2>{widget.name}</h2>
                      <Separator />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>This is a placeholder for a widget.</p>
                  </CardContent>
                  <CardFooter class="flex gap-2 justify-center">
                    <Button variant="default" size="icon">⚙</Button>
                    <Button variant="destructive" size="icon">🗑</Button>
                  </CardFooter>
                </Card>
              )}
              </For>
            </div>
          </section>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
