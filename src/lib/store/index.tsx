import { useDashboardStore } from "./dashboard";

// Kombinera stores
export const useApp = () => {
    const {
        state,
        setCurrentDashboard,
        setSlotWidget,
        markWidgetAsSaved,
        updateWidgetConfig,
        removeWidgetFromSlot,
        reorderSlots,
        loadDashboard,
        setSidebarOpen
    } = useDashboardStore();

    return {
        // Dashboard state
        currentDashboard: () => state.currentDashboard,
        slots: () => state.currentDashboard?.slots || [],
        sidebarOpen: () => state.ui.sidebarOpen, // Sync with Sidebar-UI

        // Dashboard actions
        setCurrentDashboard,
        setSlotWidget,
        markWidgetAsSaved,
        updateWidgetConfig,
        removeWidgetFromSlot,
        reorderSlots,
        loadDashboard,
        setSidebarOpen,
    };
};