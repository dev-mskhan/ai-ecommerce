import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import type { SearchProductInput } from "../validators/product.validator.js";
import type { PipelineStage } from 'mongoose';

export const searchProducts = async (params: SearchProductInput["query"]) => {
    const { q, categoryId, minPrice, maxPrice, rating, page = 1, limit = 20, sort, order = "desc" } = params;
    const skip = (page - 1) * limit;

    type SortOrder = 1 | -1;
    type SortStage = Record<string, SortOrder>;

    const sortStage: SortStage = (
        sort === "price_asc" ? { price: 1 } :
            sort === "price_desc" ? { price: -1 } :
                sort === "rating" ? { "ratings.average": -1 } :
                    sort === "newest" ? { createdAt: -1 } :
                        sort === "discountPrice_asc" ? { discountPrice: 1 } :
                            sort === "discountPrice_desc" ? { discountPrice: -1 } :
                                { createdAt: -1 }
    ) as SortStage;

    const isObjectId = (val: string) => /^[a-f\d]{24}$/i.test(val);

    const categoryLookupStages: PipelineStage[] = categoryId && !isObjectId(categoryId)
        ? [
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryData',
                },
            },
            { $match: { 'categoryData.name': { $regex: categoryId, $options: 'i' } } },
        ]
        : [];
    const matchStage: Record<string, unknown> = { isActive: true };
    if (categoryId && isObjectId(categoryId))
        matchStage.category = new mongoose.Types.ObjectId(categoryId);
    if (minPrice !== undefined || maxPrice !== undefined) {
        matchStage.price = {
            ...(minPrice !== undefined && { $gte: minPrice }),
            ...(maxPrice !== undefined && { $lte: maxPrice }),
        };
    }
    if (rating) matchStage["ratings.average"] = { $gte: rating };

    const pipeline: PipelineStage[] = q
        ? [
            {
                $search: {
                    index: "products_search",
                    compound: {
                        should: [
                            { text: { query: q, path: "name", score: { boost: { value: 3 } } } },
                            { text: { query: q, path: "tags", score: { boost: { value: 2 } } } },
                            { text: { query: q, path: "description" } },
                        ],
                    },
                },
            },
            { $match: matchStage },
            ...categoryLookupStages,
            { $sort: { score: { $meta: "searchScore" }, ...sortStage } },
        ] as PipelineStage[]
        : [
            { $match: matchStage },
            ...categoryLookupStages,
            { $sort: sortStage },
        ];

    const [data, total] = await Promise.all([
        Product.aggregate([...pipeline, { $skip: Number(skip) }, { $limit: Number(limit) },
        ...(categoryLookupStages.length === 0 ? [{
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryData',
            },
        }] : []),
        {
            $lookup: {
                from: 'users',
                localField: 'vendor',
                foreignField: '_id',
                as: 'vendorData',
                pipeline: [
                    { $match: { isApproved: true, role: "vendor" } },
                    { $project: { storeName: 1, storeAvatar: 1, isApproved: 1 } },
                ],
            },
        },
        {
            $project: {
                name: 1, slug: 1, price: 1, discountPrice: 1, stock: 1,
                images: { $slice: ["$images", 1] },
                ratings: 1, tags: 1,
                isFeatured: 1,
                isActive: 1,
                isReported: 1,
                categoryData: { name: 1, slug: 1 },
                vendorData: 1,
                ...(q && { score: { $meta: "searchScore" } }),
            },
        }
        ]),
        Product.aggregate([...pipeline, { $count: "total" }]),
    ]);

    return {
        products: data,
        total: total[0]?.total ?? 0,
        page,
        limit,
        totalPages: Math.ceil((total[0]?.total ?? 0) / limit),
    };
};