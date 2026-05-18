import {
    useGetUserSupportChatsQuery,
    useGetSupportChatHistoryQuery,
    useCreateSupportChatMutation,
    useSendSupportMessageMutation,
    useDeleteSupportChatMutation,
    useGetAllSupportChatsQuery,
} from "@api/supportApi";

export const useSupportChats = () => useGetUserSupportChatsQuery();
export const useSupportChatHistory = (chatId: string) => useGetSupportChatHistoryQuery(chatId);
export const useSupportChatActions = () => ({
    create: useCreateSupportChatMutation(),
    send: useSendSupportMessageMutation(),
    delete: useDeleteSupportChatMutation(),
    getAll: useGetAllSupportChatsQuery(),
});