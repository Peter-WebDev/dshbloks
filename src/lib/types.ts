import type { DashboardModel, WidgetModel } from "~/generated/prisma/models";

export type BaseWidget = Pick<WidgetModel, "id" | "type" | "config" | "order">;

export interface WidgetInstance extends Omit<WidgetModel, 'config'> {
  config: Record<string, any>;
  saved?: boolean;
}

export interface Slot {
  id: string;
  widget: WidgetInstance | null;
}

export interface Dashboard extends Omit<DashboardModel, 'widgets'> {
  slots: Slot[];
}

export interface UIState {
  sidebarOpen: boolean;  // True om sidebar är öppen (edit-mode), false för view-mode
}

export interface AppState {
  currentDashboard: Dashboard | null;
  ui: UIState;
}

export interface ClockConfig {
  timezone: string;
  format24h: boolean;
}

export interface NotesConfig {
  title: string;
  content: string;
  fontSize: "small" | "medium" | "large";
}

export const WIDGET_TEMPLATES = [
  { type: "clock", label: "Klocka", icon: "🕐", description: "Visa tid" },
  { type: "notes", label: "Anteckningar", icon: "📝", description: "Redigera text" },
  // ... andra widgets
] as const;