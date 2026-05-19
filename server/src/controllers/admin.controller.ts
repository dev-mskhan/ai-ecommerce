// admin.controller.ts
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import redis from "../config/redis.js";

const CACHE_TTL = 60 * 5;


const bustAdminCache = async (...patterns: string[]) => {
    const pipeline = redis.pipeline();

    for (const pattern of patterns) {
        if (pattern.includes("*")) {
            const stream = redis.scanStream({ match: pattern, count: 100 });
            await new Promise<void>((resolve, reject) => {
                stream.on("data", (keys: string[]) => {
                    if (keys.length) pipeline.del(...keys);
                });
                stream.on("end", resolve);
                stream.on("error", reject);
            });
        } else {
            pipeline.del(pattern);
        }
    }

    await pipeline.exec();
};

export const approveVendor = asyncHandler(async (req: Request, res: Response) => {
    const vendor = await User.findOneAndUpdate({ _id: req.params.id, role: "vendor" }, { isApproved: true }, { new: true });
    if (!vendor) throw new ApiError(404, "Vendor not found");
    await bustAdminCache("admin:vendors:*", "admin:user-stats");
    res.json(new ApiResponse(200, vendor, "Vendor approved successfully"));
});

export const rejectVendor = asyncHandler(async (req: Request, res: Response) => {
    const { reason } = req.body;
    const vendor = await User.findOneAndUpdate({ _id: req.params.id, role: "vendor" }, { isApproved: false, rejectReason: reason }, { new: true });
    if (!vendor) throw new ApiError(404, "Vendor not found");
    await bustAdminCache("admin:vendors:*", "admin:user-stats");
    res.json(new ApiResponse(200, vendor, "Vendor rejected successfully"));
});

export const banVendor = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "vendor") throw new ApiError(404, "Vendor not found");

    const updated = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { isBanned: !user.isBanned } },
        { new: true }
    );
    if (!user) throw new ApiError(404, "Vendor not found");
    await bustAdminCache("admin:vendors:*", "admin:user-stats");
    res.json(new ApiResponse(200, updated, `Vendor ${updated!.isBanned ? "banned" : "unbanned"} successfully`));
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const cacheKey = `admin:orders:${page}:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Orders fetched successfully"));
        return;
    }

    const [orders, total] = await Promise.all([
        Order.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        Order.countDocuments(),
    ]);

    const data = { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, data, "Orders fetched successfully"));
});

export const getAllVendors = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const cacheKey = `admin:vendors:${page}:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Vendors fetched successfully"));
        return;
    }

    const [vendors, total] = await Promise.all([
        User.find({ role: "vendor" }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        User.countDocuments({ role: "vendor" }),
    ]);

    const data = { vendors, total, page, limit, totalPages: Math.ceil(total / limit) };
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, data, "Vendors fetched successfully"));
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const cacheKey = `admin:users:${page}:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Users fetched successfully"));
        return;
    }

    const [users, total] = await Promise.all([
        User.find({ role: "buyer" }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        User.countDocuments({ role: "buyer" }),
    ]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = users.filter((user: any) => user.updatedAt >= thirtyDaysAgo);

    const data = { users, total, activeUsers: activeUsers.length, page, limit, totalPages: Math.ceil(total / limit) };
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, data, "Users fetched successfully"));
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = "admin:dashboard";

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Dashboard stats fetched successfully"));
        return;
    }

    const [revenueAnalytics, orderAnalytics, totalRevenueResult] = await Promise.all([
        Order.aggregate([
            { $match: { status: "delivered", paymentStatus: "paid" } },
            { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, totalRevenue: { $sum: { $multiply: ["$total", 0.05] } } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        Order.aggregate([
            { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, totalOrders: { $sum: 1 } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        Order.aggregate([
            { $match: { status: "delivered", paymentStatus: "paid" } },
            { $group: { _id: null, totalRevenue: { $sum: { $multiply: ["$total", 0.05] } } } },
        ]),
    ]);

    const totalRevenue = totalRevenueResult[0]?.totalRevenue ?? 0;
    const data = { totalRevenue, revenueAnalytics, orderAnalytics };
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, data, "Dashboard stats fetched successfully"));
});

export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = "admin:user-stats";

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "User stats fetched successfully"));
        return;
    }

    const [totalUsers, totalVendors, userGrowth, topVendors] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "vendor" }),
        User.aggregate([
            { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, newUsers: { $sum: 1 } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        Order.aggregate([
            { $match: { status: "delivered", paymentStatus: "paid" } },
            { $unwind: "$items" },
            { $group: { _id: "$items.vendor", totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }, orderCount: { $sum: 1 } } },
            { $sort: { totalSales: -1 } },
            { $limit: 5 },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "vendor" } },
            { $unwind: "$vendor" },
            { $project: { storeName: "$vendor.storeName", storeAvatar: "$vendor.storeAvatar", totalSales: 1, orderCount: 1, companyRevenue: { $multiply: ["$totalSales", 0.05] } } },
        ]),
    ]);

    const data = { totalUsers, totalVendors, userGrowth, topVendors };
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, data, "User stats fetched successfully"));
});

export const monitorReportedProducts = asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = "admin:reported-products";

    const cached = await redis.get(cacheKey);
    if (cached) {
        res.json(new ApiResponse(200, JSON.parse(cached), "Reported products fetched successfully"));
        return;
    }

    const reportedProducts = await Product.find({ isReported: true }).lean();
    await redis.set(cacheKey, JSON.stringify(reportedProducts), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, reportedProducts, "Reported products fetched successfully"));
});

export const handleReportedProduct = asyncHandler(async (req: Request, res: Response) => {
    const { action } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    if (action === "remove") {
        await product.deleteOne();
        await bustAdminCache("admin:reported-products");
        return res.json(new ApiResponse(200, null, "Product removed successfully"));
    }

    if (action === "dismiss") {
        product.isReported = false;
        product.reportCount = 0;
        await product.save();
        await bustAdminCache("admin:reported-products");
        return res.json(new ApiResponse(200, product, "Report dismissed successfully"));
    }

    throw new ApiError(400, "Invalid action. Use 'remove' or 'dismiss'");
});