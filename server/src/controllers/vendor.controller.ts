import User from "../models/User.model.js";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import type { JwtPayload } from "../utils/generateToken.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

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

    res.status(200).json(new ApiResponse(200, null, "Vendor application submitted. Awaiting admin approval."));
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

    res.status(200).json(new ApiResponse(200, null, "Vendor profile updated successfully."));
});