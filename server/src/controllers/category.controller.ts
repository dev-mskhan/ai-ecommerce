import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Category from "../models/Category.model.js";
import { deleteCloudinaryImage, extractPublicId, uploadToCloudinary } from "../services/cloudinary.service.js";
import redis from "../config/redis.js";

const CACHE_TTL = 60 * 5;

const bustCategoryCache = async (id?: string) => {
    const keys = await redis.keys("categories:*");
    if (keys.length) await redis.del(...keys);
    if (id) await redis.del(`category:${id}`);
};

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files?.length) throw new ApiError(400, "At least one image is required");
    if (await Category.findOne({ name })) throw new ApiError(409, "Category already exists");

    const images = await Promise.all(
        files.map(f => uploadToCloudinary(f.buffer, "ecommerce/categories", `category_${Date.now()}_${f.originalname.split(".")[0]}`))
    ).then(imgs => imgs.map(i => i.url)).catch(() => { throw new ApiError(502, "Image upload failed"); });

    try {
        const category = await Category.create({ name, description, images });
        await bustCategoryCache();
        res.status(201).json(new ApiResponse(201, category, "Category created"));
    } catch (error: any) {
        await Promise.allSettled(images.map(url => deleteCloudinaryImage(extractPublicId(url))));
        throw new ApiError(500, "Failed to create category");
    }
});

export const getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
    const cacheKey = "categories:all";

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(new ApiResponse(200, JSON.parse(cached), "Categories fetched"));

    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    await redis.set(cacheKey, JSON.stringify(categories), "EX", CACHE_TTL);

    return res.json(new ApiResponse(200, categories, "Categories fetched"));
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = `category:${req.params.id}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(new ApiResponse(200, JSON.parse(cached), "Category fetched"));

    const category = await Category.findById(req.params.id).select("name slug").lean();
    if (!category) throw new ApiError(404, "Category not found");

    await redis.set(cacheKey, JSON.stringify(category), "EX", CACHE_TTL);

    return res.json(new ApiResponse(200, category, "Category fetched"));
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = `category-slug:${req.params.slug}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(new ApiResponse(200, JSON.parse(cached), "Category fetched"));

    const category = await Category.findOne({ slug: req.params.slug }).select("name slug images").lean();
    if (!category) throw new ApiError(404, "Category not found");

    await redis.set(cacheKey, JSON.stringify(category), "EX", CACHE_TTL);

    return res.json(new ApiResponse(200, category, "Category fetched"));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");

    const files = req.files as Express.Multer.File[];
    if (files?.length) {
        await Promise.allSettled(category.images.map(img => deleteCloudinaryImage(extractPublicId(img))));
        category.images = await Promise.all(
            files.map(f => uploadToCloudinary(f.buffer, "ecommerce/categories", `category_${Date.now()}_${f.originalname.split(".")[0]}`))
        ).then(imgs => imgs.map(i => i.url)).catch(() => { throw new ApiError(502, "Image upload failed"); });
    }

    const { name, description } = req.body;
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;

    await category.save();
    await bustCategoryCache(req.params.id as string);

    return res.json(new ApiResponse(200, category, "Category updated"));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");

    await Promise.allSettled(category.images.map(img => deleteCloudinaryImage(extractPublicId(img))));
    await category.deleteOne();
    await bustCategoryCache(req.params.id as string);

    return res.json(new ApiResponse(200, null, "Category deleted"));
});

export const toggleCategoryStatus = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");

    category.isActive = !category.isActive;
    await category.save();
    await bustCategoryCache(req.params.id as string);

    return res.json(new ApiResponse(200, category, `Category ${category.isActive ? "activated" : "deactivated"}`));
});