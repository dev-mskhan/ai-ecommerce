import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import Product from "../models/Product.model.js";
import { buildProductEmbedding, generateEmbedding } from "../services/ai.service.js";
import { sendEmail } from "../services/email.service.js";
import ApiError from "../utils/apiError.js";

const productWorker = new Worker("product-embedding", async (job) => {
    if (job.name === "generate-embedding") {
        const { productId } = job.data;
        const product = await Product.findById(productId).populate("category", "name");
        if (!product) return;
        product.embedding = await generateEmbedding(buildProductEmbedding(product));
        await product.save();
    }
}, { connection: redisConnection, concurrency: 3 })
const emailWorker = new Worker("email", async (job) => {
    if (job.name === "send-verification-email") {
        const { to, subject, html } = job.data;
        await sendEmail({ to, subject, html });
    }
}, { connection: redisConnection, concurrency: 3 });

productWorker.on("failed", (job, error) => {
    throw new ApiError(400, "Error generating product embedding");
});
emailWorker.on("failed", (job, error) => {
    throw new ApiError(400, "Error sending email");
});