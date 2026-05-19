import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export interface ProductSearchQuery {
    q?: string;
    page?: string;
    limit?: string;
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    order?: string;
    rating?: string;
}

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery,
    tagTypes: ["Products", "Product", "VendorProducts"],
    endpoints: (builder) => ({
        getAllProducts: builder.query<any, ProductSearchQuery>({
            query: (params) => ({ url: "/products", params }),
            providesTags: ["Products"],
        }),

        getProductBySlug: builder.query<any, string>({
            query: (slug) => `/products/slug/${slug}`,
            providesTags: (_, __, slug) => [{ type: "Product", id: slug }],
        }),

        getProductById: builder.query<any, string>({
            query: (id) => `/products/${id}`,
            providesTags: (_, __, id) => [{ type: "Product", id }],
        }),

        getVendorProducts: builder.query<any, void>({
            query: () => "/products/vendor",
            providesTags: ["VendorProducts"],
        }),

        createProduct: builder.mutation<any, FormData>({
            query: (body) => ({ url: "/products/vendor", method: "POST", body }),
            invalidatesTags: ["Products", "VendorProducts"],
        }),

        updateProduct: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({ url: `/products/vendor/${id}`, method: "PATCH", body: data }),
            invalidatesTags: (_, __, { id }) => ["Products", "VendorProducts", { type: "Product", id }],
        }),

        deleteProduct: builder.mutation<any, string>({
            query: (id) => ({ url: `/products/vendor/${id}`, method: "DELETE" }),
            invalidatesTags: ["Products", "VendorProducts"],
        }),

        toggleProductStatus: builder.mutation<any, string>({
            query: (id) => ({ url: `/products/vendor/${id}/toggle`, method: "PATCH" }),
            invalidatesTags: (_, __, id) => ["VendorProducts", { type: "Product", id }],
        }),

        updateStock: builder.mutation<any, { id: string; stock: number }>({
            query: ({ id, ...body }) => ({ url: `/products/vendor/${id}/stock`, method: "PATCH", body }),
            invalidatesTags: (_, __, { id }) => [{ type: "Product", id }, "VendorProducts"],
        }),

        adminDeleteProduct: builder.mutation<any, string>({
            query: (id) => ({ url: `/products/admin/${id}`, method: "DELETE" }),
            invalidatesTags: ["Products"],
        }),

        toggleFeaturedProduct: builder.mutation<any, string>({
            query: (id) => ({ url: `/products/admin/${id}/feature`, method: "PATCH" }),
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useGetProductBySlugQuery,
    useGetProductByIdQuery,
    useGetVendorProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useToggleProductStatusMutation,
    useUpdateStockMutation,
    useAdminDeleteProductMutation,
    useToggleFeaturedProductMutation,
} = productApi;