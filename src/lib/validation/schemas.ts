import * as z from "zod";

export const signInSchema = z.object({
  email: z.email,
  password: z.string().min(8, { error: "Password is required" }),
});

export const signUpSchema = z.object({
  name: z.string()
    .min(1, { error: "Name is required" })
    .min(2, { error: "Name must be at least 2 characters long" }),
  email: z.email(),
  password: z.string().min(8, { error: "Password must be at least 8 characters long" }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, { error: "Current password is required" }),
  newPassword: z.string().min(8, { error: "Password must be at least 8 characters long" }),
  confirmPassword: z.string().min(1, { error: "Please confirm password" })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, { error: "Password must be at least 8 characters long" }),
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