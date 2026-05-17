import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery,
    tagTypes: ["Categories", "Category"],
    endpoints: (builder) => ({
        getAllCategories: builder.query<any, void>({
            query: () => "/categories",
            providesTags: ["Categories"],
        }),

        getCategoryById: builder.query<any, string>({
            query: (id) => `/categories/${id}`,
            providesTags: (_, __, id) => [{ type: "Category", id }],
        }),
        getCategoryBySlug: builder.query<any, string>({
            query: (slug) => `/categories/slug/${slug}`,
            providesTags: (_, __, slug) => [{ type: "Category", slug }],
        }),

        createCategory: builder.mutation<any, FormData>({
            query: (body) => ({ url: "/categories", method: "POST", body }),
            invalidatesTags: ["Categories"],
        }),

        updateCategory: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({ url: `/categories/${id}`, method: "PATCH", body: data }),
            invalidatesTags: (_, __, { id }) => ["Categories", { type: "Category", id }],
        }),

        deleteCategory: builder.mutation<any, string>({
            query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
            invalidatesTags: ["Categories"],
        }),

        toggleCategoryStatus: builder.mutation<any, string>({
            query: (id) => ({ url: `/categories/${id}/toggle`, method: "PATCH" }),
            invalidatesTags: (_, __, id) => ["Categories", { type: "Category", id }],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useGetCategoryBySlugQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useToggleCategoryStatusMutation,
} = categoryApi;