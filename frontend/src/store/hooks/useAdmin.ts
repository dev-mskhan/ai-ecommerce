import {
    useGetAllVendorsQuery,
    useGetAllUsersQuery,
    useGetAllOrdersQuery,
    useApproveVendorMutation,
    useRejectVendorMutation,
    useBanVendorMutation,
    useGetReportedProductsQuery,
    useHandleReportedProductMutation,
    useGetDashboardStatsQuery,
    useGetUserStatsQuery,
} from "@api/adminApi";

export const useAdmin = () => ({
    vendors: useGetAllVendorsQuery(),
    users: useGetAllUsersQuery(),
    orders: useGetAllOrdersQuery(),
    dashboard: useGetDashboardStatsQuery(),
    userStats: useGetUserStatsQuery(),
    reportedProducts: useGetReportedProductsQuery(),
    approveVendor: useApproveVendorMutation(),
    rejectVendor: useRejectVendorMutation(),
    banVendor: useBanVendorMutation(),
    handleReportedProduct: useHandleReportedProductMutation(),
});