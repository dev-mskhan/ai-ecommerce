import { Router } from "express";
import {
    validateAndCalculateCoupon,
    applyCoupon,
    createCoupon,
    deleteCoupon,
    getAllCoupons,
    toggleCoupon,
} from "../controllers/coupon.controller";
import validateRequest from "../middleware/validate.middleware";
import authHandler from "../middleware/auth.middleware";
import { createCouponSchema, applyCouponSchema } from "../validators/coupon.validator";
import roleCheck from "../middleware/roleCheck.middleware";

const router = Router();

router.post("/apply", validateRequest(applyCouponSchema), applyCoupon);
router.post("/create", authHandler, roleCheck('admin'), validateRequest(createCouponSchema), createCoupon);
router.delete("/delete/:id", authHandler, roleCheck('admin'), deleteCoupon);
router.get("/get", authHandler, roleCheck('admin'), getAllCoupons);
router.post("/toggle/:id", authHandler, roleCheck('admin'), toggleCoupon);

export default router;
