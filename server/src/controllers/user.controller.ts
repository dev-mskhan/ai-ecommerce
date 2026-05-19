import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import type { JwtPayload } from "../utils/generateToken.js";
import User from "../models/User.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import redis from "../config/redis.js";
import { deleteCloudinaryImage, extractPublicId, uploadToCloudinary } from "../services/cloudinary.service.js";
import mongoose from "mongoose";

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = (req as Request & { user: JwtPayload }).user;
    const redisUser = await redis.get(`user:${id}`);
    if (redisUser) return res.json(new ApiResponse(200, JSON.parse(redisUser), "User fetched successfully"))
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    await redis.set(`user:${id}`, JSON.stringify(user), "EX", 60 * 60 * 24 * 30);
    return res.json(new ApiResponse(200, user, "User fetched successfully"))
})
export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id } = (req as Request & { user: JwtPayload }).user;
    await User.findByIdAndDelete(id);
    res.clearCookie("access_token").clearCookie("refresh_token");
    await redis.del(`user:${id}`);
    return res.json(new ApiResponse(200, null, "Account deleted successfully"));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = (req as Request & { user: JwtPayload }).user;
    const file = req.file as Express.Multer.File;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(id);
        if (!user) throw new ApiError(404, "User not found");
        if (file) {
            const uploadResult = await uploadToCloudinary(file.buffer, "ecommerce/users", `user_${Date.now()}_${file.originalname.split(".")[0]}`);
            if (user.avatar) await deleteCloudinaryImage(extractPublicId(user.avatar));
            user.avatar = uploadResult.url;
        }
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        await user.save();
        await redis.set(`user:${id}`, JSON.stringify(user), "EX", 60 * 60 * 24 * 30);
        return res.json(new ApiResponse(200, user, "User updated successfully"))
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

})