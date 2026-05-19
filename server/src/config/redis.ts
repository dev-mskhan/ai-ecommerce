import { Redis } from "ioredis";
import env from "./env.js";
export const redisConnection = {
    host: new URL(env.redisUrl).hostname,
    port: Number(new URL(env.redisUrl).port) || 6379,
    maxRetriesPerRequest: null,
};
const redisOptions = {
    host: new URL(env.redisUrl).hostname,
    port: Number(new URL(env.redisUrl).port) || 6379,
    password: new URL(env.redisUrl).password,
    tls: {},
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times: number) {
        if (times > 10) return null;
        return Math.min(times * 200, 2000);
    },
    reconnectOnError(err: Error) {
        return err.message.includes('ECONNRESET') ||
            err.message.includes('ETIMEDOUT');
    },
};

const redis = new Redis(redisOptions);

redis.on("connect", () => console.log("Redis connected"));

redis.on("ready", () => {
    console.log("Redis ready");
});

redis.on("error", (err: Error) => {
    console.error("Redis error:", err.message);
});

export default redis;