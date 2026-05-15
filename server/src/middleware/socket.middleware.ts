import { Socket } from "socket.io";
import { type JwtPayload } from "jsonwebtoken";
import cookie from "cookie";
import { verifyAccessToken } from "../utils/generateToken.js";
import ApiError from "../utils/apiError.js";

export const verifySocketToken = (socket: Socket, next: (err?: Error) => void) => {
    const rawCookie = socket.handshake.headers.cookie;

    if (!rawCookie) return next(new ApiError(401, "Unauthorized"));

    const cookies = cookie.parse(rawCookie);
    const token = cookies["access_token"];

    if (!token) return next(new ApiError(401, "Unauthorized"));

    try {
        const user = verifyAccessToken(token) as JwtPayload;
        socket.data.user = user;
        next();
    } catch (err) {
        next(new ApiError(401, "Invalid token"));
    }
};