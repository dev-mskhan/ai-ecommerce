import { Router } from "express";
import { sendMessage, getChatHistory, getUserChats, deleteChat } from "../controllers/chat.controller.js";
import authHandler, { optionalAuth } from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { sendMessageSchema } from "../validators/chat.validator.js";
import {
    createSupportChat,
    sendSupportMessage,
    getMySupport,
    getAllSupport,
    getSupportChat,
    closeSupportChat,
} from "../controllers/support.controller.js";
import roleCheck from "../middleware/roleCheck.middleware.js";
const router = Router();

router.post("/send", optionalAuth, validateRequest(sendMessageSchema, "body"), sendMessage);
router.get("/", authHandler, getUserChats);
router.get("/:chatId", authHandler, getChatHistory);
router.delete("/:chatId", authHandler, deleteChat);

router.post("/support", authHandler, createSupportChat);
router.post("/support/:chatId", authHandler, sendSupportMessage);
router.get("/support", authHandler, getMySupport);
router.get("/support/all", authHandler, roleCheck("admin"), getAllSupport);
router.get("/support/:chatId", authHandler, getSupportChat);
router.patch("/support/:chatId/close", authHandler, roleCheck("admin"), closeSupportChat);
export default router;