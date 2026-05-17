import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery,
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        getNotifications: builder.query<any, void>({
            query: () => "/notifications",
            providesTags: ["Notifications"],
        }),

        markOneRead: builder.mutation<any, string>({
            query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
            // Optimistic update — avoid full refetch
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
                        const n = (draft as any[]).find((n: any) => n._id === id);
                        if (n) n.read = true;
                    })
                );
                try { await queryFulfilled; }
                catch { patch.undo(); }
            },
        }),

        markAllRead: builder.mutation<any, void>({
            query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
                        (draft as any[]).forEach((n: any) => { n.read = true; });
                    })
                );
                try { await queryFulfilled; }
                catch { patch.undo(); }
            },
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkOneReadMutation,
    useMarkAllReadMutation,
} = notificationApi;