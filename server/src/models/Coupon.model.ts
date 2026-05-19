// server/src/models/coupon.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    usedCount: number;
    expiresAt?: Date;
    isActive: boolean;
    applicableVendors: mongoose.Types.ObjectId[];
    applicableCategories: mongoose.Types.ObjectId[];
    updatedBy: mongoose.Types.ObjectId;
}

const couponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        discountType: { type: String, enum: ["percentage", "fixed"], required: true },
        discountValue: { type: Number, required: true, min: 0 },
        minOrderAmount: { type: Number, min: 0 },
        maxDiscountAmount: { type: Number, min: 0 },
        usageLimit: { type: Number, min: 1 },
        usedCount: { type: Number, default: 0 },
        expiresAt: { type: Date },
        isActive: { type: Boolean, default: true },
        applicableVendors: [{ type: Schema.Types.ObjectId, ref: "User" }],
        applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, expiresAt: 1 });

const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
export default Coupon;