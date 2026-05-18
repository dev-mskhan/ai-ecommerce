import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export const vendorApi = createApi({
    reducerPath: "vendorApi",
    baseQuery,
    tagTypes: [
        "VendorProfile",
        "VendorDashboard",
        "VendorRevenue",
        "VendorSales",
        "VendorInventory",
        "VendorTopProducts",
        "VendorReviews",
    ],
    endpoints: (builder) => ({
        upgradeToVendor: builder.mutation<any, any>({
            query: (body) => ({ url: "/vendors/upgrade", method: "POST", body }),
        }),

        getVendorProfile: builder.query<any, void>({
            query: () => "/vendors/profile",
            providesTags: ["VendorProfile"],
        }),

        updateVendor: builder.mutation<any, any>({
            query: (body) => ({ url: "/vendors/update", method: "PATCH", body }),
            invalidatesTags: ["VendorProfile"],
        }),

        // Analytics
        getVendorDashboard: builder.query<any, void>({
            query: () => "/vendors/analytics/dashboard",
            providesTags: ["VendorDashboard"],
        }),

        getRevenueAnalytics: builder.query<any, void>({
            query: () => "/vendors/analytics/revenue",
            providesTags: ["VendorRevenue"],
        }),

        getSalesReport: builder.query<any, void>({
            query: () => "/vendors/analytics/sales",
            providesTags: ["VendorSales"],
        }),

        getInventoryStatus: builder.query<any, void>({
            query: () => "/vendors/analytics/inventory",
            providesTags: ["VendorInventory"],
        }),

        getTopProducts: builder.query<any, void>({
            query: () => "/vendors/analytics/top-products",
            providesTags: ["VendorTopProducts"],
        }),

        // Reviews
        getVendorReviews: builder.query<any, void>({
            query: () => "/vendors/reviews",
            providesTags: ["VendorReviews"],
        }),

        replyToReview: builder.mutation<any, { id: string; reply: string }>({
            query: ({ id, reply }) => ({ url: `/vendors/reviews/${id}/reply`, method: "PATCH", body: { reply } }),
            invalidatesTags: ["VendorReviews"],
        }),
    }),
});

export const {
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
} = vendorApi;