import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import type { SearchProductInput } from "../validators/product.validator.js";
import type { PipelineStage } from 'mongoose';

export const searchProducts = async (params: SearchProductInput) => {
    const { q, category, vendor, minPrice, maxPrice, rating, page = 1, limit = 20, sort } = params;
    const skip = (page - 1) * limit;

    type SortOrder = 1 | -1;
    type SortStage = Record<string, SortOrder>;

    const sortStage: SortStage = (
        sort === "price_asc" ? { price: 1 } :
            sort === "price_desc" ? { price: -1 } :
                sort === "rating" ? { "ratings.average": -1 } :
                    { createdAt: -1 }
    ) as SortStage;

    const isObjectId = (val: string) => /^[a-f\d]{24}$/i.test(val);

    const categoryLookupStages: PipelineStage[] = category && !isObjectId(category)
        ? [
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryData',
                },
            },
            { $match: { 'categoryData.name': { $regex: category, $options: 'i' } } },
        ]
        : [];

    const matchStage: Record<string, unknown> = { isActive: true };
    if (category && isObjectId(category))
        matchStage.category = new mongoose.Types.ObjectId(category);
    if (vendor) matchStage.vendor = vendor;
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

    const projectStage: PipelineStage = {
        $project: {
            name: 1, slug: 1, price: 1, discountPrice: 1, stock: 1,
            images: { $slice: ["$images", 1] },
            ratings: 1, category: 1, vendor: 1, tags: 1,
            ...(q && { score: { $meta: "searchScore" } }),
        },
    };

    const [data, total] = await Promise.all([
        Product.aggregate([...pipeline, { $skip: skip }, { $limit: limit }, projectStage]),
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