import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getVendorOrders,
    getAllOrders,
    vendorUpdateOrderStatus,
    adminUpdateOrderStatus
} from "../controllers/order.controller.js";
import validateRequest from "../middleware/validate.middleware.js";
import authHandler from "../middleware/auth.middleware.js";
import { createOrderSchema, updateOrderStatusSchema, cancelOrderSchema, orderQuerySchema } from "../validators/order.validator.js";
import roleCheck from "../middleware/roleCheck.middleware.js";

const router = Router();

router.post("/create", authHandler, validateRequest(createOrderSchema, "body"), createOrder);
router.get("/get", authHandler, validateRequest(orderQuerySchema, "query"), getMyOrders);
router.get("/get/:id", authHandler, getOrderById);
router.patch("/vendor/:id/status", authHandler, roleCheck('vendor'), validateRequest(updateOrderStatusSchema, "body", "params"), vendorUpdateOrderStatus);
router.patch("/customer/:id/cancel", authHandler, roleCheck('buyer'), validateRequest(cancelOrderSchema, "body", "params"), cancelOrder);

router.get("/vendor", authHandler, roleCheck('vendor', 'admin'), validateRequest(orderQuerySchema, "query"), getVendorOrders);
router.get("/admin", authHandler, roleCheck('admin'), validateRequest(orderQuerySchema), getAllOrders);
router.patch('/admin/:id/status', authHandler, validateRequest(updateOrderStatusSchema, "body"), adminUpdateOrderStatus);
export default router;