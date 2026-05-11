import express from "express";
import { signup, login, verifyEmail, logout, refreshAccessToken, forgotPassword, resetPassword } from "./controllers/auth.controller"
import validateRequest from "./middleware/validate.middleware";
import authRoutes from "./routes/auth.routes";
import vendorRoutes from "./routes/vendor.routes";
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/vendor', vendorRoutes);


export default router;