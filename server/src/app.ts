import express from "express";
import router from "./routes.js";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.middleware.js";
import ApiError from "./utils/apiError.js";
import pinoHttp from 'pino-http';
import logger from './config/logger.js';
import swaggerUi from 'swagger-ui-express';
import { JsonObject } from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const app = express();
const swaggerSpec = yaml.load(fs.readFileSync(path.join(__dirname, '../swagger.yaml'), 'utf8')) as JsonObject;

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// handlers
app.use((req, res, next) => {
    next(new ApiError(404, "Not Found"));
})
app.use(errorHandler);

export default app;