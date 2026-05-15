import mongoose, { Document, Schema } from "mongoose";

export type NotificationType =
    | "order_placed"
    | "order_status_update"
    | "order_cancelled"
    | "product_low_stock"
    | "product_out_of_stock"
    | "new_review"
    | "new_message"
    | "coupon_applied"
    | "vendor_approved"
    | "vendor_banned"
    | "system";

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;       // User receiving the notification
    sender?: mongoose.Types.ObjectId;         // Optional: user who triggered it
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    data?: Record<string, unknown>;           // Extra context (e.g. orderId, productId)
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        type: {
            type: String,
            enum: [
                "order_placed",
                "order_status_update",
                "order_cancelled",
                "product_low_stock",
                "product_out_of_stock",
                "new_review",
                "new_message",
                "coupon_applied",
                "vendor_approved",
                "vendor_banned",
                "system",
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        data: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export default mongoose.model<INotification>("Notification", NotificationSchema);