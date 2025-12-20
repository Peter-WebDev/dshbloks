import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  useDragDropContext
} from "@thisbeyond/solid-dnd";
import { createEffect, For, onMount, Show } from "solid-js";
import AppDrawer from "~/components/app-drawer";
import Dropdown from "~/components/app-menu";
import { AppSidebar } from "~/components/app-sidebar";
import Slot from "~/components/slot";
import { SidebarInset, SidebarProvider, SidebarTrigger, useIsMobile, useSidebar } from "~/components/ui/sidebar";
import { showToast } from "~/components/ui/toast";
import { useApp } from "~/lib/store";
import { WIDGET_TEMPLATES } from "~/lib/types";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      draggable: boolean;
      droppable: boolean;
    }
  }
};

const SidebarSync = () => {
  const { open } = useSidebar();
  const { setSidebarOpen } = useApp();
  createEffect(() => setSidebarOpen(open()));
  return null;
};

export default function Home() {
  const isMobile = useIsMobile();
  const { slots, sidebarOpen, setSlotWidget } = useApp();

  const onDragEnd = (event: any) => {
    const draggedId = event.draggable?.id; // t.ex. "template:clock"
    const droppableId = event.droppable?.id; // t.ex. "slot-1"

    if (draggedId && droppableId) {
      console.log(`Dropped ${draggedId} into ${droppableId}`);

      // Extrahera template info från ID
      const templateId = draggedId.replace("template:", "");
      const template = WIDGET_TEMPLATES.find(t => t.id === templateId);

      if (!template) {
        console.error("Template not found:", templateId);
        return;
      }

      // Create widget instance (unsaved)
      const newWidget = {
        id: crypto.randomUUID(),
        type: template.type || templateId,
        title: template.name || null,
        config: template.defaultConfig,
        order: parseInt(droppableId.replace("slot-", "")),
        saved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dashboardId: "default",
      };

      setSlotWidget(droppableId, newWidget);

      showToast({
        title: "Widget added!",
        description: `Configure your ${template.name} widget`,
      });
    }
  };

  onMount(() => {
    console.log("Current slots:", slots());
    const pendingToast = sessionStorage.getItem("pendingToast");
    if (pendingToast) {
      const toastData = JSON.parse(pendingToast);
      showToast(toastData);
      sessionStorage.removeItem("pendingToast");
    }
  });

  const hasSavedWidgets = () => slots().some(slot => slot.widget?.saved);

  return (
    <main class="mx-auto px-4">
      <DragDropProvider onDragEnd={onDragEnd}>
        <DragDropSensors />
        <SidebarProvider>
          <SidebarSync />
          <AppSidebar />
          <SidebarInset>
            <header class="flex justify-between shrink-0 items-start border-b py-4 bg-background sticky top-0 z-10">
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

            {/* Welcome message */}
            <Show when={!hasSavedWidgets() && !sidebarOpen()}>
              <div class="flex items-center justify-center min-h-[60vh]">
                <div class="text-center">
                  <h2 class="mb-4">Welcome to Dshbloks</h2>
                  <p class="text-muted-foreground mb-6">
                    Get started by opening the sidebar and adding your first widget
                  </p>
                  <div class="text-6xl">📊</div>
                </div>
              </div>
            </Show>

            {/* Slots grid */}
            <Show when={sidebarOpen() || hasSavedWidgets()}>
              <div class="py-8">
                <h2 class="mb-4">Dashboard</h2>
                <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <For each={slots()}>
                    {(slot) => (
                      <Show when={sidebarOpen() || slot.widget?.saved}>
                        <Slot slot={slot} sidebarOpen={sidebarOpen()} />
                      </Show>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            <DragOverlay>
              {(() => {
                const context = useDragDropContext();
                if (!context) return null;

                const [state] = context;
                const activeId = state?.active?.draggable?.id;
                if (!activeId) return null;

                const templateId = activeId.toString().replace("template:", "");
                const template = WIDGET_TEMPLATES.find(t => t.id === templateId);
                if (!template) return null;

                return (
                  <div class="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex flex-col items-center">
                    <div class="text-4xl mb-2">{template.icon}</div>
                    <div class="font-medium">{template.name || "Dragging..."}</div>
                  </div>
                );
              })()}
            </DragOverlay>
          </SidebarInset>
        </SidebarProvider>
      </DragDropProvider>
    </main>
  );
}