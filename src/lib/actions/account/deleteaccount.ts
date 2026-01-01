import { action } from '@solidjs/router';
import { getSession } from '~/lib/auth-helpers';
import { prisma } from '~/lib/prisma';

export interface DeleteAccountInput {
  userId: string;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export const deleteAccountAction = action(
  async (
    formOrInput: FormData | DeleteAccountInput
  ): Promise<ActionResponse> => {
    'use server';

    let userId: string | undefined;

    if (typeof (formOrInput as any)?.get === 'function') {
      const fd = formOrInput as FormData;
      userId = fd.get('userId')?.toString();
    } else {
      const input = formOrInput as DeleteAccountInput;
      userId = input.userId;
    }

    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
      const session = await getSession();
      if (session?.user?.id !== userId) {
        return { success: false, error: 'Forbidden' };
      }

      await prisma.user.delete({
        where: { id: userId },
      });

      return { success: true };
    } catch (error) {
      console.error('Delete account failed:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete account',
      };
    }
  },
  'deleteAccount'
);
