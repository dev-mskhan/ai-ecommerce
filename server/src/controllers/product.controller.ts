import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Product from "../models/Product.model.js";
import { uploadToCloudinary, deleteCloudinaryImage, extractPublicId } from "../services/cloudinary.service.js";
import { searchProducts } from "../services/search.service.js";
import type { JwtPayload } from "../utils/generateToken.js";
import mongoose from "mongoose";
import { productEmbeddingQueue } from "../jobs/queue.js";
import redis from "../config/redis.js";
import type { Server } from "socket.io";
import { emitStockUpdate } from "../sockets/stock.socket.js";
import { createAndEmitNotification } from "../sockets/notification.socket.js";

type AuthRequest = Request & { user: JwtPayload };

const CACHE_TTL = 60 * 5;

const bustVendorCache = async (userId: string) => {
    const keys = await redis.keys(`vendor:${userId}:products:*`);
    if (keys.length) await redis.del(...keys);
};

const bustProductCache = async (slug: string) => {
    await redis.del(`product:${slug}`, "all_products:*");
};

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;
    const files = req.files as Express.Multer.File[];

    if (!files?.length) throw new ApiError(400, "At least one image is required");

    const images = await Promise.all(
        files.map(f => uploadToCloudinary(f.buffer, "ecommerce/products", `product_${Date.now()}_${f.originalname.split(".")[0]}`))
    ).then(imgs => imgs.map(i => i.url)).catch(() => { throw new ApiError(502, "Image upload failed"); });

    const product = await Product.create({ ...req.body, images, vendor: userId });
    const io: Server = req.app.get("io");

    if (product.stock !== undefined) {
        await emitStockUpdate(io, product._id.toString(), product.stock, userId);
    }
    await Promise.all([
        bustVendorCache(userId),
        productEmbeddingQueue.add("generate-embedding", { productId: product._id }),
    ]);

    res.status(201).json(new ApiResponse(201, product, "Product created"));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;

    const product = await Product.findOne({ _id: req.params.id, vendor: userId });
    if (!product) throw new ApiError(404, "Product not found");

    const files = req.files as Express.Multer.File[];
    if (files?.length) {
        await Promise.allSettled(product.images.map(img => deleteCloudinaryImage(extractPublicId(img))));
        product.images = await Promise.all(
            files.map(f => uploadToCloudinary(f.buffer, "ecommerce/products", `product_${Date.now()}_${f.originalname.split(".")[0]}`))
        ).then(imgs => imgs.map(i => i.url)).catch(() => { throw new ApiError(502, "Image upload failed"); });
    }

    const { name, description, price, discountPrice, stock, category, variants, tags, seo } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (variants !== undefined) product.variants = variants;
    if (tags !== undefined) product.tags = tags;
    if (seo !== undefined) product.seo = seo;

    await product.save();

    const io: Server = req.app.get("io");
    if (stock !== undefined) {
        await emitStockUpdate(io, product._id.toString(), product.stock, userId);
    }
    const EMBEDDING_FIELDS = ["name", "description", "tags", "price"];
    const shouldRegenerate = EMBEDDING_FIELDS.some(f => f in req.body);
    await Promise.all([
        bustVendorCache(userId),
        bustProductCache(product.slug),
        shouldRegenerate && productEmbeddingQueue.add("generate-embedding", { productId: product._id }),
    ]);

    res.json(new ApiResponse(200, product, "Product updated"));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;

    const product = await Product.findOne({ _id: req.params.id, vendor: userId });
    if (!product) throw new ApiError(404, "Product not found");

    await Promise.allSettled(product.images.map(img => deleteCloudinaryImage(extractPublicId(img))));
    await product.deleteOne();
    const io: Server = req.app.get("io");

    await createAndEmitNotification(io, {
        recipient: product.vendor.toString() as any,
        type: "system",
        title: "Product Removed by Admin",
        message: `Your product "${product.name}" has been removed by an admin.`,
        data: { productId: product._id.toString() },
    });
    await Promise.all([bustVendorCache(userId), bustProductCache(product.slug)]);

    res.json(new ApiResponse(200, null, "Product deleted"));
});

export const getVendorProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const cacheKey = `vendor:${userId}:products:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(new ApiResponse(200, JSON.parse(cached), "Products fetched"));

    const [products, total] = await Promise.all([
        Product.find({ vendor: userId })
            .populate("category", "name slug")
            .select("name slug price discountPrice images ratings isActive isFeatured createdAt")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Product.countDocuments({ vendor: userId }),
    ]);

    const data = { products, total, page, totalPages: Math.ceil(total / limit) };
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, data, "Products fetched"));
});

export const toggleProductStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;

    const product = await Product.findOne({ _id: req.params.id, vendor: userId });
    if (!product) throw new ApiError(404, "Product not found");

    product.isActive = !product.isActive;
    await product.save();
    const io: Server = req.app.get("io");

    if (!product.isActive) {
        await createAndEmitNotification(io, {
            recipient: userId as any,
            type: "system",
            title: "Product Deactivated",
            message: `"${product.name}" has been deactivated.`,
            data: { productId: product._id.toString() },
        });
    }
    await Promise.all([bustVendorCache(userId), bustProductCache(product.slug)]);

    res.json(new ApiResponse(200, product, `Product ${product.isActive ? "activated" : "deactivated"}`));
});

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const params = req.query;
    const cacheKey = `all_products:${JSON.stringify(params)}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(new ApiResponse(200, JSON.parse(cached), "Products fetched"));

    const result = await searchProducts(params);
    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, result, "Products fetched"));
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = `product:${req.params.slug}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(new ApiResponse(200, JSON.parse(cached), "Product fetched"));

    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
        .populate("category", "name slug")
        .populate("vendor", "name storeName storeAvatar")
        .lean();
    if (!product) throw new ApiError(404, "Product not found");

    await redis.set(cacheKey, JSON.stringify(product), "EX", CACHE_TTL);

    res.json(new ApiResponse(200, product, "Product fetched"));
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate("category", "name slug").lean();
    if (!product) throw new ApiError(404, "Product not found");
    res.json(new ApiResponse(200, product, "Product fetched"));
});

export const adminDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    await Promise.allSettled(product.images.map(img => deleteCloudinaryImage(extractPublicId(img))));
    await product.deleteOne();

    await bustProductCache(product.slug);

    res.json(new ApiResponse(200, null, "Product deleted by admin"));
});

export const toggleFeaturedProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    product.isFeatured = !product.isFeatured;
    await product.save();
    const io: Server = req.app.get("io");

    await createAndEmitNotification(io, {
        recipient: product.vendor.toString() as any,
        type: "system",
        title: product.isFeatured ? "Product Featured" : "Product Unfeatured",
        message: `"${product.name}" has been ${product.isFeatured ? "added to" : "removed from"} featured products.`,
        data: { productId: product._id.toString() },
    });
    await bustProductCache(product.slug);

    return res.json(new ApiResponse(200, product, `Product ${product.isFeatured ? "featured" : "unfeatured"}`));
});

export const updateStock = asyncHandler(async (req: Request, res: Response) => {
    const { id } = (req as AuthRequest).user;
    const product = await Product.findOne({ _id: req.params.id, vendor: id });
    if (!product) throw new ApiError(404, "Product not found");
    const { stock } = req.body;
    if (stock !== undefined) product.stock = stock;
    await product.save();
    return res.json(new ApiResponse(200, product, "Stock updated"));
})