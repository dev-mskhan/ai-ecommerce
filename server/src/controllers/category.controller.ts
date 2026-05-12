import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Category from "../models/Category.model.js";
import { deleteCloudinaryImage, extractPublicId, uploadToCloudinary } from "../services/cloudinary.service.js";

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const files = req.files as Express.Multer.File[];
    if (!files?.length) throw new ApiError(400, "At least one image is required");
    const images: string[] = await Promise.all(
        files.map(f => uploadToCloudinary(f.buffer, "ecommerce/categories", `category_${Date.now()}_${f.originalname.split(".")[0]}`)))
        .then(images => images.map(img => img.url));

    const existing = await Category.findOne({ name });
    if (existing) throw new ApiError(409, "Category already exists");

    const category = await Category.create({ name, description, images });
    res.status(201).json(new ApiResponse(201, category, "Category created"));
});

export const getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.find()
        .populate("name slug")
        .sort({ createdAt: -1 });
    res.json(new ApiResponse(200, categories, "Categories fetched"));
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id).populate("name slug");
    if (!category) throw new ApiError(404, "Category not found");
    res.json(new ApiResponse(200, category, "Category fetched"));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");
    const updateData: Record<string, unknown> = { ...req.body };
    const files = req.files as Express.Multer.File[];
    if (files?.length) {
        await Promise.all(category.images.map(img => deleteCloudinaryImage(extractPublicId(img))));
        const newImages: string[] = await Promise.all(
            files.map(f => uploadToCloudinary(f.buffer, "ecommerce/categories", `category_${Date.now()}_${f.originalname.split(".")[0]}`))
        ).then(images => images.map(img => img.url));
        updateData.images = newImages;

    }
    const updated = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
    if (!updated) throw new ApiError(404, "Category not found");
    res.json(new ApiResponse(200, category, "Category updated"));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");
    await Promise.all(category.images.map(img => deleteCloudinaryImage(extractPublicId(img))));
    await category.deleteOne();
    res.json(new ApiResponse(200, null, "Category deleted"));
});

export const toggleCategoryStatus = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");

    category.isActive = !category.isActive;
    await category.save();
    res.json(new ApiResponse(200, category, `Category ${category.isActive ? "activated" : "deactivated"}`));
});