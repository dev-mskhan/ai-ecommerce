import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export interface OrderQuery {
    page?: number;
    limit?: number;
    status?: string;
}

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery,
    tagTypes: ["Orders", "Order", "VendorOrders"],
    endpoints: (builder) => ({
        createOrder: builder.mutation<any, any>({
            query: (body) => ({ url: "/orders/create", method: "POST", body }),
            invalidatesTags: ["Orders", "VendorOrders"],
        }),

        getMyOrders: builder.query<any, OrderQuery>({
            query: (params) => ({ url: "/orders/get", params }),
            providesTags: ["Orders"],
        }),

        getOrderById: builder.query<any, string>({
            query: (id) => `/orders/get/${id}`,
            providesTags: (_, __, id) => [{ type: "Order", id }],
        }),

        cancelOrder: builder.mutation<any, { id: string; reason?: string }>({
            query: ({ id, ...body }) => ({ url: `/orders/customer/${id}/cancel`, method: "PATCH", body }),
            invalidatesTags: (_, __, { id }) => ["Orders", { type: "Order", id }],
        }),

        vendorUpdateOrderStatus: builder.mutation<any, { id: string; status: string }>({
            query: ({ id, ...body }) => ({ url: `/orders/vendor/${id}/status`, method: "PATCH", body }),
            invalidatesTags: (_, __, { id }) => ["VendorOrders", { type: "Order", id }],
        }),

        adminUpdateOrderStatus: builder.mutation<any, { id: string; status: string }>({
            query: ({ id, ...body }) => ({ url: `/orders/admin/${id}/status`, method: "PATCH", body }),
            invalidatesTags: (_, __, { id }) => ["VendorOrders", "Orders", { type: "Order", id }],
        }),

        getVendorOrders: builder.query<any, OrderQuery>({
            query: (params) => ({ url: "/orders/vendor", params }),
            providesTags: ["VendorOrders"],
        }),

        getAdminOrders: builder.query<any, OrderQuery>({
            query: (params) => ({ url: "/orders/admin", params }),
            providesTags: ["Orders"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useCancelOrderMutation,
    useVendorUpdateOrderStatusMutation,
    useAdminUpdateOrderStatusMutation,
    useGetVendorOrdersQuery,
    useGetAdminOrdersQuery,
} = orderApi;