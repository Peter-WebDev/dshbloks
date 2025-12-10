import * as z from "zod";

export const signInSchema = z.object({
  email: z.email({ pattern: z.regexes.html5Email }),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
    name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters long"),
    email: z.email({ pattern: z.regexes.html5Email }),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Please confirm password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const forgotPasswordSchema = z.object({
  email: z.email({ pattern: z.regexes.html5Email }),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Please confirm password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type SignInForm = z.infer<typeof signInSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;