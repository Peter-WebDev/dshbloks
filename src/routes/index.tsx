import { createAsync } from "@solidjs/router";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  useDragDropContext
} from "@thisbeyond/solid-dnd";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import AppDrawer from "~/components/app-drawer";
import Dropdown from "~/components/app-menu";
import { AppSidebar } from "~/components/app-sidebar";
import Slot from "~/components/slot";
import { SidebarInset, SidebarProvider, SidebarTrigger, useIsMobile, useSidebar } from "~/components/ui/sidebar";
import { showToast } from "~/components/ui/toast";
import { getOrCreateDefaultDashboard } from "~/lib/actions/dashboard";
import { useApp } from "~/lib/store";
import { WIDGET_TEMPLATES } from "~/lib/types";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      draggable: boolean;
      droppable: boolean;
    }
  }
}

const SidebarSync = () => {
  const { open } = useSidebar();
  const { setSidebarOpen } = useApp();
  createEffect(() => setSidebarOpen(open()));
  return null;
};

export default function Home() {
  const isMobile = useIsMobile();
  const { slots, sidebarOpen, setSlotWidget } = useApp();

  // Load user's dashboard (or null for guests)
  const dashboard = createAsync(() => getOrCreateDefaultDashboard(), {
    deferStream: true
  });

  const [widgetsLoaded, setWidgetsLoaded] = createSignal(false);

  // Helper for welcome message
  const hasSavedWidgets = () => slots().some(s => s.widget?.saved === true);

  createEffect(() => {
    const dashboardData = dashboard();
    if (dashboardData && !widgetsLoaded()) {
      console.log("Loading widgets from database:", dashboardData);

      dashboardData?.widgets.forEach((widget: any) => {
        const slotId = `slot-${widget.order}`;

        setSlotWidget(slotId, {
          id: widget.id,
          type: widget.type,
          title: widget.title,
          config: widget.config,
          order: widget.order,
          saved: true,
          createdAt: widget.createdAt,
          updatedAt: widget.updatedAt,
          dashboardId: widget.dashboardId,
        });
      });

      setWidgetsLoaded(true);
    }
  });


  // Sync guest session on mount
  onMount(() => {
    const sessionData = sessionStorage.getItem("guest_dashboard");
    const dashboardData = dashboard();

    // If guest and has session data, restore it
    if (sessionData && !dashboardData) {
      try {
        const parsed = JSON.parse(sessionData);
        parsed.forEach((slot: any) => {
          if (slot.widget) {
            setSlotWidget(slot.id, {
              ...slot.widget,
              createdAt: new Date(slot.widget.createdAt),
              updatedAt: new Date(slot.widget.updatedAt)
            });
          }
        });
      } catch (e) {
        console.error("Failed to restore guest session:", e);
      }
    }
  });

  // Save to sessionStorage for guests
  createEffect(() => {
    const dashboardData = dashboard();
    if (!dashboardData) {
      // Guest mode - save to sessionStorage
      sessionStorage.setItem("guest_dashboard", JSON.stringify(slots()));
    }
  });

  const onDragEnd = (event: any) => {
    const draggedId = event.draggable?.id;
    const droppableId = event.droppable?.id;

    if (draggedId && droppableId) {
      const templateId = draggedId.replace("template:", "");
      const template = WIDGET_TEMPLATES.find(t => t.id === templateId);

      if (!template) {
        console.error("Template not found:", templateId);
        return;
      }

      const dashboardData = dashboard();

      // Create widget with dashboard ID (or "guest" for guests)
      const newWidget = {
        id: crypto.randomUUID(),
        type: template.type || templateId,
        title: template.name || null,
        config: template.defaultConfig,
        order: parseInt(droppableId.replace("slot-", "")),
        saved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dashboardId: dashboardData?.id || "guest",
      };

      setSlotWidget(droppableId, newWidget);

      showToast({
        title: "Widget added!",
        description: `Configure your ${template.name} widget`,
      });
    }
  };

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
            <Show when={!sidebarOpen() && !hasSavedWidgets()}>
              <div class="flex items-center justify-center min-h-[60svh]">
                <div class="text-center">
                  <h2 class="mb-4">Welcome to Dshbloks</h2>
                  <p class="text-muted-foreground mb-6">
                    Get started by opening the sidebar and adding your first widget
                  </p>
                  <div class="text-6xl">📊</div>
                </div>
              </div>
            </Show>

            {/* Widgets grid */}
            <Show when={sidebarOpen() || hasSavedWidgets()}>
              <div class="py-8">
                <h2 class="mb-4">Dashboard</h2>
                <div class="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div class="font-medium">{template.name}</div>
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