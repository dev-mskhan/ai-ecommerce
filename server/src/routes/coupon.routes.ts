import { Router } from "express";
import {
    validateAndCalculateCoupon,
    applyCoupon,
    createCoupon,
    deleteCoupon,
    getAllCoupons,
    toggleCoupon,
    updateCoupon,
} from "../controllers/coupon.controller.js";
import validateRequest from "../middleware/validate.middleware.js";
import authHandler from "../middleware/auth.middleware.js";
import { createCouponSchema, applyCouponSchema, updateCouponSchema } from "../validators/coupon.validator.js";
import roleCheck from "../middleware/roleCheck.middleware.js";

const router = Router();

router.post("/apply", validateRequest(applyCouponSchema, "body"), applyCoupon);
router.post("/create", authHandler, roleCheck('admin'), validateRequest(createCouponSchema, "body"), createCoupon);
router.delete("/delete/:id", authHandler, roleCheck('admin'), deleteCoupon);
router.patch('/update/:id', authHandler, roleCheck('admin'), validateRequest(updateCouponSchema, "body", "params"), updateCoupon);
router.get("/get", authHandler, roleCheck('admin'), getAllCoupons);
router.post("/toggle/:id", authHandler, roleCheck('admin'), toggleCoupon);

export default router;
