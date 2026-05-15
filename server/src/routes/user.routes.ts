import { Router } from "express";
import { deleteAccount, getCurrentUser, updateUser } from "../controllers/user.controller.js";
import authHandler from "../middleware/auth.middleware.js";
import { parseFormData } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/me", authHandler, getCurrentUser);
router.patch("/me", authHandler, parseFormData('avatar'), updateUser);
router.delete("/me", authHandler, deleteAccount);
export default router;