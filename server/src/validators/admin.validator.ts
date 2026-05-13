import { z } from "zod";

export const adminApproveVendorSchema = z.object({
    params: z.object({
        vendorId: z.string().min(1, "Vendor ID is required"),
    }),
});

export const adminRejectVendorSchema = z.object({
    params: z.object({
        vendorId: z.string().min(1, "Vendor ID is required"),
    }),
    body: z.object({
        reason: z.string().min(1, "Rejection reason is required"),
    }),
});

export const adminBanVendorSchema = z.object({
    params: z.object({
        userId: z.string().min(1, "User ID is required"),
    }),
    body: z.object({
        isBanned: z.coerce.boolean({ message: "isBanned must be a boolean" }),
    }),
});