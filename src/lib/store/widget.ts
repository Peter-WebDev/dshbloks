import type { BaseWidget } from "../types";

interface DashboardWithWidgets {
  id: string;
  name?: string;
  userId?: string;
  widgets: BaseWidget[];
}

export function createWidgetStore(
    // Implementation of widget store
    currentDashboard: () => DashboardWithWidgets | null,
    setCurrentDashboard: (d: DashboardWithWidgets | null) => void
) {
    function addWidget(widget: BaseWidget) {
        const dashboard = currentDashboard();
        if (!dashboard) return;
        setCurrentDashboard({
            ...dashboard,
            widgets: [...dashboard.widgets, widget],
        });
    }

    function updateWidget(id: string, config: any) {
        const dashboard = currentDashboard();
        if (!dashboard) return;
        setCurrentDashboard({
            ...dashboard,
            widgets: dashboard.widgets.map(w =>
                w.id === id ? { ...w, config } : w
            ),
        });
    }

    function deleteWidget(id: string) {
        const dashboard = currentDashboard();
        if (!dashboard) return;
        setCurrentDashboard({
            ...dashboard,
            widgets: dashboard.widgets.filter(w => w.id !== id),
        });
    }

    function reorderWidgets(widgets: BaseWidget[]) {
        const dashboard = currentDashboard();
        if (!dashboard) return;
        setCurrentDashboard({
            ...dashboard,
            widgets,
        });
    }

    return { addWidget, updateWidget, deleteWidget, reorderWidgets };
}