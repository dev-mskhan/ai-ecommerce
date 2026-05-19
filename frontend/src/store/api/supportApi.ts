import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";


export const supportApi = createApi({
    reducerPath: "supportApi",
    baseQuery,
    tagTypes: ["Support", "SupportHistory"],
    endpoints: (builder) => ({
        getUserSupportChats: builder.query<any, void>({
            query: () => "/chats/support",
            providesTags: ["Support"],
        }),

        getSupportChatHistory: builder.query<any, string>({
            query: (chatId) => `/chats/support/${chatId}`,
            providesTags: (_, __, chatId) => [{ type: "SupportHistory", id: chatId }],
        }),
        createSupportChat: builder.mutation<any, { message: string }>({
            query: ({ message }) => ({ url: "/chats/support", method: "POST", body: { message } }),
            invalidatesTags: ["Support"],
        }),
        sendSupportMessage: builder.mutation<any, { chatId?: string; message: string; }>({
            query: ({ chatId, message }) => ({ url: `/chats/support/${chatId}`, method: "POST", body: { message } }),
            invalidatesTags: (_, __, { chatId }) =>
                chatId
                    ? ["Support", { type: "SupportHistory", id: chatId }]
                    : ["Support"],
        }),

        deleteSupportChat: builder.mutation<any, string>({
            query: (chatId) => ({ url: `/chats/support/${chatId}/close`, method: "PATCH" }),
            invalidatesTags: ["Support"],
        }),
        getAllSupportChats: builder.query<any, void>({
            query: () => "/chats/support/all",
            providesTags: ["Support"],
        }),
    }),
});

export const {
    useGetUserSupportChatsQuery,
    useGetSupportChatHistoryQuery,
    useCreateSupportChatMutation,
    useSendSupportMessageMutation,
    useDeleteSupportChatMutation,
    useGetAllSupportChatsQuery,
} = supportApi;