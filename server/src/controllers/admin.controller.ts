import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

export const approveVendor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const vendor = await User.findOneAndUpdate({ _id: id, role: "vendor" }, { isApproved: true }, { new: true });
    if (!vendor) throw new ApiError(404, "Vendor not found");
    res.json(new ApiResponse(200, vendor, "Vendor approved successfully"));
});

export const rejectVendor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const vendor = await User.findOneAndUpdate({ _id: id, role: "vendor" }, { isApproved: false, rejectReason: reason }, { new: true });
    if (!vendor) throw new ApiError(404, "Vendor not found");
    res.json(new ApiResponse(200, vendor, "Vendor rejected successfully"));
});


export const banVendor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isBanned } = req.body;
    const user = await User.findOneAndUpdate({ _id: id, role: "vendor" }, { isBanned }, { new: true });
    if (!user) throw new ApiError(404, "Vendor not found");
    res.json(new ApiResponse(200, user, `Vendor ${isBanned ? "banned" : "unbanned"} successfully`));
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    res.json(new ApiResponse(200, { orders, page, limit }, "Orders fetched successfully"));
});
export const getAllVendors = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const vendors = await User.find({ role: "vendor" })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    res.json(new ApiResponse(200, { vendors, page, limit }, "Vendors fetched successfully"));
})

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const [revenueAnalytics, orderAnalytics, totalRevenueResult] =
        await Promise.all([
            Order.aggregate([
                { $match: { status: "delivered", paymentStatus: "paid" } },
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        totalRevenue: { $sum: { $multiply: ["$total", 0.05] } },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            Order.aggregate([
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        totalOrders: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            Order.aggregate([
                { $match: { status: "delivered", paymentStatus: "paid" } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: { $multiply: ["$total", 0.05] } },
                    },
                },
            ]),
        ]);

    const totalRevenue = totalRevenueResult![0]?.totalRevenue ?? 0;

    res.json(
        new ApiResponse(
            200,
            { totalRevenue, revenueAnalytics, orderAnalytics },
            "Dashboard stats fetched successfully"
        )
    );
});
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const users = await User.find({ role: "buyer" }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    if (!users) throw new ApiError(404, "Users not found");
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = users.filter((user: any) => user.updatedAt >= thirtyDaysAgo);
    res.json(new ApiResponse(200, { users, activeUsers }, "Users fetched successfully"));
});

export const getUserStats = asyncHandler(async (req: Request, res: Response) => {

    const [totalUsers, totalVendors, userGrowth, topVendors] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "vendor" }),
        User.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    newUsers: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        Order.aggregate([
            { $match: { status: "delivered", paymentStatus: "paid" } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.vendor",
                    totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { totalSales: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            { $unwind: "$vendor" },
            {
                $project: {
                    storeName: "$vendor.storeName",
                    storeAvatar: "$vendor.storeAvatar",
                    totalSales: 1,
                    orderCount: 1,
                    companyRevenue: { $multiply: ["$totalSales", 0.05] },
                },
            },
        ]),
    ]);

    res.json(
        new ApiResponse(
            200,
            { totalUsers, totalVendors, userGrowth, topVendors },
            "User stats fetched successfully"
        )
    );
});

export const monitorReportedProducts = asyncHandler(async (req: Request, res: Response) => {
    const reportedProducts = await Product.find({ isReported: true });
    res.json(new ApiResponse(200, reportedProducts, "Reported products fetched successfully"));
});

export const handleReportedProduct = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { action } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    if (action === "remove") {
        await product.deleteOne();
        res.json(new ApiResponse(200, null, "Product removed successfully"));
    } else if (action === "dismiss") {
        product.isReported = false;
        product.reportCount = 0;
        await product.save();
        res.json(new ApiResponse(200, product, "Report dismissed successfully"));
    }
    throw new ApiError(400, "Invalid action. Use 'remove' or 'dismiss'");
});