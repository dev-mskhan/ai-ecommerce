import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { parseJsonFields } from './parseJsonFields';
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_, file: Express.Multer.File, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new Error("Only Jpeg, Jpg, Png, Webp, Avif images are allowed"));
        }
        cb(null, true);
    }
});

export const parseFormData = (fieldName = 'image', multi = false) =>
    (req: Request, res: Response, next: NextFunction) => {
        const handler = multi ? upload.array(fieldName) : upload.single(fieldName);
        handler(req, res, () => {
            parseJsonFields(req, res, next);
        });
    };