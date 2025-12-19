import { createStore } from "solid-js/store";
import type { AppState, Dashboard, Slot, WidgetInstance } from "../types";

const [state, setState] = createStore<AppState>({
    currentDashboard: {
        id: "default",
        name: "Default Dashboard",
        userId: "default-user",
        isDefault: true, // True för initiell dashboard
        createdAt: new Date(),
        updatedAt: new Date(),
        slots: Array.from({ length: 6 }, (_, i) => ({
            id: `slot-${i + 1}`,
            widget: null,
        })),
    },
    ui: {
        sidebarOpen: true, // Default edit-läge
    },
});

// Funktioner för dashboard-actions
export const setCurrentDashboard = (dashboard: Dashboard) => {
    setState("currentDashboard", dashboard);
}

export const setSlotWidget = (slotId: string, widget: WidgetInstance | null) => {
  setState("currentDashboard", "slots", (slots) =>
    slots.map((slot) => (slot.id === slotId ? { ...slot, widget } : slot))
  );
};

export const saveSlot = (slotId: string) => {
  setState("currentDashboard", "slots", (slots) =>
    slots.map((slot) =>
        slot.id === slotId && slot.widget ? { ...slot, widget: { ...slot.widget, saved: true } } : slot
    )
  );
  // TODO: Andropa API för att soara till DB
};

export const reorderSlots = (newSlots: Slot[]) => {
  setState("currentDashboard", "slots", newSlots);
};

export const loadDashboard = async (id: string) => {
    // TODO: Hämta dashboard från API mappa widgets till rätt slots baserat på order
    // Exempel: Kontrollera isDefault om det behövs senare

    setState("currentDashboard", {
        id,
        name: "Loaded Dashboard",
        userId: "default-user",
        isDefault: false, // Eller sätt baserat på DB-data
        createdAt: new Date(), // Ersätt med DB-data
        updatedAt: new Date(), // Ersätt med DB-data
        slots: Array.from({ length: 6 }, (_, i) => ({
            id: `slot-${i + 1}`,
            widget: null,
        })),
    });
};

// Funktioner för UI-actions
export const setSidebarOpen = (open: boolean) => {
  setState("ui", "sidebarOpen", open);
};


export const useDashboardStore = () => ({
    state,
    setCurrentDashboard,
    setSlotWidget,
    saveSlot,
    reorderSlots,
    loadDashboard,
    setSidebarOpen,
});


// export type DashboardWithWidgets = Pick<DashboardModel, "name" | "id" | "userId"> & { widgets: BaseWidget[] };

// export function createDashboardStore() {
//     // Implementation of dashboard store
//     const [currentDashboard, setCurrentDashboard] = createSignal<DashboardWithWidgets | null>(null);

//     function createNewDashboard(userId: string) {
//         setCurrentDashboard({
//             name: "New Dashboard",
//             id: crypto.randomUUID(),
//             userId,
//             widgets: [],
//         });
//     }

//     return { currentDashboard, setCurrentDashboard, createNewDashboard };
// }