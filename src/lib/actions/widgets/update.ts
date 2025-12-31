import { action } from '@solidjs/router';
import prisma from '~/lib/prisma';
import { UpdateWidgetInput } from './types';

export const updateWidgetAction = action(async (input: UpdateWidgetInput) => {
  'use server';

  console.log('=== UPDATE WIDGET START ===');
  console.log('Input:', JSON.stringify(input, null, 2));

  try {
    if (!input.userId) {
      return { success: false, error: 'Unauthorized' };
    }
    console.log('Updating widget:', input.id, 'userId:', input.userId);
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

    console.log('Widget updated successfully:', widget.id);
    return { success: true, widget };
  } catch (error) {
    console.error('=== ERROR IN UPDATE WIDGET ===');
    console.error('Error updating widget:', error);
    console.error(
      'Error type:',
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      'Error message:',
      error instanceof Error ? error.message : String(error)
    );
    console.error('Error stack:', error instanceof Error ? error.stack : 'N/A');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update widget',
    };
  }
});
