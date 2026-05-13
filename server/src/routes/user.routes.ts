import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import authHandler from "../middleware/auth.middleware.js";

const router = Router();

router.get("/current", authHandler, getCurrentUser);
export default router;