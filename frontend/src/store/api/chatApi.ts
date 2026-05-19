import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";


export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery,
    tagTypes: ["Chats", "ChatHistory"],
    endpoints: (builder) => ({
        getUserChats: builder.query<any, void>({
            query: () => "/chats",
            providesTags: ["Chats"],
        }),

        getChatHistory: builder.query<any, string>({
            query: (chatId) => `/chats/${chatId}`,
            providesTags: (_, __, chatId) => [{ type: "ChatHistory", id: chatId }],
        }),

        sendMessage: builder.mutation<any, { chatId?: string; message: string; recipientId?: string }>({
            query: (body) => ({ url: "/chats/send", method: "POST", body }),
            invalidatesTags: (_, __, { chatId }) =>
                chatId
                    ? ["Chats", { type: "ChatHistory", id: chatId }]
                    : ["Chats"],
        }),

        deleteChat: builder.mutation<any, string>({
            query: (chatId) => ({ url: `/chats/${chatId}`, method: "DELETE" }),
            invalidatesTags: ["Chats"],
        }),
    }),
});

export const {
    useGetUserChatsQuery,
    useGetChatHistoryQuery,
    useSendMessageMutation,
    useDeleteChatMutation,
} = chatApi;