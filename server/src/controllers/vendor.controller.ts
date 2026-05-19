import User from "../models/User.model.js";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import type { JwtPayload } from "../utils/generateToken.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import Review from "../models/Review.model.js";
import redis from "../config/redis.js";
import mongoose from "mongoose";
type AuthRequest = Request & { user: JwtPayload };

export const upgradeToVendor = asyncHandler(async (req: Request, res: Response) => {
    const { storeName, storeDescription, phoneNumber, addresses } = req.body;
    const { id } = (req as AuthRequest).user;

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    if (user.role === "vendor") throw new ApiError(409, "Already a vendor");

    let storeAvatar: string | undefined;
    if (req.file) {
        const uploaded = await uploadToCloudinary(
            req.file.buffer,
            "ecommerce/avatars",
            `vendor_avatar_${Date.now()}_${req.file.originalname.split(".")[0]}`
        );
        storeAvatar = uploaded.url;
    }

    user.role = "vendor";
    user.isApproved = false;
    user.storeName = storeName;
    user.storeDescription = storeDescription;
    user.phoneNumber = phoneNumber;
    user.addresses = addresses;
    if (storeAvatar) user.storeAvatar = storeAvatar;

    await user.save();

    return res.json(new ApiResponse(200, null, "Vendor application submitted. Awaiting admin approval."));
});

export const updateVendor = asyncHandler(async (req: Request, res: Response) => {
    const { storeName, storeDescription, phoneNumber, addresses } = req.body;
    const { id } = (req as AuthRequest).user;

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    if (user.role !== "vendor") throw new ApiError(403, "Not a vendor");
    if (req.file) {
        const uploaded = await uploadToCloudinary(
            req.file.buffer,
            "ecommerce/avatars",
            `vendor_avatar_${Date.now()}_${req.file.originalname.split(".")[0]}`
        );
        user.storeAvatar = uploaded.url;
    }
    if (storeName) user.storeName = storeName;
    if (storeDescription !== undefined) user.storeDescription = storeDescription;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (addresses) user.addresses = addresses;

    await user.save();

    return res.json(new ApiResponse(200, null, "Vendor profile updated successfully."));
});

const CACHE_TTL = 60 * 5;

const bustVendorCache = async (vendorId: string, ...keys: string[]) => {
    const pipeline = redis.pipeline();
    for (const key of keys) {
        if (key.includes("*")) {
            const matched = await redis.keys(key.replace("{vendorId}", vendorId));
            if (matched.length > 0) pipeline.del(...matched);
        } else {
            pipeline.del(key.replace("{vendorId}", vendorId));
        }
    }
    await pipeline.exec();
};

// ANALYTICS 

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = (req as AuthRequest).user?.id;
    const cacheKey = `vendor:${vendorId}:analytics:dashboard`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Dashboard stats fetched successfully"));
        return;
    }

    const [revenueResult, totalOrders, pendingOrders, totalProducts] = await Promise.all([
        Order.aggregate([
            { $match: { status: "delivered", paymentStatus: "paid" } },
            { $unwind: "$items" },
            { $match: { "items.vendor": new mongoose.Types.ObjectId(vendorId) } },
            {
                $group: {
                    _id: null,
                    grossRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                },
            },
            {
                $project: {
                    grossRevenue: 1,
                    netRevenue: { $multiply: ["$grossRevenue", 0.95] },
                },
            },
        ]),
        Order.countDocuments({ "items.vendor": vendorId }),
        Order.countDocuments({ "items.vendor": vendorId, "items.status": "pending" }),
        Product.countDocuments({ vendor: vendorId }),
    ]);

    const data = {
        netRevenue: revenueResult[0]?.netRevenue ?? 0,
        grossRevenue: revenueResult[0]?.grossRevenue ?? 0,
        totalOrders,
        pendingOrders,
        totalProducts,
    };

    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);
    res.json(new ApiResponse(200, data, "Dashboard stats fetched successfully"));
});

export const getRevenueAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = (req as AuthRequest).user?.id;
    const cacheKey = `vendor:${vendorId}:analytics:revenue`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Revenue analytics fetched successfully"));
        return;
    }

    const revenueAnalytics = await Order.aggregate([
        { $match: { status: "delivered", paymentStatus: "paid" } },
        { $unwind: "$items" },
        { $match: { "items.vendor": new mongoose.Types.ObjectId(vendorId) } },
        {
            $group: {
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                grossRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                orderCount: { $sum: 1 },
            },
        },
        {
            $addFields: {
                netRevenue: { $multiply: ["$grossRevenue", 0.95] },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    await redis.set(cacheKey, JSON.stringify(revenueAnalytics), "EX", CACHE_TTL);
    res.json(new ApiResponse(200, revenueAnalytics, "Revenue analytics fetched successfully"));
});

export const getSalesReport = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = (req as AuthRequest).user?.id;
    const cacheKey = `vendor:${vendorId}:analytics:sales`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Sales report fetched successfully"));
        return;
    }

    const salesReport = await Order.aggregate([
        { $match: { status: "delivered", paymentStatus: "paid" } },
        { $unwind: "$items" },
        { $match: { "items.vendor": new mongoose.Types.ObjectId(vendorId) } },
        {
            $group: {
                _id: "$items.product",
                productName: { $first: "$items.name" },
                productImage: { $first: "$items.image" },
                totalQuantitySold: { $sum: "$items.quantity" },
                grossRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                orderCount: { $sum: 1 },
            },
        },
        {
            $addFields: {
                netRevenue: { $multiply: ["$grossRevenue", 0.95] },
            },
        },
        { $sort: { grossRevenue: -1 } },
    ]);

    await redis.set(cacheKey, JSON.stringify(salesReport), "EX", CACHE_TTL);
    res.json(new ApiResponse(200, salesReport, "Sales report fetched successfully"));
});

export const getInventoryStatus = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = (req as AuthRequest).user?.id;
    const cacheKey = `vendor:${vendorId}:analytics:inventory`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Inventory status fetched successfully"));
        return;
    }

    const inventory = await Product.aggregate([
        { $match: { vendor: new mongoose.Types.ObjectId(vendorId), isActive: true } },
        {
            $addFields: {
                stockLevel: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$stock", 0] }, then: "out_of_stock" },
                            { case: { $lte: ["$stock", 10] }, then: "low_stock" },
                        ],
                        default: "healthy",
                    },
                },
            },
        },
        {
            $group: {
                _id: "$stockLevel",
                count: { $sum: 1 },
                products: {
                    $push: {
                        _id: "$_id",
                        name: "$name",
                        stock: "$stock",
                        price: "$price",
                        images: { $first: "$images" },
                    },
                },
            },
        },
    ]);

    const normalized = { out_of_stock: [], low_stock: [], healthy: [] } as Record<string, any[]>;
    for (const group of inventory) {
        normalized[group._id] = group.products;
    }

    await redis.set(cacheKey, JSON.stringify(normalized), "EX", CACHE_TTL);
    res.json(new ApiResponse(200, normalized, "Inventory status fetched successfully"));
});

export const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = (req as AuthRequest).user?.id;
    const cacheKey = `vendor:${vendorId}:analytics:top-products`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Top products fetched successfully"));
        return;
    }

    const topProducts = await Order.aggregate([
        { $match: { status: "delivered", paymentStatus: "paid" } },
        { $unwind: "$items" },
        { $match: { "items.vendor": new mongoose.Types.ObjectId(vendorId) } },
        {
            $group: {
                _id: "$items.product",
                productName: { $first: "$items.name" },
                productImage: { $first: "$items.image" },
                totalQuantitySold: { $sum: "$items.quantity" },
                grossRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                orderCount: { $sum: 1 },
            },
        },
        {
            $addFields: { netRevenue: { $multiply: ["$grossRevenue", 0.95] } },
        },
        { $sort: { grossRevenue: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                productName: 1,
                productImage: 1,
                totalQuantitySold: 1,
                grossRevenue: 1,
                netRevenue: 1,
                orderCount: 1,
                "product.ratings": 1,
                "product.slug": 1,
            },
        },
    ]);

    await redis.set(cacheKey, JSON.stringify(topProducts), "EX", CACHE_TTL);
    res.json(new ApiResponse(200, topProducts, "Top products fetched successfully"));
});

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = (req as AuthRequest).user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const cacheKey = `vendor:${vendorId}:reviews:${page}:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Reviews fetched successfully"));
        return;
    }

    const vendorProductIds = await Product.find({ vendor: vendorId }).distinct("_id");

    const [reviews, total] = await Promise.all([
        Review.find({ product: { $in: vendorProductIds } })
            .populate("buyer", "name avatar")
            .populate("product", "name slug images")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Review.countDocuments({ product: { $in: vendorProductIds } }),
    ]);

    const data = { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);
    res.json(new ApiResponse(200, data, "Reviews fetched successfully"));
});

export const replyToReview = asyncHandler(async (req: Request, res: Response) => {
    const vendorId = (req as AuthRequest).user?.id;
    const { message } = req.body;

    const review = await Review.findById(req.params.id).populate("product");
    if (!review) throw new ApiError(404, "Review not found");

    const product = await Product.findById(review.product);
    if (!product || product.vendor.toString() !== vendorId.toString()) {
        throw new ApiError(403, "You are not authorized to reply to this review");
    }

    if (review.vendorReply?.message) {
        throw new ApiError(400, "You have already replied to this review");
    }

    review.vendorReply = { message, repliedAt: new Date() };
    await review.save();

    await bustVendorCache(vendorId, `vendor:{vendorId}:reviews:*`);
    res.json(new ApiResponse(200, review, "Reply posted successfully"));
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const vendor = await User.findById((req as AuthRequest).user?.id).lean();
    if (!vendor) throw new ApiError(404, "Vendor not found");
    res.json(new ApiResponse(200, vendor, "Profile fetched successfully"));
});
