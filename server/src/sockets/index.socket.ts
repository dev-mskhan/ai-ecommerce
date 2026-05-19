import { Server } from "socket.io";
import { registerChatHandlers } from "./chat.socket.js";
import { registerNotificationHandlers } from "./notification.socket.js";
import { registerStockHandlers } from "./stock.socket.js";
import { registerOrderHandlers } from "./order.socket.js";
import { verifySocketToken } from "../middleware/socket.middleware.js";

export const initSocketServer = (io: Server): void => {
    io.use(verifySocketToken);

    io.on("connection", (socket) => {
        console.log(`[Socket] Connected: ${socket.id} | User: ${socket.data.user._id}`);

        registerNotificationHandlers(io, socket);
        registerChatHandlers(io, socket);
        registerStockHandlers(io, socket);
        registerOrderHandlers(io, socket);

        socket.on("disconnect", (reason) => {
            console.log(`[Socket] Disconnected: ${socket.id} | Reason: ${reason}`);
        });
    });
};