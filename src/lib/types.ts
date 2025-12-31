import type { DashboardModel, WidgetModel } from '~/generated/prisma/models';

export type BaseWidget = Pick<WidgetModel, 'id' | 'type' | 'config' | 'order'>;

export interface WidgetInstance extends Omit<WidgetModel, 'config'> {
  config: Record<string, any> | any;
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
  sidebarOpen: boolean; // True om sidebar är öppen (edit-mode), false för view-mode
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
  fontSize: 'small' | 'medium' | 'large';
}

export type WidgetTemplate = {
  id: string;
  type?: string;
  name?: string;
  description?: string;
  defaultConfig: Record<string, any>;
  icon?: string;
};

export const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'clock',
    type: 'clock',
    name: 'Clock',
    description: 'Displays the current time',
    defaultConfig: { timezone: 'Europe/Stockholm', format24h: true },
    icon: '🕐',
  },
  // Add more widget templates as needed
] as const;
