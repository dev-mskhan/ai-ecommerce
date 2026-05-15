// admin.routes.ts
import { Router } from "express";
import authHandler from "../middleware/auth.middleware.js";
import roleCheck from "../middleware/roleCheck.middleware.js";
import {
    approveVendor,
    banVendor,
    rejectVendor,
    getAllOrders,
    getAllVendors,
    getAllUsers,
    monitorReportedProducts,
    handleReportedProduct,
    getDashboardStats,
    getUserStats,
} from "../controllers/admin.controller.js";
import validateRequest from "../middleware/validate.middleware.js";
import {
    adminApproveVendorSchema,
    adminBanVendorSchema,
    adminRejectVendorSchema,
    adminHandleReportedProductSchema,
} from "../validators/admin.validator.js";

const router = Router();

router.use(authHandler, roleCheck("admin"));

router.get("/vendors", getAllVendors);
router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);

router.patch("/vendor/approve/:id", validateRequest(adminApproveVendorSchema, "params"), approveVendor);
router.patch("/vendor/reject/:id", validateRequest(adminRejectVendorSchema, "params", "body"), rejectVendor);
router.patch("/vendor/ban/:id", validateRequest(adminBanVendorSchema, "params"), banVendor);

router.get("/reported-products", monitorReportedProducts);
router.patch("/reported-products/handle/:id", validateRequest(adminHandleReportedProductSchema, "params", "body"), handleReportedProduct);

router.get("/dashboard", getDashboardStats);
router.get("/user-stats", getUserStats);

export default router;