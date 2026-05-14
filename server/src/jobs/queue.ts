import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const productEmbeddingQueue = new Queue("product-embedding", { connection: redisConnection });