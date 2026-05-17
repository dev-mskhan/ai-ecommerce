import {
    useGetNotificationsQuery,
    useMarkOneReadMutation,
    useMarkAllReadMutation,
} from "@api/notificationApi";

export const useNotifications = () => {
    const query = useGetNotificationsQuery();
    const [markOne] = useMarkOneReadMutation();
    const [markAll] = useMarkAllReadMutation();

    const unreadCount = (query.data as any[])?.filter((n: any) => !n.read).length ?? 0;

    return { ...query, unreadCount, markOne, markAll };
};