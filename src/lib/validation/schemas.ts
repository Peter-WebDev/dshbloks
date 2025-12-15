import * as z from "zod";

const passwordSchema = z.string()
  .min(8, { error: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { error: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { error: "Password must contain at least one special character" });

export const signInSchema = z.object({
  email: z.email({ error: "A valid email is required" }),
  password: z.string().min(8, { error: "Password is required" }),
});

export const signUpSchema = z.object({
  name: z.string()
    .min(1, { error: "Name is required" })
    .min(2, { error: "Name must be at least 2 characters long" }),
  email: z.email("A valid email is required"),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, { error: "Current password is required" }),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, { error: "Please confirm password" }),
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
  if (newPassword !== confirmPassword) {
    ctx.addIssue({
      code:"custom",
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  }
});

export const forgotPasswordSchema = z.object({
  email: z.email("A valid email is required"),
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, { error: "Please confirm password" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type SignInForm = z.infer<typeof signInSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;