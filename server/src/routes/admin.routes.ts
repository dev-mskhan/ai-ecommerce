import { Router } from "express";
import authHandler from "../middleware/auth.middleware.js";
import roleCheck from "../middleware/roleCheck.middleware.js";
import {
    approveVendor,
    banVendor,
    rejectVendor,
    getAllOrders,
    monitorReportedProducts,
    handleReportedProduct,
    getDashboardStats,
    getUserStats,
    getAllVendors
} from "../controllers/admin.controller.js";
import validateRequest from "../middleware/validate.middleware.js";
import { adminApproveVendorSchema, adminBanVendorSchema, adminRejectVendorSchema } from "../validators/admin.validator";

const router = Router();

router.use(authHandler, roleCheck("admin"));

router.get('/vendors', getAllVendors);
router.patch("/vendor/:id/approve", validateRequest(adminApproveVendorSchema, "params"), approveVendor);
router.patch("/vendor/:id/reject", validateRequest(adminRejectVendorSchema, "params"), rejectVendor);
router.patch("/vendor/:id/ban", validateRequest(adminBanVendorSchema, "params"), banVendor);

router.get("/orders", getAllOrders);

router.get("/reported-products", monitorReportedProducts);
router.patch("/reported-products/:productId/handle", handleReportedProduct);

router.get('/dashboard', getDashboardStats);
router.get('/user-stats', getUserStats);
export default router;