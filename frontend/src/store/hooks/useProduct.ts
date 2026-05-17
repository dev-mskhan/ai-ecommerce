import { type ProductSearchQuery, useGetAllProductsQuery, useGetProductBySlugQuery, useGetProductByIdQuery, useGetVendorProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useToggleProductStatusMutation, useUpdateStockMutation, useAdminDeleteProductMutation, useToggleFeaturedProductMutation } from "@api/productApi";

export const useProducts = (query: ProductSearchQuery = {}) =>
    useGetAllProductsQuery(query);

export const useProductBySlug = (slug: string) =>
    useGetProductBySlugQuery(slug);

export const useProductById = (id: string) =>
    useGetProductByIdQuery(id);

export const useVendorProducts = () =>
    useGetVendorProductsQuery();

export const useProductActions = () => ({
    create: useCreateProductMutation(),
    update: useUpdateProductMutation(),
    remove: useDeleteProductMutation(),
    toggle: useToggleProductStatusMutation(),
    updateStock: useUpdateStockMutation(),
    adminDelete: useAdminDeleteProductMutation(),
    toggleFeatured: useToggleFeaturedProductMutation(),
});