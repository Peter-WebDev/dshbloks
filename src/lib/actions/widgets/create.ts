import { action } from '@solidjs/router';
import { WidgetType } from '~/generated/prisma/client';
import prisma from '~/lib/prisma';
import { CreateWidgetInput } from './types';

export const createWidgetAction = action(
  async (formOrInput: FormData | CreateWidgetInput) => {
    'use server';

    let dashboardId: string | undefined;
    let userId: string | undefined;
    let type: WidgetType | undefined;
    let title: string | undefined;
    let config: Record<string, any> | undefined;
    let order: number | undefined;

    if (typeof (formOrInput as any)?.get === 'function') {
      const fd = formOrInput as FormData;
      dashboardId = fd.get('dashboardId')?.toString();
      userId = fd.get('userId')?.toString();
      type = fd.get('type')?.toString() as WidgetType;
      title = fd.get('title')?.toString() || undefined;
      const cfg = fd.get('config')?.toString();
      config = cfg ? JSON.parse(cfg) : {};
      order = fd.get('order') ? Number(fd.get('order')?.toString()) : undefined;
    } else {
      const input = formOrInput as CreateWidgetInput;
      dashboardId = input.dashboardId;
      userId = input.userId;
      type = input.type as WidgetType;
      title = input.title || undefined;
      config = input.config ?? {};
      order = input.order;
    }

    if (!userId) return { success: false, error: 'Unauthorized' };
    if (!dashboardId) return { success: false, error: 'Missing dashboardId' };
    if (!type) return { success: false, error: 'No such Widget' };

    try {
      const dashboard = await prisma.dashboard.findFirst({
        where: { id: dashboardId, userId },
      });

      if (!dashboard) return { success: false, error: 'Forbidden' };

      const widget = await prisma.widget.create({
        data: {
          dashboardId,
          type: type as WidgetType,
          title,
          config,
          order: order ?? 0,
        },
      });

      return { success: true, widget };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create widget',
      };
    }
  },
  'createWidget'
);
