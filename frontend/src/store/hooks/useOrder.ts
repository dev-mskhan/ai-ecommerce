import {
    type OrderQuery,
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useCancelOrderMutation,
    useVendorUpdateOrderStatusMutation,
    useAdminUpdateOrderStatusMutation,
    useGetVendorOrdersQuery,
    useGetAdminOrdersQuery,
} from "@api/orderApi";

export const useMyOrders = (query: OrderQuery = {}) => useGetMyOrdersQuery(query);

export const useOrderById = (id: string) => useGetOrderByIdQuery(id, { skip: !id });

export const useVendorOrders = (query: OrderQuery = {}) => useGetVendorOrdersQuery(query);

export const useAdminOrders = (query: OrderQuery = {}) => useGetAdminOrdersQuery(query);

export const useOrderActions = () => ({
    create: useCreateOrderMutation(),
    cancel: useCancelOrderMutation(),
    vendorUpdateStatus: useVendorUpdateOrderStatusMutation(),
    adminUpdateStatus: useAdminUpdateOrderStatusMutation(),
});