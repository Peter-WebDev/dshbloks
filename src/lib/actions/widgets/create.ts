import { action } from '@solidjs/router';
import { WidgetType } from '~/generated/prisma/client';
import prisma from '~/lib/prisma';
import { CreateWidgetInput } from './types';

export const createWidgetAction = action(async (input: CreateWidgetInput) => {
  'use server';
  try {
    if (!input.userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const dashboard = await prisma.dashboard.findFirst({
      where: { id: input.dashboardId, userId: input.userId },
    });

    if (!dashboard) {
      return { success: false, error: 'Forbidden' };
    }

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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create widget',
    };
  }
});
