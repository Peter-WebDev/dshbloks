import { WidgetType } from '~/generated/prisma/client';

export type CreateWidgetInput = {
  dashboardId: string;
  type: WidgetType;
  title?: string | null;
  config: Record<string, any>;
  order: number;
  userId: string;
};

export type UpdateWidgetInput = {
  id: string;
  config: Record<string, any>;
  title?: string | null;
  userId: string;
};

export type DeleteWidgetInput = {
  id: string;
  userId: string;
};

export type ActionResponse<T = any> = {
  success: boolean;
  widget?: T;
  error?: string;
};
