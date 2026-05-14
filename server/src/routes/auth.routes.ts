import { Router } from "express";
import validateRequest from "../middleware/validate.middleware.js";
import { signupSchemaBuyer, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator.js";
import { signup, login, verifyEmail, logout, refreshAccessToken, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import authHandler from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", validateRequest(signupSchemaBuyer, "body"), signup);
router.post("/login", validateRequest(loginSchema, "body"), login);
router.post("/verify-email/:token", verifyEmail);
router.post("/logout", authHandler, logout);
router.post("/refresh-access-token", refreshAccessToken);
router.post("/forgot-password", validateRequest(forgotPasswordSchema, "body"), forgotPassword);
router.patch("/reset-password/:token", validateRequest(resetPasswordSchema, "body"), resetPassword);

export default router;