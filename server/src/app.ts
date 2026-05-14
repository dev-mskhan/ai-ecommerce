import express from "express";
import router from "./routes.js";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.middleware.js";
import ApiError from "./utils/apiError.js";
import { pinoHttp } from "pino-http";
import logger from './config/logger.js';
import swaggerUi from 'swagger-ui-express';
import type { JsonObject } from 'swagger-ui-express';
import yaml from 'js-yaml';
import "./jobs/worker.js";
import fs from 'fs';
import { stripeWebhook } from "./controllers/payment.controller.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.post(
    "/api/v1/payments/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);
const swaggerSpec = yaml.load(
    fs.readFileSync(path.join(__dirname, 'docs/bundle.yaml'), 'utf8')
) as JsonObject;

// Global middlewares
app.use(cors(
    {
        origin: env.clientUrl,
        credentials: true,
    }
));
app.use(cookieParser(env.jwtSecret));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(pinoHttp({ logger }));

// Routes
app.use("/api/v1", router);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// handlers
app.use((req, res, next) => {
    next(new ApiError(404, "Not Found"));
})
app.use(errorHandler);

export default app;