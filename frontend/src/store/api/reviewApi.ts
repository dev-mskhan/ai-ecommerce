import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery,
    tagTypes: ["Reviews"],
    endpoints: (builder) => ({
        getProductReviews: builder.query<any, string>({
            query: (productId) => `/reviews/product/${productId}`,
            providesTags: (_, __, productId) => [{ type: "Reviews", id: productId }],
        }),

        createReview: builder.mutation<any, any>({
            query: (body) => ({ url: "/reviews", method: "POST", body }),
            invalidatesTags: (_, __, { productId }) => [{ type: "Reviews", id: productId }],
        }),

        updateReview: builder.mutation<any, { id: string; productId: string; data: any }>({
            query: ({ id, data }) => ({ url: `/reviews/${id}`, method: "PATCH", body: data }),
            invalidatesTags: (_, __, { productId }) => [{ type: "Reviews", id: productId }],
        }),

        deleteReview: builder.mutation<any, { id: string; productId: string }>({
            query: ({ id }) => ({ url: `/reviews/${id}`, method: "DELETE" }),
            invalidatesTags: (_, __, { productId }) => [{ type: "Reviews", id: productId }],
        }),

        toggleLike: builder.mutation<any, { id: string; type: string }>({
            query: ({ id, type }) => ({ url: `/reviews/${id}/like`, method: "POST", body: { type } }),
            invalidatesTags: (_, __, { id }) => [{ type: "Reviews", id: id }],
        }),

        vendorReply: builder.mutation<any, { id: string; productId: string; message: string }>({
            query: ({ id, message }) => ({
                url: `/reviews/${id}/reply`,
                method: "POST",
                body: { message }  // matches backend
            }),
        }),

        toggleApproval: builder.mutation<any, { id: string; productId: string }>({
            query: ({ id }) => ({ url: `/reviews/${id}/approve`, method: "PATCH" }),
            invalidatesTags: (_, __, { productId }) => [{ type: "Reviews", id: productId }],
        }),

        adminDeleteReview: builder.mutation<any, { id: string; productId: string }>({
            query: ({ id }) => ({ url: `/reviews/${id}/admin`, method: "DELETE" }),
            invalidatesTags: (_, __, { productId }) => [{ type: "Reviews", id: productId }],
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useToggleLikeMutation,
    useVendorReplyMutation,
    useToggleApprovalMutation,
    useAdminDeleteReviewMutation,
} = reviewApi;