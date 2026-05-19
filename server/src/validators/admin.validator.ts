import { z } from "zod";

export const adminApproveVendorSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Vendor ID is required"),
    })
});

export const adminRejectVendorSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Vendor ID is required"),
    }),
    body: z.object({
        reason: z.string().min(1, "Rejection reason is required"),
    }),
});

export const adminBanVendorSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Vendor ID is required"),
    })
});
export const adminHandleReportedProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Product ID is required"),
    }),
    body: z.object({
        action: z.enum(["remove", "dismiss"]),
    }),
});