import { Router } from "express";
import {
    createReview,
    updateReview,
    deleteReview,
    toggleLike,
    getProductReviews,
    vendorReply,
    toggleApproval,
    adminDeleteReview,
    getUserReviews,
} from "../controllers/review.controller.js";
import authHandler from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import {
    createReviewSchema,
    updateReviewSchema,
    vendorReplySchema,
    reviewQuerySchema,
} from "../validators/review.validator.js";
import roleCheck from "../middleware/roleCheck.middleware.js";

const router = Router();

// Public
router.get("/product/:productId", validateRequest(reviewQuerySchema, "params"), getProductReviews);

// Buyer
router.post("/", authHandler, roleCheck("buyer"), validateRequest(createReviewSchema, "body"), createReview);
router.patch("/:id", authHandler, roleCheck("buyer"), validateRequest(updateReviewSchema, "body", "params"), updateReview);
router.delete("/:id", authHandler, roleCheck("buyer"), deleteReview);
router.post("/:id/like", authHandler, roleCheck("buyer"), toggleLike);
router.get("/user", authHandler, roleCheck("buyer"), getUserReviews);

// Vendor
router.post("/:id/reply", authHandler, roleCheck("vendor"), validateRequest(vendorReplySchema, "body", "params"), vendorReply);

// Admin
router.patch("/:id/approve", authHandler, roleCheck("admin"), toggleApproval);
router.delete("/:id/admin", authHandler, roleCheck("admin"), adminDeleteReview);

export default router;