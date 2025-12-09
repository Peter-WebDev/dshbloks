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
            from: "onboarding@resend.dev",
            to: "peter.warholm@gmail.com",
            subject: "Verify your email - Dshbloks",
            html: `
              <h1>Welcome to Dshbloks!</h1>
              <p>Please verify your email by clicking the link below:</p>
              <a href="${url}">Verify Email</a>
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