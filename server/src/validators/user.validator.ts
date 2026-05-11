import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50).trim(),
    email: z.string().email("Invalid email").toLowerCase().trim(),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
});

export const vendorUpgradeSchema = z.object({
    storeName: z.string().min(2, "Store name must be at least 2 characters").max(100).trim(),
    storeDescription: z.string().max(500).trim().optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email").toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z
        .string()
        .min(6)
        .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
}).refine(
    (data) => data.password === data.confirmPassword,
    { message: "Passwords do not match", path: ["confirmPassword"] }
);

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).trim().optional(),
    storeName: z.string().min(2).max(100).trim().optional(),
    storeDescription: z.string().max(500).trim().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(6)
        .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
}).refine(
    (data) => data.newPassword === data.confirmPassword,
    { message: "Passwords do not match", path: ["confirmPassword"] }
);

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type VendorUpgradeInput = z.infer<typeof vendorUpgradeSchema>;