import type { Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import Order from "../models/Order.model.js";
import { stripe } from "../services/payment.service.js";
import env from "../config/env.js";
import ApiResponse from "../utils/apiResponse.js";


export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) return res.status(400).send("Missing stripe-signature header");

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            env.stripeWebhookSecret
        );
    } catch (err: any) {
        throw new ApiError(400, `Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const intent = event.data.object;
            const order = await Order.findOne({ paymentIntentId: intent.id });
            if (!order) break;

            order.paymentStatus = "paid";
            order.status = "confirmed";
            order.statusHistory.push({
                status: "confirmed",
                changedAt: new Date(),
                note: "Payment confirmed via Stripe webhook",
            });
            await order.save();
            break;
        }

        case "payment_intent.payment_failed": {
            const intent = event.data.object;
            const order = await Order.findOne({ paymentIntentId: intent.id });
            if (!order) break;

            order.paymentStatus = "failed";
            order.statusHistory.push({
                status: "pending",
                changedAt: new Date(),
                note: `Payment failed: ${intent.last_payment_error?.message ?? "unknown"}`,
            });
            await order.save();
            break;
        }

        default:
            break;
    }

    res.json(new ApiResponse(200, { received: true }, "Webhook processed successfully"));
};