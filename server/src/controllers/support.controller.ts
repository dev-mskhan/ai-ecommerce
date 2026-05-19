import type { Request, Response } from "express";
import type { Server } from "socket.io";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import Chat from "../models/Chat.model.js";
import User from "../models/User.model.js";
import type { JwtPayload } from "../utils/generateToken.js";
import { createAndEmitNotification } from "../sockets/notification.socket.js";

type AuthRequest = Request & { user: JwtPayload };

export const createSupportChat = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;
    const { message } = req.body;
    const io: Server = req.app.get("io");

    const chat = await Chat.create({
        user: userId,
        type: "support",
        status: "open",
        messages: [{ role: "user", content: message }],
    });

    const admins = await User.find({ role: "admin" }).select("_id").lean();
    await Promise.all(admins.map(admin =>
        createAndEmitNotification(io, {
            recipient: admin._id,
            type: "new_message",
            title: "New Support Ticket",
            message: message.slice(0, 80),
            data: { chatId: chat._id.toString() },
        })
    ));

    return res.status(201).json(new ApiResponse(201, chat, "Support ticket created"));
});

export const sendSupportMessage = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId, role } = (req as AuthRequest).user;
    const { message } = req.body;
    const io: Server = req.app.get("io");

    const chat = await Chat.findById(req.params.chatId);
    if (!chat || chat.type !== "support") throw new ApiError(404, "Support chat not found");
    if (chat.status === "closed") throw new ApiError(400, "This support ticket is closed");

    const isBuyer = chat.user.toString() === userId;
    const isAdmin = role === "admin";

    if (!isBuyer && !isAdmin) throw new ApiError(403, "Forbidden");

    if (isAdmin && !chat.assignedAdmin) {
        chat.assignedAdmin = userId as any;
    }

    const newMessage = { role: isAdmin ? "admin" : "user", content: message };
    chat.messages.push(newMessage as any);
    await chat.save();

    io.to(`chat:${chat._id}`).emit("chat:new_message", {
        chatId: chat._id.toString(),
        message: newMessage,
    });

    if (isAdmin) {
        await createAndEmitNotification(io, {
            recipient: chat.user.toString() as any,
            type: "new_message",
            title: "Admin replied to your ticket",
            message: message.slice(0, 80),
            data: { chatId: chat._id.toString() },
        });
    } else {
        if (chat.assignedAdmin) {
            await createAndEmitNotification(io, {
                recipient: chat.assignedAdmin.toString() as any,
                type: "new_message",
                title: "New message in support ticket",
                message: message.slice(0, 80),
                data: { chatId: chat._id.toString() },
            });
        } else {
            const admins = await User.find({ role: "admin" }).select("_id").lean();
            await Promise.all(admins.map(admin =>
                createAndEmitNotification(io, {
                    recipient: admin._id,
                    type: "new_message",
                    title: "New message in support ticket",
                    message: message.slice(0, 80),
                    data: { chatId: chat._id.toString() },
                })
            ));
        }
    }

    return res.json(new ApiResponse(200, chat, "Message sent"));
});

export const getMySupport = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;
    const chats = await Chat.find({ user: userId, type: "support" })
        .select("status assignedAdmin messages createdAt updatedAt")
        .sort({ updatedAt: -1 });
    return res.json(new ApiResponse(200, chats, "Support chats fetched"));
});

export const getAllSupport = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const filter: any = { type: "support" };
    if (status) filter.status = status;

    const chats = await Chat.find(filter)
        .populate("user", "name email")
        .populate("assignedAdmin", "name email")
        .select("user assignedAdmin status messages createdAt updatedAt")
        .sort({ updatedAt: -1 });
    return res.json(new ApiResponse(200, chats, "All support chats fetched"));
});

export const getSupportChat = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId, role } = (req as AuthRequest).user;

    const chat = await Chat.findById(req.params.chatId)
        .populate("user", "name email")
        .populate("assignedAdmin", "name email");
    if (!chat || chat.type !== "support") throw new ApiError(404, "Support chat not found");

    const isBuyer = chat.user._id.toString() === userId;
    const isAdmin = role === "admin";
    if (!isBuyer && !isAdmin) throw new ApiError(403, "Forbidden");

    return res.json(new ApiResponse(200, chat, "Support chat fetched"));
});

export const closeSupportChat = asyncHandler(async (req: Request, res: Response) => {
    const { id: adminId } = (req as AuthRequest).user;
    const io: Server = req.app.get("io");

    const chat = await Chat.findById(req.params.chatId);
    if (!chat || chat.type !== "support") throw new ApiError(404, "Support chat not found");
    if (chat.status === "closed") throw new ApiError(400, "Ticket is already closed");

    chat.status = "closed";
    await chat.save();

    await createAndEmitNotification(io, {
        recipient: chat.user.toString() as any,
        type: "system",
        title: "Support Ticket Closed",
        message: "Your support ticket has been resolved and closed.",
        data: { chatId: chat._id.toString() },
    });

    io.to(`chat:${chat._id}`).emit("chat:closed", { chatId: chat._id.toString() });

    return res.json(new ApiResponse(200, chat, "Support ticket closed"));
});