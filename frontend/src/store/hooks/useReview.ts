import {
    useGetProductReviewsQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useToggleLikeMutation,
    useVendorReplyMutation,
    useToggleApprovalMutation,
    useAdminDeleteReviewMutation,
    useGetUserReviewsQuery,
} from "@api/reviewApi";

export const useProductReviews = (productId: string) =>
    useGetProductReviewsQuery(productId);
export const useUserReviews = () =>
    useGetUserReviewsQuery();

export const useReviewActions = () => ({
    create: useCreateReviewMutation(),
    update: useUpdateReviewMutation(),
    remove: useDeleteReviewMutation(),
    toggleLike: useToggleLikeMutation(),
    vendorReply: useVendorReplyMutation(),
    toggleApproval: useToggleApprovalMutation(),
    adminDelete: useAdminDeleteReviewMutation(),
});