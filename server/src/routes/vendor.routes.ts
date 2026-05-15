import { Router } from "express";
import authHandler from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { updateVendor, upgradeToVendor } from "../controllers/vendor.controller.js";
import roleCheck from "../middleware/roleCheck.middleware.js";
import { parseFormData } from "../middleware/upload.middleware.js";
import { vendorUpdateSchema, vendorUpgradeSchema } from "../validators/user.validator.js";
import {
    getDashboardStats,
    getRevenueAnalytics,
    getSalesReport,
    getInventoryStatus,
    getTopProducts,
    getProductReviews,
    replyToReview,
    getProfile,
} from "../controllers/vendor.controller.js";
import { replyToReviewSchema } from "../validators/user.validator.js";
const router = Router();

router.post("/upgrade", authHandler, roleCheck('buyer'), parseFormData('avatar'), validateRequest(vendorUpgradeSchema, "body"), upgradeToVendor);

router.use(authHandler, roleCheck("vendor"));

// Analytics
router.get("/analytics/dashboard", getDashboardStats);
router.get("/analytics/revenue", getRevenueAnalytics);
router.get("/analytics/sales", getSalesReport);
router.get("/analytics/inventory", getInventoryStatus);
router.get("/analytics/top-products", getTopProducts);

// Reviews
router.get("/reviews", getProductReviews);
router.patch("/reviews/:id/reply", validateRequest(replyToReviewSchema, "body"), replyToReview);

// Profile
router.get("/profile", getProfile);
router.patch('/update', parseFormData('avatar'), validateRequest(vendorUpdateSchema, "body"), updateVendor);

export default router;