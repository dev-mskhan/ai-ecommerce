import { Router } from "express";
import { sendMessage, getChatHistory, getUserChats, deleteChat } from "../controllers/chat.controller.js";
import authHandler, { optionalAuth } from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { sendMessageSchema } from "../validators/chat.validator.js";

const router = Router();

router.post("/send", optionalAuth, validateRequest(sendMessageSchema), sendMessage);
router.get("/", authHandler, getUserChats);
router.get("/:chatId", authHandler, getChatHistory);
router.delete("/:chatId", authHandler, deleteChat);

export default router;