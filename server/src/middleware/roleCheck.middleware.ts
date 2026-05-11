import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import type { Role } from "../models/User.model";
import { JwtPayload } from "../utils/generateToken";

const roleCheck = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as Request & { user: JwtPayload }).user;
        if (!roles.includes(user.role)) throw new ApiError(403, "Access denied");
        next();
    };
};

export default roleCheck;