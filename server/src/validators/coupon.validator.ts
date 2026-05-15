import { z } from "zod";
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

const couponBaseSchema = z.object({
    code: z.string().min(3).max(20).trim().toUpperCase(),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().min(0),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscountAmount: z.number().min(0).optional(),
    usageLimit: z.number().int().min(1).optional(),
    expiresAt: z.coerce.date().optional(),
    applicableVendors: z.array(objectId).optional().default([]),
    applicableCategories: z.array(objectId).optional().default([]),
});

const percentageRefine = (d: { discountType?: string; discountValue?: number }) =>
    d.discountType !== "percentage" || (d.discountValue ?? 0) <= 100;

const percentageRefineOptions = {
    message: "Percentage discount cannot exceed 100",
    path: ["discountValue"],
};

export const createCouponSchema = couponBaseSchema.refine(percentageRefine, percentageRefineOptions);

export const updateCouponSchema = z.object({
    body: couponBaseSchema.partial().refine(percentageRefine, percentageRefineOptions),
    params: z.object({ id: objectId }),
});
export const applyCouponSchema = z.object({
    body: z.object({
        code: z.string().min(1).trim(),
        orderAmount: z.number().min(0),
    })
});
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;