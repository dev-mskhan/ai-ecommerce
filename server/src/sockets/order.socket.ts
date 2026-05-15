import { Server, Socket } from "socket.io";
import { createAndEmitNotification } from "./notification.socket.js";
import { emitStockUpdate } from "./stock.socket.js";

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

interface OrderStatusUpdatePayload {
    orderId: string;
    status: OrderStatus;
    buyerId: string;
    vendorId: string;
    /** Array of { productId, newStock, vendorId } after the status change */
    stockUpdates?: Array<{ productId: string; newStock: number; vendorId: string }>;
}

const STATUS_MESSAGES: Record<OrderStatus, string> = {
    pending: "Your order has been placed and is awaiting confirmation.",
    confirmed: "Your order has been confirmed by the vendor.",
    processing: "Your order is being prepared.",
    shipped: "Your order is on its way!",
    delivered: "Your order has been delivered. Enjoy!",
    cancelled: "Your order has been cancelled.",
    refunded: "Your refund has been processed.",
};

/**
 * Called from the order controller after saving the new status to DB.
 * Broadcasts the update to the buyer and triggers relevant notifications.
 */
export const emitOrderStatusUpdate = async (
    io: Server,
    payload: OrderStatusUpdatePayload
): Promise<void> => {
    const { orderId, status, buyerId, vendorId, stockUpdates = [] } = payload;

    // Push live update to buyer's personal room
    io.to(`orders:${buyerId}`).emit("order:status_updated", { orderId, status });

    // Also push to any admin dashboard listening on the order room
    io.to(`order:${orderId}`).emit("order:status_updated", { orderId, status });

    // Persist + emit notification to buyer
    await createAndEmitNotification(io, {
        recipient: buyerId as any,
        type: "order_status_update",
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: STATUS_MESSAGES[status],
        data: { orderId, status },
    });

    // If order is confirmed/cancelled, update stock and notify vendor if low
    for (const su of stockUpdates) {
        await emitStockUpdate(io, su.productId, su.newStock, su.vendorId);
    }

    // Notify vendor when buyer receives the order
    if (status === "delivered") {
        await createAndEmitNotification(io, {
            recipient: vendorId as any,
            type: "order_status_update",
            title: "Order Delivered",
            message: "One of your orders has been marked as delivered.",
            data: { orderId },
        });
    }
};

export const registerOrderHandlers = (io: Server, socket: Socket): void => {
    const userId = socket.data.user._id.toString();
    const role: string = socket.data.user.role;

    // Buyer subscribes to their own order updates feed
    socket.on("orders:subscribe", () => {
        socket.join(`orders:${userId}`);
    });

    // Vendor / admin joins a specific order room for detailed tracking
    socket.on("order:watch", (orderId: string) => {
        if (role === "admin" || role === "vendor") {
            socket.join(`order:${orderId}`);
        }
    });

    socket.on("order:unwatch", (orderId: string) => {
        socket.leave(`order:${orderId}`);
    });
};