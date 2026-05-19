import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    images: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        slug: { type: String, unique: true },
        description: { type: String, trim: true },
        images: { type: [String], required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

categorySchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    return;
});

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;