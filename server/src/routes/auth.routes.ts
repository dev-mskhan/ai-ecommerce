import { Router } from "express";
import validateRequest from "../middleware/validate.middleware";
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/user.validator";
import { signup, login, verifyEmail, logout, refreshAccessToken, forgotPassword, resetPassword } from "../controllers/auth.controller";
import authHandler from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", validateRequest(signupSchema, "body"), signup);
router.post("/login", validateRequest(loginSchema, "body"), login);
router.post("/verify-email/:token", verifyEmail);
router.post("/logout", authHandler, logout);
router.post("/refresh-access-token", refreshAccessToken);
router.post("/forgot-password", validateRequest(forgotPasswordSchema, "body"), forgotPassword);
router.patch("/reset-password/:token", validateRequest(resetPasswordSchema, "body"), resetPassword);

export default router;