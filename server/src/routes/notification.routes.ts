import { Router } from "express";
import {
    getNotifications,
    markOneRead,
    markAllRead,
} from "../controllers/notification.controller.js";
import authHandler from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", authHandler, getNotifications);
router.patch("/read-all", authHandler, markAllRead);
router.patch("/:id/read", authHandler, markOneRead);

export default router;