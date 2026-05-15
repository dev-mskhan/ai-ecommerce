import type { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import Coupon from "../models/Coupon.model.js";
import type { JwtPayload } from "../utils/generateToken.js";
import { validateAndCalculateCoupon } from "./coupon.controller.js";
import { createPaymentIntent, stripe } from "../services/payment.service.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id: buyerId } = (req as Request & { user: JwtPayload }).user;
    const body = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productIds = body.items.map((i: any) => i.product);
        const products = await Product.find({ _id: { $in: productIds }, isActive: true }).session(session);

        if (products.length !== productIds.length)
            throw new ApiError(400, "One or more products are unavailable");

        const productMap = new Map(products.map((p) => [p._id.toString(), p]));

        let subtotal = 0;
        const orderItems = [];
        const vendorIds: string[] = [];
        const categoryIds: string[] = [];

        for (const item of body.items) {
            const product = productMap.get(item.product);
            if (!product) throw new ApiError(400, `Product ${item.product} not found`);
            if (product.stock < item.quantity)
                throw new ApiError(400, `Insufficient stock for "${product.name}"`);

            const price = product.discountPrice ?? product.price;
            subtotal += price * item.quantity;
            vendorIds.push(product.vendor.toString());
            categoryIds.push(product.category.toString());

            orderItems.push({
                product: product._id,
                vendor: product.vendor,
                name: product.name,
                image: product.images[0],
                price,
                quantity: item.quantity,
                selectedVariants: item.selectedVariants,
            });
        }

        let discount = 0;
        let appliedCoupon: InstanceType<typeof Coupon> | null = null;

        if (body.couponCode) {
            const result = await validateAndCalculateCoupon(
                { code: body.couponCode, orderAmount: subtotal },
                vendorIds,
                categoryIds
            );
            discount = result.discount;
            appliedCoupon = result.coupon;
        }

        const shippingCost = 0;
        const tax = 0;
        const total = subtotal - discount + shippingCost + tax;

        let paymentIntentId: string | undefined;
        let clientSecret: string | null = null;

        if (body.paymentMethod === "stripe") {
            const intent = await createPaymentIntent(total, "usd", {
                buyerId,
            });
            paymentIntentId = intent.id;
            clientSecret = intent.client_secret;
        }

        const order = new Order({
            buyer: buyerId,
            items: orderItems,
            shippingAddress: body.shippingAddress,
            subtotal,
            discount,
            shippingCost,
            tax,
            total,
            coupon: appliedCoupon?._id,
            couponCode: appliedCoupon?.code,
            paymentMethod: body.paymentMethod,
            paymentIntentId,
            paymentStatus: "unpaid",
            status: "pending",
            statusHistory: [{ status: "pending", changedAt: new Date() }],
        });

        await order.save({ session });

        if (body.paymentMethod === "stripe" && paymentIntentId) {
            await stripe.paymentIntents.update(paymentIntentId, {
                metadata: { orderId: order._id.toString(), buyerId },
            });
        }

        for (const item of body.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        if (appliedCoupon) {
            await Coupon.findByIdAndUpdate(
                appliedCoupon._id,
                { $inc: { usedCount: 1 } },
                { session }
            );
        }

        await session.commitTransaction();

        return res.status(201).json(new ApiResponse(201, {
            ...(clientSecret && { clientSecret }),
        }, "Order placed successfully"));

    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    const { id: buyerId } = (req as Request & { user: JwtPayload }).user;
    const { status, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query as any;

    const filter: any = { buyer: buyerId };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("items.product", "name images slug"),
        Order.countDocuments(filter),
    ]);

    return res.json(new ApiResponse(200, { orders, total, page, totalPages: Math.ceil(total / limit) }, "Orders fetched"));
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId, role } = (req as Request & { user: JwtPayload }).user;

    const order = await Order.findById(req.params.id).populate("items.product", "name images slug");
    if (!order) throw new ApiError(404, "Order not found");

    const isOwner = order.buyer.toString() === userId;
    const isVendor = order.items.some((i) => i.vendor.toString() === userId);
    const isAdmin = role === "admin";

    if (!isOwner && !isVendor && !isAdmin) throw new ApiError(403, "Forbidden");

    return res.json(new ApiResponse(200, order, "Order fetched"));
});

export const adminUpdateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status, reason }: { status: "cancelled" | "delivered" | "refunded"; reason?: string } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(orderId).session(session);
        if (!order) throw new ApiError(404, "Order not found");
        if (order.status === status) throw new ApiError(400, `Order is already ${status}`);

        if (status === "cancelled") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { session });
            }
            if (order.coupon) {
                await Coupon.findByIdAndUpdate(order.coupon, { $inc: { usedCount: -1 } }, { session });
            }
            order.cancelledAt = new Date();
            order.cancellationReason = reason;
        }

        if (status === "delivered") order.deliveredAt = new Date();

        order.status = status;
        order.statusHistory.push({ status, changedAt: new Date(), note: reason });
        await order.save({ session });

        await session.commitTransaction();
        return res.json(new ApiResponse(200, order, `Order ${status}`));
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});

export const vendorUpdateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id: vendorId } = (req as Request & { user: JwtPayload }).user;
    const { status, note }: { status: "confirmed" | "processing" | "shipped"; note?: string } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    const vendorItems = order.items.filter((i) => i.vendor.toString() === vendorId);
    if (!vendorItems.length) throw new ApiError(403, "Forbidden");

    for (const item of order.items) {
        if (item.vendor.toString() === vendorId) {
            item.status = status;
        }
    }

    const allStatuses = order.items.map((i) => i.status ?? "pending");
    if (allStatuses.every((s) => s === "shipped")) order.status = "shipped";
    else if (allStatuses.every((s) => s === "processing")) order.status = "processing";
    else if (allStatuses.every((s) => s === "confirmed")) order.status = "confirmed";
    else order.status = "processing";

    order.statusHistory.push({ status: order.status, changedAt: new Date(), note });
    await order.save();
    return res.json(new ApiResponse(200, order, "Order status updated"));
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id: buyerId } = (req as Request & { user: JwtPayload }).user;
    const body = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(req.params.id).session(session);
        if (!order) throw new ApiError(404, "Order not found");
        if (order.buyer.toString() !== buyerId) throw new ApiError(403, "Forbidden");
        if (!["pending", "confirmed", "processing"].includes(order.status))
            throw new ApiError(400, `Cannot cancel an order in "${order.status}" status`);

        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { session });
        }

        if (order.coupon) {
            await Coupon.findByIdAndUpdate(order.coupon, { $inc: { usedCount: -1 } }, { session });
        }

        order.status = "cancelled";
        order.cancelledAt = new Date();
        order.cancellationReason = body.reason;
        order.statusHistory.push({ status: "cancelled", changedAt: new Date(), note: body.reason });
        await order.save({ session });

        await session.commitTransaction();
        return res.json(new ApiResponse(200, order, "Order cancelled"));
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});

export const getVendorOrders = asyncHandler(async (req: Request, res: Response) => {
    const { id: vendorId } = (req as Request & { user: JwtPayload }).user;
    const { status, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query as any;

    const filter: any = { "items.vendor": new mongoose.Types.ObjectId(vendorId) };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
        Order.aggregate([
            { $match: filter },
            {
                $addFields: {
                    items: {
                        $filter: {
                            input: "$items",
                            as: "item",
                            cond: { $eq: ["$$item.vendor", new mongoose.Types.ObjectId(vendorId)] },
                        },
                    },
                },
            },
            { $sort: { [sortBy]: order === "asc" ? 1 : -1 } },
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) },
            {
                $project: {
                    items: 1,
                    status: 1,
                    total: 1,
                    paymentStatus: 1,
                    shippingAddress: 1,
                    createdAt: 1,
                },
            },
        ]),
        Order.countDocuments(filter),
    ]);

    return res.json(
        new ApiResponse(
            200,
            { orders, total, page, totalPages: Math.ceil(total / Number(limit)) },
            "Vendor orders fetched"
        )
    );
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const { status, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query as any;

    const filter: any = {};
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("buyer", "name email"),
        Order.countDocuments(filter),
    ]);

    return res.json(new ApiResponse(200, { orders, total, page, totalPages: Math.ceil(total / limit) }, "All orders fetched"));
});