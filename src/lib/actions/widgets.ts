import { action } from '@solidjs/router';
import { WidgetType } from '~/generated/prisma/client';
import { getSession } from '../auth-helpers';
import prisma from '../prisma';

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

  console.log('=== CREATE WIDGET ACTION ===');
  console.log('Input:', JSON.stringify(input, null, 2));

  try {
    const session = await getSession();
    console.log('Session:', session ? 'exists' : 'null');

    if (!session) {
      console.error('No session found');
      return { success: false, error: 'Unauthorized' };
    }

    console.log(
      'Looking for dashboard:',
      input.dashboardId,
      'userId:',
      session.user.id
    );

    const dashboard = await prisma.dashboard.findFirst({
      where: { id: input.dashboardId, userId: session.user.id },
    });

    console.log('Dashboard found:', dashboard ? 'yes' : 'no');

    if (!dashboard) {
      console.error('Dashboard not found or forbidden');
      return { success: false, error: 'Forbidden' };
    }

    console.log('Creating widget...');
    const widget = await prisma.widget.create({
      data: {
        dashboardId: input.dashboardId,
        type: input.type as WidgetType,
        title: input.title,
        config: input.config,
        order: input.order,
      },
    });

    console.log('Widget created successfully:', widget.id);
    return { success: true, widget };
  } catch (error) {
    console.error('=== ERROR IN CREATE WIDGET ===');
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
      error: error instanceof Error ? error.message : 'Failed to create widget',
    };
  }
});

export const updateWidgetAction = action(async (input: UpdateWidgetInput) => {
  'use server';

  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    const widget = await prisma.widget.update({
      where: {
        id: input.id,
        dashboard: {
          userId: session.user.id, // Owner control
        },
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

  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.widget.delete({
      where: {
        id: input.id,
        dashboard: {
          userId: session.user.id, // Owner control
        },
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
