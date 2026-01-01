import { action } from '@solidjs/router';
import prisma from '~/lib/prisma';
import { UpdateWidgetInput } from './types';

export const updateWidgetAction = action(
  async (formOrInput: FormData | UpdateWidgetInput) => {
    'use server';

    let id: string | undefined;
    let userId: string | undefined;
    let config: Record<string, any> | undefined;
    let title: string | undefined;

    if (typeof (formOrInput as any)?.get === 'function') {
      const fd = formOrInput as FormData;
      id = fd.get('id')?.toString();
      userId = fd.get('userId')?.toString();
      title = fd.get('title')?.toString() || undefined;
      const cfg = fd.get('config')?.toString();
      config = cfg ? JSON.parse(cfg) : {};
    } else {
      const input = formOrInput as UpdateWidgetInput;
      id = input.id;
      userId = input.userId;
      title = input.title || undefined;
      config = input.config ?? {};
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

      const updated = await prisma.widget.update({
        where: { id },
        data: {
          title,
          config,
        },
      });

      return { success: true, widget: updated };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to update widget',
      };
    }
  },
  'updateWidget'
);
