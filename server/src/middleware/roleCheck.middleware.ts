import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import type { Role } from "../models/User.model.js";
import type { JwtPayload } from "../utils/generateToken.js";

const roleCheck = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as Request & { user: JwtPayload }).user;
        if (!roles.includes(user.role)) throw new ApiError(403, "Access denied");
        if (user.role === "vendor" && (!user.isApproved || user.isBanned)) throw new ApiError(403, "Access denied");
        next();
    };
};

export default roleCheck;