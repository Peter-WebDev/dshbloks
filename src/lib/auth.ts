import type { User } from 'better-auth';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { sendEmail } from './email';
import { prisma } from './prisma';

const trustedOrigins = process.env.AUTH_TRUSTED_ORIGINS
  ? process.env.AUTH_TRUSTED_ORIGINS.split(',').map((origin) => origin.trim())
  : process.env.NODE_ENV === 'production'
  ? ['https://dshbloks.popjosef.se'] // Din Netlify-domain
  : [
      'http://localhost:3000',
      'https://deploy-preview-35--dshbloks.netlify.app',
    ];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.NODE_ENV === 'production'
      ? 'https://dshbloks.popjosef.se'
      : 'http://localhost:3000'),
  emailVerification: {
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: User;
      url: string;
    }) => {
      console.log('🔔 Attempting to send verification email to:', user.email);
      console.log('🔗 Verification URL:', url);
      void sendEmail({
        from: 'Dshbloks <hello@resend.popjosef.se>',
        to: user.email,
        subject: 'Please, verify your email - Dshbloks',
        html: `
              <h1>Welcome to Dshbloks!</h1>
              <p>We're very excited to have you get started. First we need you to verify your email address to complete your sign up.</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
              <p>Or copy this link: ${url}</p>
              <p>If you didn't sign up for this, you can safely ignore this message.</p>
              <p>Cheers,<br/>Dshbloks</p>
            `,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    disableCSRFCheck: false,
  },
  trustedOrigins: trustedOrigins,
});
