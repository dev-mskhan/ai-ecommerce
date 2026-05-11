import User from "../models/User.model";
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { type JwtPayload } from "../utils/generateToken";

export const upgradeToVendor = asyncHandler(async (req: Request, res: Response) => {
    const { storeName, storeDescription } = req.body;
    const { id } = (req as Request & { user: JwtPayload }).user;
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    if (user.role === "vendor") throw new ApiError(409, "Already a vendor");

    user.role = "vendor";
    user.isApproved = false;
    user.storeName = storeName;
    user.storeDescription = storeDescription;
    await user.save();

    res.json(new ApiResponse(200, null, "Vendor application submitted. Awaiting admin approval."));
});