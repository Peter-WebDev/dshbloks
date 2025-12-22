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

export const updateWidgetAction = action(async (input: UpdateWidgetInput) => {
  'use server';

  try {
    const widget = await prisma.widget.update({
      where: {
        id: input.id,
      },
      data: {
        config: input.config,
        title: input.title,
        updatedAt: new Date(),
      },
    });

    return { success: true, widget };
  } catch (error) {
    console.error('Error updating widget:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update widget',
    };
  }
});

export const deleteWidgetAction = action(async (input: DeleteWidgetInput) => {
  'use server';

  try {
    await prisma.widget.delete({
      where: {
        id: input.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting widget:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete widget',
    };
  }
});
