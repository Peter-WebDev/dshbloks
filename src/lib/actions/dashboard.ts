import { query } from '@solidjs/router';
import prisma from '../prisma';

// Query function to get or create user's default dashboard
export const getOrCreateDefaultDashboard = query(async (userId?: string) => {
  'use server';

  if (!userId) return null; // Guest mode

  try {
    // Try to find user's default dashboard
    let dashboard = await prisma.dashboard.findFirst({
      where: {
        userId,
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
          userId,
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
