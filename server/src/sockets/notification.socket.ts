import { Server, Socket } from "socket.io";
import Notification, { type INotification } from "../models/Notification.model.js";

/**
 * Map of userId → Set of socketIds.
 * Stored at module level so other sockets (order, stock) can emit to users.
 */
export const userSocketMap = new Map<string, Set<string>>();

/** Emit a notification to a specific user across ALL their active sockets. */
export const emitToUser = (
    io: Server,
    userId: string,
    event: string,
    payload: unknown
): void => {
    const sockets = userSocketMap.get(userId);
    if (!sockets) return;
    sockets.forEach((socketId) => io.to(socketId).emit(event, payload));
};

/** Create a Notification document and push it live to the recipient. */
export const createAndEmitNotification = async (
    io: Server,
    data: Partial<INotification>
): Promise<INotification> => {
    const notification = await Notification.create(data);
    const populated = await notification.populate("sender", "name avatar");

    emitToUser(io, notification.recipient.toString(), "notification:new", populated);
    return notification;
};

export const registerNotificationHandlers = (io: Server, socket: Socket): void => {
    const userId = socket.data.user._id.toString();

    // Track socket → user mapping
    if (!userSocketMap.has(userId)) userSocketMap.set(userId, new Set());
    userSocketMap.get(userId)!.add(socket.id);

    // Join personal notification room (alternative to the map approach)
    socket.join(`notifications:${userId}`);

    // Mark a single notification as read
    socket.on("notification:read", async (notificationId: string) => {
        await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { isRead: true }
        );
        socket.emit("notification:read_ack", { notificationId });
    });

    // Mark ALL notifications as read
    socket.on("notification:read_all", async () => {
        await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
        socket.emit("notification:read_all_ack");
    });

    // Fetch unread count on demand
    socket.on("notification:unread_count", async () => {
        const count = await Notification.countDocuments({ recipient: userId, isRead: false });
        socket.emit("notification:unread_count", { count });
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
        const sockets = userSocketMap.get(userId);
        if (sockets) {
            sockets.delete(socket.id);
            if (sockets.size === 0) userSocketMap.delete(userId);
        }
    });
};