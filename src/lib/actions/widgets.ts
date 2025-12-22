import { action } from '@solidjs/router';
import { WidgetType } from '~/generated/prisma/client';
import prisma from '../../../lib/prisma';

export type CreateWidgetInput = {
  dashboardId: string;
  type: string;
  title?: string | null;
  config: Record<string, any>;
  order: number;
};

export type UpdateWidgetInput = {
  id: string;
  config: Record<string, any>;
  title?: string | null;
};

export type DeleteWidgetInput = {
  id: string;
};

export const createWidgetAction = action(async (input: CreateWidgetInput) => {
  'use server';

  try {
    const widget = await prisma.widget.create({
      data: {
        dashboardId: input.dashboardId,
        type: input.type as WidgetType,
        title: input.title,
        config: input.config,
        order: input.order,
      },
    });

    return { success: true, widget };
  } catch (error) {
    console.error('Error creating widget:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create widget',
    };
  }
});
