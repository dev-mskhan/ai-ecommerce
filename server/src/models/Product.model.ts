import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

interface IVariant {
    name: string;
    options: string[];
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    category: mongoose.Types.ObjectId;
    vendor: mongoose.Types.ObjectId;
    variants: IVariant[];
    tags: string[];
    ratings: { average: number; count: number };
    isActive: boolean;
    isFeatured: boolean;
    seo: { metaTitle?: string; metaDescription?: string };
    embedding: number[];
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        discountPrice: { type: Number, min: 0 },
        stock: { type: Number, required: true, default: 0, min: 0 },
        images: { type: [String], required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
        variants: [{ name: String, options: [String] }],
        tags: [{ type: String }],
        ratings: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        seo: {
            metaTitle: String,
            metaDescription: String,
        },
        embedding: { type: [Number], select: false }
    },
    { timestamps: true }
);

productSchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    return;
});

productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ vendor: 1, isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;