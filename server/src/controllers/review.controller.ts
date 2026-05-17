import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Review from "../models/Review.model.js";
import Order from "../models/Order.model.js";
import type { JwtPayload } from "../utils/generateToken.js";

type AuthRequest = Request & { user: JwtPayload };

export const createReview = asyncHandler(async (req: Request, res: Response) => {
    const { id: buyerId } = (req as AuthRequest).user;
    const { product, order, rating, title, comment } = req.body;

    const purchasedOrder = await Order.findOne({
        _id: order,
        buyer: buyerId,
        "items.product": product,
        paymentStatus: "paid",
    });
    if (!purchasedOrder) throw new ApiError(403, "You can only review products you have purchased");

    const existing = await Review.findOne({ product, buyer: buyerId });
    if (existing) throw new ApiError(409, "You have already reviewed this product");

    const review = await Review.create({
        product,
        buyer: buyerId,
        order,
        rating,
        title,
        comment,
        isVerifiedPurchase: true,
    });

    res.status(201).json(new ApiResponse(201, review, "Review submitted"));
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
    const { id: buyerId } = (req as AuthRequest).user;
    const { rating, title, comment } = req.body;
    const review = await Review.findOne({ _id: req.params.id, buyer: buyerId });
    if (!review) throw new ApiError(404, "Review not found");

    review.rating = rating ?? review.rating;
    review.title = title ?? review.title;
    review.comment = comment ?? review.comment;
    review.isApproved = false;

    await review.save();

    return res.json(new ApiResponse(200, review, "Review updated"));
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { id: buyerId } = (req as AuthRequest).user;

    const review = await Review.findOneAndDelete({ _id: req.params.id, buyer: buyerId });
    if (!review) throw new ApiError(404, "Review not found");

    return res.json(new ApiResponse(200, null, "Review deleted"));
});

export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = (req as AuthRequest).user;
    const review = await Review.findById(req.params.id);
    const { type } = req.body;
    if (!review) throw new ApiError(404, "Review not found");

    if (type === "like") {
        const alreadyLiked = review.likes.some(id => id.toString() === userId);
        if (alreadyLiked) {
            review.likes = review.likes.filter(id => id.toString() !== userId) as any;
        } else {
            review.likes.push(userId as any);
        }
        await review.save();

        return res.json(new ApiResponse(200, { likes: review.likes.length }, alreadyLiked ? "Like removed" : "Review liked"));
    } else if (type === "dislike") {
        const alreadyDisliked = review.dislikes.some(id => id.toString() === userId);
        if (alreadyDisliked) {
            review.dislikes = review.dislikes.filter(id => id.toString() !== userId) as any;
        } else {
            review.dislikes.push(userId as any);
        }
        await review.save();

        return res.json(new ApiResponse(200, { dislikes: review.dislikes.length }, alreadyDisliked ? "Dislike removed" : "Review disliked"));
    }
    throw new ApiError(400, "Invalid like type");

});

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, rating, sortBy, order } = req.query as any;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
        product: req.params.productId,
        isApproved: true,
    };
    if (rating) filter.rating = Number(rating);

    const sortField = sortBy === "likes" ? "likes" : sortBy;
    const sortOrder = order === "asc" ? 1 : -1;

    const [reviews, total] = await Promise.all([
        Review.find(filter)
            .populate("buyer", "name avatar")
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(Number(limit)),
        Review.countDocuments(filter),
    ]);

    return res.json(new ApiResponse(200, { reviews, total, page: Number(page), totalPages: Math.ceil(total / limit) }, "Reviews fetched"));
});

export const vendorReply = asyncHandler(async (req: Request, res: Response) => {
    const { id: vendorId } = (req as AuthRequest).user;
    const { message } = req.body;

    const review = await Review.findById(req.params.id).populate("product");
    if (!review) throw new ApiError(404, "Review not found");

    const product = review.product as any;
    if (product.vendor.toString() !== vendorId) throw new ApiError(403, "Not your product");

    review.vendorReply = { message, repliedAt: new Date() };
    await review.save();

    return res.json(new ApiResponse(200, review, "Reply added"));
});

export const toggleApproval = asyncHandler(async (req: Request, res: Response) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw new ApiError(404, "Review not found");

    review.isApproved = !review.isApproved;
    await review.save();

    return res.json(new ApiResponse(200, review, `Review ${review.isApproved ? "approved" : "unapproved"}`));
});

export const adminDeleteReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await Review.findOneAndDelete({ _id: req.params.id });
    if (!review) throw new ApiError(404, "Review not found");

    return res.json(new ApiResponse(200, null, "Review deleted by admin"));
});