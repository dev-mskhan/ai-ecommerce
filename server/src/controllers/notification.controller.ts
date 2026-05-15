import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import Notification from "../models/Notification.model.js";
import type { JwtPayload } from "../utils/generateToken.js";
import redis from "../config/redis.js";

type AuthRequest = Request & { user: JwtPayload };

const CACHE_TTL = 60 * 5;

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const cacheKey = `notifications:${userId}:${page}:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.json(new ApiResponse(200, JSON.parse(cached), "Notifications fetched"));
    }

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Notification.countDocuments({ recipient: userId }),
        Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    const data = { notifications, total, unreadCount, page, totalPages: Math.ceil(total / limit) };

    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

    return res.json(new ApiResponse(200, data, "Notifications fetched"));
});

export const markOneRead = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;
    const keys = await redis.keys(`notifications:${userId}:*`);
    if (keys.length) await redis.del(...keys);
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: userId },
        { isRead: true },
        { new: true }
    );
    if (!notification) throw new ApiError(404, "Notification not found");

    return res.json(new ApiResponse(200, notification, "Marked as read"));
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;
    const keys = await redis.keys(`notifications:${userId}:*`);
    if (keys.length) await redis.del(...keys);
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });

    return res.json(new ApiResponse(200, null, "All notifications marked as read"));
});