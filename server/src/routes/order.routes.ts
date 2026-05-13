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
} from "../controllers/order.controller";
import validateRequest from "../middleware/validate.middleware";
import authHandler from "../middleware/auth.middleware";
import { createOrderSchema, updateOrderStatusSchema, cancelOrderSchema, orderQuerySchema } from "../validators/order.validator";
import roleCheck from "../middleware/roleCheck.middleware";

const router = Router();

router.post("/create", authHandler, validateRequest(createOrderSchema), createOrder);
router.get("/get", authHandler, validateRequest(orderQuerySchema), getMyOrders);
router.get("/get/:id", authHandler, getOrderById);
router.post("/vendor/update/:id", authHandler, validateRequest(updateOrderStatusSchema), vendorUpdateOrderStatus);
router.post("/cancel/:id", authHandler, validateRequest(cancelOrderSchema), cancelOrder);

router.get("/vendor", authHandler, roleCheck('vendor', 'admin'), validateRequest(orderQuerySchema), getVendorOrders);
router.get("/admin", authHandler, roleCheck('admin'), validateRequest(orderQuerySchema), getAllOrders);
router.post('/admin/update/:id', authHandler, validateRequest(updateOrderStatusSchema), adminUpdateOrderStatus);
export default router;