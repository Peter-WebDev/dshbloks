import {
  createDraggable,
  createDroppable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
} from "@thisbeyond/solid-dnd";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import AppDrawer from "~/components/app-drawer";
import Dropdown from "~/components/app-menu";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger, useIsMobile, useSidebar } from "~/components/ui/sidebar";
import { showToast } from "~/components/ui/toast";
import { useApp } from "~/lib/store";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      draggable: boolean;
      droppable: boolean;
    }
  }
};

// Typa props för Droppable
interface DroppableProps {
  children: any;
}

const SidebarSync = () => {
  const { open } = useSidebar();
  const { setSidebarOpen } = useApp();
  createEffect(() => setSidebarOpen(open()));
  return null;
};


// Enkel draggable komponent (från ditt exempel)
const Draggable = () => {
  const draggable = createDraggable(1);
  return (
    <div
      use:draggable
      class="draggable cursor-grab bg-blue-200 p-4 m-2 rounded border"
      classList={{ "opacity-25": draggable.isActiveDraggable }}
    >
      Draggable
    </div>
  );
};

// Enkel droppable komponent (från ditt exempel)
const Droppable = (props: DroppableProps) => {
  const droppable = createDroppable(1);
  return (
    <div
      use:droppable
      class="droppable bg-gray-200 p-4 m-2 rounded border min-h-32"
      classList={{ "!droppable-accept": droppable.isActiveDroppable }}
    >
      Droppable. {props.children}
    </div>
  );
};

// DragOverlayExample komponent (direkt från ditt exempel)
const DragOverlayExample = () => {
  const [where, setWhere] = createSignal("outside");

  const onDragEnd = (event: any) => {
    const droppable = event?.droppable;
    if (droppable) {
      setWhere("inside");
    } else {
      setWhere("outside");
    }
  };

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <DragDropSensors />
      <div class="p-8 min-h-15">
        <h2>Simple Drag and Drop Test</h2>
        <Show when={where() === "outside"}>
          <Draggable />
        </Show>
        <Droppable>
          <Show when={where() === "inside"}>
            <Draggable />
          </Show>
        </Droppable>
        <DragOverlay>
          <div class="draggable bg-red-200 p-2 rounded">Drag Overlay!</div>
        </DragOverlay>
      </div>
    </DragDropProvider>
  );
};

export default function Home() {
  const isMobile = useIsMobile();
  const { slots } = useApp();

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
    <main class="mx-auto px-8">
      <SidebarProvider>
        <SidebarSync />
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
          <DragOverlayExample />
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}