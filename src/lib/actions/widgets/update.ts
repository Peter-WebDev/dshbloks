import { action } from '@solidjs/router';
import prisma from '~/lib/prisma';
import { UpdateWidgetInput } from './types';

export const updateWidgetAction = action(async (input: UpdateWidgetInput) => {
  'use server';
  try {
    if (!input.userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const widget = await prisma.widget.update({
      where: {
        id: input.id,
        dashboard: { userId: input.userId },
      },
      data: {
        config: input.config,
        title: input.title,
      },
    });

    return { success: true, widget };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update widget',
    };
  }
});
