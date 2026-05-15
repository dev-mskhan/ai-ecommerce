import { Server, Socket } from "socket.io";
import Product from "../models/Product.model.js";
import { createAndEmitNotification } from "./notification.socket.js";

const LOW_STOCK_THRESHOLD = 5;

/**
 * Broadcast a stock update to everyone watching a product page
 * and notify the vendor if stock is low / zero.
 */
export const emitStockUpdate = async (
    io: Server,
    productId: string,
    newStock: number,
    vendorId: string
): Promise<void> => {
    // Broadcast to all clients subscribed to this product's stock room
    io.to(`stock:${productId}`).emit("stock:updated", { productId, stock: newStock });

    if (newStock === 0) {
        await createAndEmitNotification(io, {
            recipient: vendorId as any,
            type: "product_out_of_stock",
            title: "Product Out of Stock",
            message: "One of your products is now out of stock.",
            data: { productId },
        });
    } else if (newStock <= LOW_STOCK_THRESHOLD) {
        await createAndEmitNotification(io, {
            recipient: vendorId as any,
            type: "product_low_stock",
            title: "Low Stock Alert",
            message: `Stock is running low (${newStock} remaining).`,
            data: { productId, stock: newStock },
        });
    }
};

export const registerStockHandlers = (io: Server, socket: Socket): void => {
    // Client subscribes to live stock updates for a specific product
    socket.on("stock:watch", (productId: string) => {
        socket.join(`stock:${productId}`);
    });

    socket.on("stock:unwatch", (productId: string) => {
        socket.leave(`stock:${productId}`);
    });

    // Admin / vendor can manually trigger a stock refresh broadcast
    socket.on("stock:refresh", async (productId: string) => {
        const product = await Product.findById(productId).select("stock vendor").lean();
        if (!product) return;

        io.to(`stock:${productId}`).emit("stock:updated", {
            productId,
            stock: product.stock,
        });
    });
};