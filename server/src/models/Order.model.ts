import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

interface IOrderItem {
    product: mongoose.Types.ObjectId;
    vendor: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    status: OrderStatus;
    selectedVariants?: Record<string, string>;
}

interface IShippingAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface IOrder extends Document {
    buyer: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    subtotal: number;
    discount: number;
    shippingCost: number;
    tax: number;
    total: number;
    coupon?: mongoose.Types.ObjectId;
    couponCode?: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: "stripe" | "cod";
    paymentIntentId?: string;
    statusHistory: { status: OrderStatus; changedAt: Date; note?: string }[];
    deliveredAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        status: { type: String, enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"], default: "pending" },
        selectedVariants: { type: Map, of: String },
    },
    { _id: false }
);

const shippingAddressSchema = new Schema<IShippingAddress>(
    {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [orderItemSchema], required: true },
        shippingAddress: { type: shippingAddressSchema, required: true },
        subtotal: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        shippingCost: { type: Number, default: 0, min: 0 },
        tax: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },
        coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
        couponCode: String,
        status: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "failed", "refunded"],
            default: "unpaid",
        },
        paymentMethod: { type: String, enum: ["stripe", "mock", "cod"], required: true },
        paymentIntentId: String,
        statusHistory: [
            {
                status: String,
                changedAt: { type: Date, default: Date.now },
                note: String,
            },
        ],
        deliveredAt: Date,
        cancelledAt: Date,
        cancellationReason: String,
    },
    { timestamps: true }
);

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ "items.vendor": 1, status: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentIntentId: 1 });

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;