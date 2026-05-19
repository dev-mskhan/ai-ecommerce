import { Server, Socket } from "socket.io";
import { verifySocketToken } from "../middleware/socket.middleware.js";

interface TypingPayload {
    chatId: string;
    recipientId: string;
}

interface ChatMessagePayload {
    chatId: string;
    message: string;
    recipientId?: string;
}

export const registerChatHandlers = (io: Server, socket: Socket): void => {
    const userId = socket.data.user.id.toString();

    // Join a specific chat room
    socket.on("chat:join", (chatId: string) => {
        socket.join(`chat:${chatId}`);
    });

    // Leave a chat room
    socket.on("chat:leave", (chatId: string) => {
        socket.leave(`chat:${chatId}`);
    });

    // Typing indicator — broadcast to the other participant(s) in the room
    socket.on("chat:typing", ({ chatId, recipientId }: TypingPayload) => {
        socket.to(`chat:${chatId}`).emit("chat:typing", {
            chatId,
            userId,
            isTyping: true,
        });
    });

    // Stopped typing
    socket.on("chat:stop_typing", ({ chatId, recipientId }: TypingPayload) => {
        socket.to(`chat:${chatId}`).emit("chat:typing", {
            chatId,
            userId,
            isTyping: false,
        });
    });

    // Acknowledge a message as read
    socket.on("chat:read", ({ chatId }: { chatId: string }) => {
        socket.to(`chat:${chatId}`).emit("chat:read", { chatId, readBy: userId });
    });
};