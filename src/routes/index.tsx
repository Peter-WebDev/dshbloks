import {
  createDroppable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  useDragDropContext
} from "@thisbeyond/solid-dnd";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import AppDrawer from "~/components/app-drawer";
import Dropdown from "~/components/app-menu";
import { AppSidebar } from "~/components/app-sidebar";
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


// Slot komponent som är droppable
const Slot = (props: { id: string; content?: string }) => {
  const droppable = createDroppable(props.id);

  return (
    <div
      use:droppable
      class="droppable bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[200px] flex items-center justify-center transition-colors"
      classList={{
        "!border-green-500 !bg-green-50": droppable.isActiveDroppable
      }}
    >
      {props.content ? (
        <div class="text-center">
          <div class="text-4xl mb-2 text-primary-foreground">{props.content}</div>
          <div class="text-sm text-gray-600">Slot {props.id}</div>
        </div>
      ) : (
        <div class="text-gray-400 text-center">
          <div class="text-2xl mb-2">📦</div>
          <div class="text-sm">Drop widget here</div>
          <div class="text-xs">Slot {props.id}</div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const isMobile = useIsMobile();
  const { slots } = useApp();

  // State för att hålla koll på vad som finns i varje slot
  const [slotContents, setSlotContents] = createSignal<Record<string, string>>({});

  const onDragEnd = (event: any) => {
    const draggedId = event.draggable?.id; // t.ex. "template:clock"
    const droppableId = event.droppable?.id; // t.ex. "slot-1"

    if (draggedId && droppableId) {
      console.log(`Dropped ${draggedId} into ${droppableId}`);

      // Extrahera template info från ID
      const templateId = draggedId.replace("template:", "");

      // Uppdatera slot content
      setSlotContents(prev => ({
        ...prev,
        [droppableId]: templateId
      }));

      showToast({
        title: "Widget added!",
        description: `Added ${templateId} to ${droppableId}`,
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
            {/* Slots grid */}
            <div>
              <h2>Dashboard Slots</h2>
              <p>Current dashboard:</p>
              <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <For each={[0, 1, 2, 3, 4, 5]}>
                  {(index) => (
                    <Slot
                      id={`slot-${index}`}
                      content={slotContents()[`slot-${index}`]}
                    />
                  )}
                </For>
              </div>
            </div>

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

                return (template ? (
                  <div class="draggable bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex flex-col items-center">
                    <div class="text-4xl mb-2">{template.icon}</div>
                    <div class="font-medium">{template.name || "Dragging..."}</div>
                  </div>
                ) : null);

              })()}
            </DragOverlay>
          </SidebarInset>
        </SidebarProvider>
      </DragDropProvider>
    </main>
  );
}