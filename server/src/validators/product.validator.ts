import { z } from "zod";

const variantSchema = z.object({
    name: z.string().min(1).max(50),
    options: z.array(z.string().min(1)).min(1),
});

const seoSchema = z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
});
const baseProductSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(200).trim(),
        description: z.string().min(10).max(5000).trim(),
        price: z.coerce.number().min(0),
        discountPrice: z.coerce.number().min(0).optional(),
        stock: z.coerce.number().int().min(0),
        category: z.string().regex(/^[a-f\d]{24}$/i, "Invalid category ID"),
        variants: z.array(variantSchema).optional().default([]),
        tags: z.array(z.string()).optional().default([]),
        seo: seoSchema.optional(),
    }),

});
export const createProductSchema = baseProductSchema.refine(
    data => !data.body.discountPrice || data.body.discountPrice < data.body.price,
    { message: "Discount price must be less than price", path: ["discountPrice"] }
);

export const updateProductSchema = baseProductSchema.partial().refine(
    data => !data.body?.discountPrice || !data.body?.price || data.body?.discountPrice < data.body?.price,
    { message: "Discount price must be less than price", path: ["discountPrice"] }
);

export const searchProductSchema = z.object({
    query: z.object({
        q: z.string().min(1).optional(),
        category: z.string().optional(),
        vendor: z.string().regex(/^[a-f\d]{24}$/i).optional(),
        minPrice: z.coerce.number().min(0).optional(),
        maxPrice: z.coerce.number().min(0).optional(),
        rating: z.coerce.number().min(0).max(5).optional(),
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(50).optional(),
        sort: z.enum(["price_asc", "price_desc", "rating", "newest"]).optional()
    }),
});
export const updateStockSchema = z.object({
    body: z.object({
        stock: z.coerce.number().int().min(0),
    }),
    params: z.object({
        id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product ID"),
    }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type SearchProductInput = z.infer<typeof searchProductSchema>;