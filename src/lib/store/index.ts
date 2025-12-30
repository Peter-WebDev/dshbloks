import { useDashboardStore } from "./dashboard";

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
        setSidebarOpen,
        takeSnapshot,
        clearSnapshot
    } = useDashboardStore();

    return {
        currentDashboard: () => state.currentDashboard,
        slots: () => state.currentDashboard?.slots || [],
        sidebarOpen: () => state.ui.sidebarOpen,
        snapshots: () => state.snapshots,

        setCurrentDashboard,
        setSlotWidget,
        markWidgetAsSaved,
        updateWidgetConfig,
        removeWidgetFromSlot,
        reorderSlots,
        loadDashboard,
        setSidebarOpen,
        takeSnapshot,
        clearSnapshot
    };
};