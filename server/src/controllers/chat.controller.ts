import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import Chat from "../models/Chat.model.js";
import { processAIChat } from "../services/ai.service.js";
import type { JwtPayload } from "../utils/generateToken.js";

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { message, chatId } = req.body;
    const userId = (req as Request & { user: JwtPayload }).user?.id ?? null;

    const result = await processAIChat(userId, message, chatId);
    return res.json(new ApiResponse(200, result, "Message sent"));
});

export const getChatHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user: JwtPayload }).user.id;
    const chat = await Chat.findOne({ _id: req.params.chatId, user: userId })
        .populate("messages.products", "name price slug images");
    if (!chat) throw new ApiError(404, "Chat not found");
    return res.json(new ApiResponse(200, chat, "Chat fetched"));
});

export const getUserChats = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user: JwtPayload }).user.id;
    const chats = await Chat.find({ user: userId })
        .select("createdAt updatedAt messages")
        .sort({ updatedAt: -1 });
    return res.json(new ApiResponse(200, chats, "Chats fetched"));
});

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user: JwtPayload }).user.id;
    await Chat.findOneAndDelete({ _id: req.params.chatId, user: userId });
    return res.json(new ApiResponse(200, null, "Chat deleted"));

});