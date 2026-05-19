import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import env from "../config/env.js";

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

const createTransporter = (): Transporter => {
    return nodemailer.createTransport({
        host: env.smtpHost,
        port: Number(env.smtpPort),
        secure: env.smtpSecure === "true",
        auth: {
            user: env.smtpUser,
            pass: env.smtpPass,
        },
    });
};

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
    const transporter = createTransporter();

    await transporter.sendMail({
        from: `"AI Ecommerce" <${env.smtpFrom}>`,
        to,
        subject,
        html,
    });
};