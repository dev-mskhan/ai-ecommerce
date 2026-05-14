import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import Product from "../models/Product.model.js";
import { buildProductEmbedding, generateEmbedding } from "../services/ai.service.js";

const worker = new Worker("product-embedding", async (job) => {
    if (job.name === "generate-embedding") {
        const { productId } = job.data;
        const product = await Product.findById(productId).populate("category", "name");
        if (!product) return;
        product.embedding = await generateEmbedding(buildProductEmbedding(product));
        await product.save();
    }
}, { connection: redisConnection, concurrency: 3 })