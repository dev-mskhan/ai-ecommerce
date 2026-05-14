import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Coupon from "../models/Coupon.model.js";
import type { CreateCouponInput, ApplyCouponInput } from "../validators/coupon.validator.js";

export const validateAndCalculateCoupon = async (
    { code, orderAmount }: ApplyCouponInput,
    vendorIds: string[],
    categoryIds: string[]
): Promise<{ coupon: InstanceType<typeof Coupon>; discount: number }> => {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) throw new ApiError(404, "Invalid or inactive coupon");
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError(400, "Coupon has expired");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
        throw new ApiError(400, "Coupon usage limit reached");
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount)
        throw new ApiError(400, `Minimum order amount is ${coupon.minOrderAmount}`);

    if (coupon.applicableVendors.length > 0) {
        const allowed = coupon.applicableVendors.map((v) => v.toString());
        if (!vendorIds.some((v) => allowed.includes(v)))
            throw new ApiError(400, "Coupon not valid for these vendors");
    }

    if (coupon.applicableCategories.length > 0) {
        const allowed = coupon.applicableCategories.map((c) => c.toString());
        if (!categoryIds.some((c) => allowed.includes(c)))
            throw new ApiError(400, "Coupon not valid for these categories");
    }

    let discount =
        coupon.discountType === "percentage"
            ? (orderAmount * coupon.discountValue) / 100
            : coupon.discountValue;

    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    discount = Math.min(discount, orderAmount);

    return { coupon, discount };
};

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const body: CreateCouponInput = req.body;
    const coupon = await Coupon.create(body);
    res.status(201).json(new ApiResponse(201, coupon, "Coupon created"));
});

export const getAllCoupons = asyncHandler(async (_req: Request, res: Response) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(new ApiResponse(200, coupons, "Coupons fetched"));
});

export const toggleCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw new ApiError(404, "Coupon not found");

    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(new ApiResponse(200, coupon, `Coupon ${coupon.isActive ? "activated" : "deactivated"}`));
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw new ApiError(404, "Coupon not found");
    res.json(new ApiResponse(200, null, "Coupon deleted"));
});

export const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
    const body: ApplyCouponInput = req.body;
    const { discount } = await validateAndCalculateCoupon(body, [], []);
    res.json(new ApiResponse(200, { discount, finalAmount: body.orderAmount - discount }, "Coupon applied"));
});