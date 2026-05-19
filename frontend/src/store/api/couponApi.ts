import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery,
    tagTypes: ["Coupons"],
    endpoints: (builder) => ({
        getAllCoupons: builder.query<any, void>({
            query: () => "/coupons/get",
            providesTags: ["Coupons"],
        }),

        applyCoupon: builder.mutation<any, { code: string; orderAmount: number }>({
            query: (body) => ({ url: "/coupons/apply", method: "POST", body }),
            invalidatesTags: ["Coupons"],
        }),

        createCoupon: builder.mutation<any, any>({
            query: (body) => ({ url: "/coupons/create", method: "POST", body }),
            invalidatesTags: ["Coupons"],
        }),

        updateCoupon: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({ url: `/coupons/update/${id}`, method: "PATCH", body: data }),
            invalidatesTags: ["Coupons"],
        }),

        deleteCoupon: builder.mutation<any, string>({
            query: (id) => ({ url: `/coupons/delete/${id}`, method: "DELETE" }),
            invalidatesTags: ["Coupons"],
        }),

        toggleCoupon: builder.mutation<any, string>({
            query: (id) => ({ url: `/coupons/toggle/${id}`, method: "POST" }),
            invalidatesTags: ["Coupons"],
        }),
    }),
});

export const {
    useGetAllCouponsQuery,
    useApplyCouponMutation,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useToggleCouponMutation,
} = couponApi;