import { z } from "zod";
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const createCouponSchema = z
    .object({
        code: z.string().min(3).max(20).trim().toUpperCase(),
        discountType: z.enum(["percentage", "fixed"]),
        discountValue: z.number().min(0),
        minOrderAmount: z.number().min(0).optional(),
        maxDiscountAmount: z.number().min(0).optional(),
        usageLimit: z.number().int().min(1).optional(),
        expiresAt: z.coerce.date().optional(),
        applicableVendors: z.array(objectId).optional().default([]),
        applicableCategories: z.array(objectId).optional().default([]),
    })
    .refine(
        (d) => d.discountType !== "percentage" || d.discountValue <= 100,
        { message: "Percentage discount cannot exceed 100", path: ["discountValue"] }
    );

export const applyCouponSchema = z.object({
    code: z.string().min(1).trim(),
    orderAmount: z.number().min(0),
});
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;