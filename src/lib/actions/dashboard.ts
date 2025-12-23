import { query } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { auth } from '~/lib/auth';
import prisma from '../../../lib/prisma';

// Query function to get or create user's default dashboard
export const getOrCreateDefaultDashboard = query(async () => {
  'use server';

  try {
    // Get request event to access headers
    const event = getRequestEvent();
    if (!event) {
      return null; // Guest mode
    }

    // Get current session
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    if (!session?.user?.id) {
      return null; // Guest mode
    }

    // Try to find user's default dashboard
    let dashboard = await prisma.dashboard.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
      include: {
        widgets: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // If no default dashboard exists, create one
    if (!dashboard) {
      dashboard = await prisma.dashboard.create({
        data: {
          userId: session.user.id,
          name: 'My Dashboard',
          isDefault: true,
        },
        include: {
          widgets: true,
        },
      });
    }

    return dashboard;
  } catch (error) {
    console.error('Error getting/creating dashboard:', error);
    return null; // Fallback to guest mode on error
  }
}, 'default-dashboard');
