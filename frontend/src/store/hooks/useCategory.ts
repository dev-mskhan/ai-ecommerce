import {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useGetCategoryBySlugQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useToggleCategoryStatusMutation,
} from "@api/categoryApi";

export const useCategories = () => useGetAllCategoriesQuery();
export const useCategory = (id: string) => useGetCategoryByIdQuery(id);
export const useCategoryBySlug = (slug: string) => useGetCategoryBySlugQuery(slug);
export const useCategoryActions = () => ({
    create: useCreateCategoryMutation(),
    update: useUpdateCategoryMutation(),
    remove: useDeleteCategoryMutation(),
    toggle: useToggleCategoryStatusMutation(),
});