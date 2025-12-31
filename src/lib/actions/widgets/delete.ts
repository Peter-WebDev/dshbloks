import { action } from '@solidjs/router';
import prisma from '~/lib/prisma';
import { ActionResponse, DeleteWidgetInput } from './types';

export const deleteWidgetAction = action(
  async (input: DeleteWidgetInput): Promise<ActionResponse> => {
    'use server';
    try {
      if (!input.userId) {
        return { success: false, error: 'Unauthorized' };
      }

      await prisma.widget.delete({
        where: {
          id: input.id,
          dashboard: {
            userId: input.userId, // Owner control
          },
        },
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete widget',
      };
    }
  }
);
