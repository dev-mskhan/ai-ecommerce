import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    order: mongoose.Types.ObjectId;
    rating: number;
    title?: string;
    comment: string;
    isVerifiedPurchase: boolean;
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    isApproved: boolean;
    vendorReply?: {
        message: string;
        repliedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000,
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: true,
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        dislikes: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        isApproved: {
            type: Boolean,
            default: true,
            index: true,
        },
        vendorReply: {
            message: { type: String, trim: true, maxlength: 500 },
            repliedAt: { type: Date },
        },
    },
    {
        timestamps: true,
    }
);

ReviewSchema.index({ product: 1, buyer: 1 }, { unique: true });
async function updateProductRating(productId: mongoose.Types.ObjectId) {
    const Review = mongoose.model("Review");
    const result = await Review.aggregate([
        { $match: { product: productId, isApproved: true } },
        { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const avgRating = result[0]?.avgRating ?? 0;
    const ratingCount = result[0]?.count ?? 0;

    await mongoose.model("Product").findByIdAndUpdate(productId, {
        "ratings.average": Math.round(avgRating * 10) / 10,
        "ratings.count": ratingCount,
    });
}

ReviewSchema.post("save", async function () {
    await updateProductRating(this.product);
});

ReviewSchema.post("findOneAndDelete", async function (doc) {
    if (doc) await updateProductRating(doc.product);
});

export default mongoose.model<IReview>("Review", ReviewSchema);