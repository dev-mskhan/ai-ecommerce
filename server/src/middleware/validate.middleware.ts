import { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

type Source = "body" | "query" | "params";

const validateRequest = (schema: ZodSchema, source: Source = "body") =>
    (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const message = result.error.issues
                .map(e => `${e.path.join(".")}: ${e.message}`)
                .join(", ");
            return next(new ApiError(422, message));
        }
        req.body = source === "body" ? result.data : req.body;
        (req as any)[source] = result.data;
        next();
    };

export default validateRequest;