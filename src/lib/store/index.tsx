import { useDashboardStore } from "./dashboard";

// Kombinera stores
export const useApp = () => {
    const { state: dashboardState, setCurrentDashboard, setSlotWidget, saveSlot, reorderSlots, loadDashboard, setSidebarOpen } = useDashboardStore();

    return {
        // Dashboard store
        currentDashboard: () => dashboardState.currentDashboard,
        slots: () => dashboardState.currentDashboard?.slots || [],
        sidebarOpen: () => dashboardState.ui.sidebarOpen, // Synkad med UI
        setCurrentDashboard,
        setSlotWidget,
        saveSlot,
        reorderSlots,
        loadDashboard,
        setSidebarOpen,
    };
};

// Tidigare implementation med Context API (kommenterad ut för nu)

// interface AppStore {
//     user: () => User | null;
//     setUser: Setter<User | null>;
//     currentDashboard: () => DashboardWithWidgets | null;
//     setCurrentDashboard: (dashboard: DashboardWithWidgets | null) => void;
//     createNewDashboard: (userId: string) => void;
//     addWidget: (widget: BaseWidget) => void;
//     updateWidget: (id: string, config: any) => void;
//     deleteWidget: (id: string) => void;
//     reorderWidgets: (widgets: BaseWidget[]) => void;
// }

// const AppContext = createContext<AppStore>();

// export function AppProvider(props: ParentProps) {
//     // Implementation of AppProvider
//     const userStore = createUserStore();
//     const dashboardStore = createDashboardStore();
//     const widgetStore = createWidgetStore(
//         dashboardStore.currentDashboard,
//         dashboardStore.setCurrentDashboard
//     );

//     const store = {
//         ...userStore,
//         ...dashboardStore,
//         ...widgetStore,
//     };

//     return (
//         <AppContext.Provider value={store}>
//             {props.children}
//         </AppContext.Provider>
//     );
// }

// export function useApp() {
//     const context = useContext(AppContext);
//     if (!context) throw new Error("useApp must be used within an AppProvider");
//     return context;
// }