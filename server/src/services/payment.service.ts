import Stripe from "stripe";
import env from "../config/env.js";

export const stripe = new Stripe(env.stripeSecretKey, {
    apiVersion: "2026-04-22.dahlia",
});
export const createPaymentIntent = async (
    amount: number,
    currency: string = "usd",
    metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> => {
    const amountInUSD = amount / 278;
    return await stripe.paymentIntents.create({
        amount: Math.round(amountInUSD * 100),
        currency,
        metadata: {
            ...metadata,
            originalAmountPKR: amount.toString(),
        },
        automatic_payment_methods: { enabled: true },
    });
};

export const retrievePaymentIntent = async (
    paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
};