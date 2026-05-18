import {
    useGetNotificationsQuery,
    useMarkOneReadMutation,
    useMarkAllReadMutation,
} from "@api/notificationApi";

export const useNotifications = () => {
    const { data, isLoading, isError, isFetching } = useGetNotificationsQuery();
    const [markOne] = useMarkOneReadMutation();
    const [markAll] = useMarkAllReadMutation();

    return { data, isLoading, isError, isFetching, markOne, markAll };
};