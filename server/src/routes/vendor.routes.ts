import { Router } from "express";
import authHandler from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { updateVendor, upgradeToVendor } from "../controllers/vendor.controller.js";
import roleCheck from "../middleware/roleCheck.middleware.js";
import { parseFormData } from "../middleware/upload.middleware.js";
import { vendorUpdateSchema, vendorUpgradeSchema } from "../validators/user.validator.js";

const router = Router();

router.post("/upgrade", authHandler, roleCheck('buyer'), parseFormData('avatar'), validateRequest(vendorUpgradeSchema, "body"), upgradeToVendor);
router.patch('/update', authHandler, roleCheck('vendor'), parseFormData('avatar'), validateRequest(vendorUpdateSchema, "body"), updateVendor);

export default router;