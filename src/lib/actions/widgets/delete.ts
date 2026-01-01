import { action } from '@solidjs/router';
import prisma from '~/lib/prisma';
import { ActionResponse, DeleteWidgetInput } from './types';

export const deleteWidgetAction = action(
  async (
    formOrInput: FormData | DeleteWidgetInput
  ): Promise<ActionResponse> => {
    'use server';

    let id: string | undefined;
    let userId: string | undefined;

    if (typeof (formOrInput as any)?.get === 'function') {
      const fd = formOrInput as FormData;
      id = fd.get('id')?.toString();
      userId = fd.get('userId')?.toString();
    } else {
      const input = formOrInput as DeleteWidgetInput;
      id = input.id;
      userId = input.userId;
    }

    if (!userId) return { success: false, error: 'Unauthorized' };
    if (!id) return { success: false, error: 'Missing id' };

    try {
      const widget = await prisma.widget.findUnique({
        where: { id },
        include: { dashboard: true },
      });

      if (!widget) return { success: false, error: 'Widget not found' };
      if (widget.dashboard.userId !== userId)
        return { success: false, error: 'Forbidden' };

      await prisma.widget.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete widget',
      };
    }
  },
  'deleteWidget'
);
