import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Product from "../models/Product.model.js";
import { uploadToCloudinary, deleteCloudinaryImage, extractPublicId } from "../services/cloudinary.service.js";
import { searchProducts } from "../services/search.service.js";
import { SearchProductInput } from "../validators/product.validator.js";
import { JwtPayload } from "../utils/generateToken.js";
import { buildProductEmbedding, generateEmbedding } from "../services/ai.service.js";

// vendor controller methods

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as Request & { user: JwtPayload }).user;
    const files = req.files as Express.Multer.File[];
    if (!files?.length) throw new ApiError(400, "At least one image is required");

    const images = await Promise.all(
        files.map(f =>
            uploadToCloudinary(f.buffer, "ecommerce/products", `product_${Date.now()}_${f.originalname.split(".")[0]}`)
        )
    ).then(images => images.map(img => img.url));

    const product = await Product.create({
        ...req.body,
        images,
        vendor: userId,
    });
    await product.populate<{ category: { name: string } }>('category', 'name');
    product.embedding = await generateEmbedding(buildProductEmbedding(product));
    await product.save();

    res.status(201).json(new ApiResponse(201, product, "Product created"));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as Request & { user: JwtPayload }).user;
    const product = await Product.findOne({ _id: req.params.id, vendor: userId });
    if (!product) throw new ApiError(404, "Product not found");

    const updateData: Record<string, unknown> = { ...req.body };

    const files = req.files as Express.Multer.File[];
    if (files?.length) {
        await Promise.all((product.images).map(async img => deleteCloudinaryImage(extractPublicId(img))));
        updateData.images = await Promise.all(
            files.map(f =>
                uploadToCloudinary(f.buffer, "ecommerce/products", `product_${Date.now()}_${f.originalname.split(".")[0]}`)
            )
        ).then(images => images.map(img => img.url));
    }

    const EMBEDDING_FIELDS = ['name', 'description', 'tags', 'price'];
    const shouldRegenerate = EMBEDDING_FIELDS.some(f => f in updateData);

    Object.assign(product, updateData);
    if (shouldRegenerate) {
        await product.populate<{ category: { name: string } }>('category', 'name');
        product.embedding = await generateEmbedding(buildProductEmbedding(product));
    }
    await product.save();
    res.json(new ApiResponse(200, product, "Product updated"));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as Request & { user: JwtPayload }).user;
    const product = await Product.findOne({ _id: req.params.id, vendor: userId });
    if (!product) throw new ApiError(404, "Product not found");

    await Promise.all((product.images).map(async img => deleteCloudinaryImage(extractPublicId(img))));
    await product.deleteOne();

    res.json(new ApiResponse(200, null, "Product deleted"));
});

export const getVendorProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const { id: userId } = (req as Request & { user: JwtPayload }).user;

    const [products, total] = await Promise.all([
        Product.find({ vendor: userId })
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Product.countDocuments({ vendor: userId }),
    ]);

    res.json(new ApiResponse(200, { products, total, page, totalPages: Math.ceil(total / limit) }, "Products fetched"));
});

export const toggleProductStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as Request & { user: JwtPayload }).user;
    const product = await Product.findOne({ _id: req.params.id, vendor: userId });
    if (!product) throw new ApiError(404, "Product not found");

    product.isActive = !product.isActive;
    await product.save();

    res.json(new ApiResponse(200, product, `Product ${product.isActive ? "activated" : "deactivated"}`));
});

// public controller methods

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const params = (req as any).query as SearchProductInput;
    const result = await searchProducts(params);
    res.json(new ApiResponse(200, result, "Products fetched"));
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
        .populate("category", "name slug")
        .populate("vendor", "name storeName storeAvatar");
    if (!product) throw new ApiError(404, "Product not found");
    res.json(new ApiResponse(200, product, "Product fetched"));
});

// Admin controller methods

export const adminDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    await Promise.all((product.images).map(async img => deleteCloudinaryImage(extractPublicId(img))));
    await product.deleteOne();

    res.json(new ApiResponse(200, null, "Product deleted by admin"));
});

export const toggleFeaturedProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.json(new ApiResponse(200, product, `Product ${product.isFeatured ? "featured" : "unfeatured"}`));
});