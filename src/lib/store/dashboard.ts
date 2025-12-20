import { createStore } from 'solid-js/store';
import type { AppState, Dashboard, Slot, WidgetInstance } from '../types';

const [state, setState] = createStore<AppState>({
  currentDashboard: {
    id: 'default',
    name: 'Default Dashboard',
    userId: 'default-user',
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
  setState('currentDashboard', dashboard);
};

// Set widget in specific slot
export const setSlotWidget = (
  slotId: string,
  widget: WidgetInstance | null
) => {
  setState('currentDashboard', 'slots', (slots) =>
    slots.map((slot) => (slot.id === slotId ? { ...slot, widget } : slot))
  );
};

export const markWidgetAsSaved = (slotId: string, widgetId: string) => {
  setState('currentDashboard', 'slots', (slots) =>
    slots.map((slot) =>
      slot.id === slotId && slot.widget?.id === widgetId
        ? { ...slot, widget: { ...slot.widget, saved: true } }
        : slot
    )
  );
};

export const updateWidgetConfig = (
  slotId: string,
  config: Record<string, any>
) => {
  setState('currentDashboard', 'slots', (slots) =>
    slots.map((slot) =>
      slot.id === slotId && slot.widget
        ? { ...slot, widget: { ...slot.widget, config } }
        : slot
    )
  );
};

export const removeWidgetFromSlot = (slotId: string) => {
  setState('currentDashboard', 'slots', (slots) =>
    slots.map((slot) => (slot.id === slotId ? { ...slot, widget: null } : slot))
  );
};

// Reorder slots (for future use, otherwise will be removed before final deploy)
export const reorderSlots = (newSlots: Slot[]) => {
  setState('currentDashboard', 'slots', newSlots);
};

export const loadDashboard = async (id: string) => {
  // TODO: Fetch dashboard from API and map widgets to slots based on order
  console.log('Loading dashboard:', id);
};

// Toggle sidebar in sync with Sidebar-primitive
export const setSidebarOpen = (open: boolean) => {
  setState('ui', 'sidebarOpen', open);
};

export const useDashboardStore = () => ({
  state,
  setCurrentDashboard,
  setSlotWidget,
  updateWidgetConfig,
  removeWidgetFromSlot,
  reorderSlots,
  loadDashboard,
  setSidebarOpen,
  markWidgetAsSaved,
});
