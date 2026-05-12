import { z } from "zod";

export const sendMessageSchema = z.object({
    message: z.string().min(1, "Message is required").max(1000),
    chatId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;