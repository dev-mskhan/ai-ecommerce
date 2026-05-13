import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { JwtPayload } from "../utils/generateToken.js";
import User from "../models/User.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = (req as Request & { user: JwtPayload }).user;
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"))
})