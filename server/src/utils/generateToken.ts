import jwt from "jsonwebtoken";
import env from "../config/env.js";
import type { Response } from "express";
import type { IUser, Role } from "../models/User.model.js";

export interface JwtPayload {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatar?: string;
    isVerified?: boolean;
    isApproved?: boolean;
    isBanned?: boolean;
}
export const generateAccessToken = (payload: JwtPayload) =>
    jwt.sign(payload, env.jwtSecret, { expiresIn: "2h" });

export const generateRefreshToken = (payload: JwtPayload) =>
    jwt.sign({ id: payload.id }, env.jwtRefreshSecret, { expiresIn: "7d" });

export const createJwtPayload = (user: IUser): JwtPayload => {
    const payload: JwtPayload = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isApproved: user.isApproved,
    };
    return payload;
};
export const attachCookieToResponse = (
    res: Response,
    access_token: string,
    refresh_token: string,
) => {
    res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "strict",
        signed: true,
        maxAge: 2 * 60 * 60 * 1000,
    });
    res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "strict",
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const verifyRefreshToken = (token: string) =>
    jwt.verify(token, env.jwtRefreshSecret) as { id: string };

export const verifyAccessToken = (token: string) =>
    jwt.verify(token, env.jwtSecret) as {
        id: string;
        email: string;
        name: string;
        role: string;
        chefId?: string;
    };