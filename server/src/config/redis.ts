import { Redis } from "ioredis";
import env from "./env.js";
export const redisConnection = {
    host: new URL(env.redisUrl).hostname,
    port: Number(new URL(env.redisUrl).port) || 6379,
    maxRetriesPerRequest: null,
};
const redis = new Redis(env.redisUrl, {
    retryStrategy(times) {
        console.log(`Retrying Redis connection... attempt ${times}`);
        return Math.min(times * 500, 5000);
    },
});

redis.on("connect", () => console.log("Redis connected"));

redis.on("ready", () => {
    console.log("Redis ready");
});

redis.on("error", (err: Error) => {
    console.error("Redis error:", err.message);
});

export default redis;