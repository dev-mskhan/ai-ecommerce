import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery,
    tagTypes: ["Vendors", "Users", "AdminOrders", "ReportedProducts", "Dashboard", "UserStats"],
    endpoints: (builder) => ({
        getAllVendors: builder.query<any, void>({
            query: () => "/admin/vendors",
            providesTags: ["Vendors"],
        }),

        getAllUsers: builder.query<any, void>({
            query: () => "/admin/users",
            providesTags: ["Users"],
        }),

        getAllOrders: builder.query<any, void>({
            query: () => "/admin/orders",
            providesTags: ["AdminOrders"],
        }),

        approveVendor: builder.mutation<any, string>({
            query: (id) => ({ url: `/admin/vendor/approve/${id}`, method: "PATCH" }),
            invalidatesTags: ["Vendors", "Users"],
        }),

        rejectVendor: builder.mutation<any, { id: string; reason?: string }>({
            query: ({ id, ...body }) => ({ url: `/admin/vendor/reject/${id}`, method: "PATCH", body }),
            invalidatesTags: ["Vendors", "Users"],
        }),

        banVendor: builder.mutation<any, string>({
            query: (id) => ({ url: `/admin/vendor/ban/${id}`, method: "PATCH" }),
            invalidatesTags: ["Vendors", "Users"],
        }),

        getReportedProducts: builder.query<any, void>({
            query: () => "/admin/reported-products",
            providesTags: ["ReportedProducts"],
        }),

        handleReportedProduct: builder.mutation<any, { id: string; action: string }>({
            query: ({ id, ...body }) => ({ url: `/admin/reported-products/handle/${id}`, method: "PATCH", body }),
            invalidatesTags: ["ReportedProducts"],
        }),

        getDashboardStats: builder.query<any, void>({
            query: () => "/admin/dashboard",
            providesTags: ["Dashboard"],
        }),

        getUserStats: builder.query<any, void>({
            query: () => "/admin/user-stats",
            providesTags: ["UserStats"],
        }),
    }),
});

export const {
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
} = adminApi;