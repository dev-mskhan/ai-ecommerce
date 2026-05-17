import {
    useGetAllCouponsQuery,
    useApplyCouponMutation,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useToggleCouponMutation,
} from "@api/couponApi";

export const useCoupons = () => useGetAllCouponsQuery();
export const useCouponActions = () => ({
    apply: useApplyCouponMutation(),
    create: useCreateCouponMutation(),
    update: useUpdateCouponMutation(),
    remove: useDeleteCouponMutation(),
    toggle: useToggleCouponMutation(),
});