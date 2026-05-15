import { z } from "zod";

const addressSchema = z.object({
    line: z.string().min(1, "Address line is required").trim(),
    city: z.string().min(1, "City is required").trim(),
    state: z.string().min(1, "State is required").trim(),
    postalCode: z.string().trim().optional(),
    country: z.string().trim().default("Pakistan"),
    isDefault: z.boolean().default(false),

});

export const vendorUpgradeSchema = z.object({
    body: z.object({
        storeName: z.string().min(2, "Store name must be at least 2 characters").max(50).trim(),
        storeDescription: z.string().max(500).trim().optional(),
        phoneNumber: z.string().regex(
            /^(\+92|0)3[0-9]{9}$/,
            "Must be a valid Pakistani number (03001234567 or +923001234567)"
        ),
        addresses: z.array(addressSchema)
            .min(1, "At least one address is required")
            .refine(
                (arr) => arr.filter(a => a.isDefault).length === 1,
                "Exactly one address must be set as default"
            ),
    })
});
export const vendorUpdateSchema = vendorUpgradeSchema
    .partial()
    .refine(
        (data) => !data.body?.addresses ||
            data.body.addresses.filter(a => a.isDefault).length === 1,
        "Exactly one address must be set as default"
    );
export const replyToReviewSchema = z.object({
    body: z.object({
        message: z.string().trim().min(1, "Reply message is required").max(500, "Reply cannot exceed 500 characters"),
    }),
});

export type VendorUpgradeInput = z.infer<typeof vendorUpgradeSchema>;
export type VendorUpdateInput = z.infer<typeof vendorUpdateSchema>;
