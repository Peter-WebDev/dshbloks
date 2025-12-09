import { PrismaPg } from "@prisma/adapter-pg";
import type { User } from "better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";
import { sendEmail } from "./email";

// Separat Prisma-instans för Better Auth
const authPrisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export const auth = betterAuth({
  database: prismaAdapter(authPrisma, {
        provider: "postgresql",
    }),
    emailVerification: {
    sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
        console.log('🔔 Attempting to send verification email to:', user.email);
        console.log('🔗 Verification URL:', url);
        void sendEmail({
            from: "Dshbloks <hello@resend.popjosef.se>",
            to: user.email,
            subject: "Please, verify your email - Dshbloks",
            html: `
              <h1>Welcome to Dshbloks!</h1>
              <p>We're very excited to have you get started. First we need you to verify your email address to complete your sign up.</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
              <p>Or copy this link: ${url}</p>
              <p>If you didn't sign up for this, you can safely ignore this message.</p>
              <p>Cheers,<br/>Dshbloks</p>
            `,      
          });
        }
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
  });