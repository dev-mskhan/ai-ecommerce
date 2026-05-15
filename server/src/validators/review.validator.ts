import { z } from "zod";
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const createReviewSchema = z.object({
    body: z.object({
        product: objectId,
        order: objectId,
        rating: z.number().int().min(1).max(5),
        title: z.string().trim().max(100).optional(),
        comment: z.string().trim().min(10).max(1000),
    }),
});

export const updateReviewSchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({
        rating: z.number().int().min(1).max(5).optional(),
        title: z.string().trim().max(100).optional(),
        comment: z.string().trim().min(10).max(1000).optional(),
    }),
});

export const vendorReplySchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({
        message: z.string().trim().min(5).max(500),
    }),
});

export const reviewQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(10),
        rating: z.coerce.number().int().min(1).max(5).optional(),
        sortBy: z.enum(["createdAt", "rating", "likes"]).default("createdAt"),
        order: z.enum(["asc", "desc"]).default("desc"),
    }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type VendorReplyInput = z.infer<typeof vendorReplySchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;