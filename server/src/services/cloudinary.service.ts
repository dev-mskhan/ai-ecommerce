import cloudinary from 'cloudinary';
import { Request } from 'express';
import env from '../config/env';
const CloudinaryConfig = cloudinary.v2;

CloudinaryConfig.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
});



export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string,
    filename: string
) => {
    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        const stream = CloudinaryConfig.uploader.upload_stream(
            {
                folder,
                public_id: filename,
                transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(buffer);
    });
};

export const deleteCloudinaryImage = async (publicId: string): Promise<void> => {
    await CloudinaryConfig.uploader.destroy(publicId);
};
export const extractPublicId = (url: string): string => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder = parts.slice(-3, -1).join('/');
    return `${folder}/${filename}`;
};