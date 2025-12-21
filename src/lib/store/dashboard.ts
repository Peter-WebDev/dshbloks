import { createStore } from 'solid-js/store';
import type { AppState, Dashboard, Slot, WidgetInstance } from '../types';

interface ExtendedAppState extends AppState {
  snapshots: Record<string, WidgetInstance | null>;
}

const [state, setState] = createStore<ExtendedAppState>({
  currentDashboard: {
    id: 'default',
    name: 'Default Dashboard',
    userId: 'default-user',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    slots: Array.from({ length: 6 }, (_, i) => ({
      id: `slot-${i + 1}`,
      widget: null,
    })),
  },
  ui: {
    sidebarOpen: true,
  },
  snapshots: {},
});

export const setCurrentDashboard = (dashboard: Dashboard) => {
  setState('currentDashboard', dashboard);
};

export const setSlotWidget = (
  slotId: string,
  widget: WidgetInstance | null
) => {
  setState(
    'currentDashboard',
    'slots',
    (s) => s.id === slotId,
    'widget',
    widget
  );
};

export const takeSnapshot = (slotId: string, widget: WidgetInstance) => {
  setState('snapshots', slotId, JSON.parse(JSON.stringify(widget)));
};

export const clearSnapshot = (slotId: string) => {
  setState('snapshots', slotId, null);
};

export const markWidgetAsSaved = (slotId: string, widgetId: string) => {
  setState(
    'currentDashboard',
    'slots',
    (s) => s.id === slotId && s.widget?.id === widgetId,
    'widget',
    'saved',
    true
  );
};

export const updateWidgetConfig = (
  slotId: string,
  config: Record<string, any>
) => {
  setState(
    'currentDashboard',
    'slots',
    (s) => s.id === slotId,
    'widget',
    'config',
    config
  );
};

export const removeWidgetFromSlot = (slotId: string) => {
  setState('currentDashboard', 'slots', (s) => s.id === slotId, 'widget', null);
};

export const reorderSlots = (newSlots: Slot[]) => {
  setState('currentDashboard', 'slots', newSlots);
};

export const loadDashboard = async (id: string) => {
  console.log('Loading dashboard:', id);
};

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
  takeSnapshot,
  clearSnapshot,
});
