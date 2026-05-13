import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

const shippingAddressSchema = z.object({
    fullName: z.string().min(2).max(100).trim(),
    phone: z.string().min(7).max(20).trim(),
    addressLine1: z.string().min(5).max(200).trim(),
    addressLine2: z.string().max(200).trim().optional(),
    city: z.string().min(2).max(100).trim(),
    state: z.string().min(2).max(100).trim(),
    postalCode: z.string().min(3).max(20).trim(),
    country: z.string().min(2).max(100).trim(),
});

const orderItemSchema = z.object({
    product: objectId,
    quantity: z.number().int().min(1),
    selectedVariants: z.record(z.string(), z.string()).optional(),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(["stripe", "mock", "cod"]),
    couponCode: z.string().trim().optional(),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(["confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]),
    note: z.string().max(500).optional(),
});

export const cancelOrderSchema = z.object({
    reason: z.string().min(5).max(500).trim(),
});

export const orderQuerySchema = z.object({
    status: z
        .enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"])
        .optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sortBy: z.enum(["createdAt", "total"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
});      

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
