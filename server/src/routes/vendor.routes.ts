import { Router } from "express";
import authHandler from "../middleware/auth.middleware";
import validateRequest from "../middleware/validate.middleware";
import { vendorUpgradeSchema } from "../validators/user.validator";
import { upgradeToVendor } from "../controllers/vendor.controller";
import roleCheck from "../middleware/roleCheck.middleware";

const router = Router();

router.post("/upgrade", authHandler, roleCheck('buyer'), validateRequest(vendorUpgradeSchema, "body"), upgradeToVendor);

export default router;