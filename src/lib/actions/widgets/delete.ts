import { action } from '@solidjs/router';
import prisma from '~/lib/prisma';
import { ActionResponse, DeleteWidgetInput } from './types';

export const deleteWidgetAction = action(
  async (input: DeleteWidgetInput): Promise<ActionResponse> => {
    'use server';
    console.log('=== DELETE START ===');
    console.log('Input userId:', input.userId);

    try {
      if (!input.userId) {
        console.log('No userId - unauthorized');
        return { success: false, error: 'Unauthorized' };
      }
      console.log('Deleting widget:', input.id);
      await prisma.widget.delete({
        where: {
          id: input.id,
          dashboard: {
            userId: input.userId, // Owner control
          },
        },
      });
      console.log('Delete success');
      return { success: true };
    } catch (error) {
      console.error('Error deleting widget:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete widget',
      };
    }
  }
);
