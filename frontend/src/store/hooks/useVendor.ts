import {
    useUpgradeToVendorMutation,
    useGetVendorProfileQuery,
    useUpdateVendorMutation,
    useGetVendorDashboardQuery,
    useGetRevenueAnalyticsQuery,
    useGetSalesReportQuery,
    useGetInventoryStatusQuery,
    useGetTopProductsQuery,
    useGetVendorReviewsQuery,
    useReplyToReviewMutation,
} from "@api/vendorApi";

export const useVendorProfile = () => useGetVendorProfileQuery();

export const useVendorAnalytics = () => ({
    dashboard: useGetVendorDashboardQuery(),
    revenue: useGetRevenueAnalyticsQuery(),
    sales: useGetSalesReportQuery(),
    inventory: useGetInventoryStatusQuery(),
    topProducts: useGetTopProductsQuery(),
});

export const useVendorReviews = () => {
    const reviews = useGetVendorReviewsQuery();
    const [reply] = useReplyToReviewMutation();
    return { ...reviews, reply };
};

export const useVendorActions = () => ({
    upgrade: useUpgradeToVendorMutation(),
    update: useUpdateVendorMutation(),
});