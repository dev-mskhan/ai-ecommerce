import {
    useGetUserChatsQuery,
    useGetChatHistoryQuery,
    useSendMessageMutation,
    useDeleteChatMutation,
} from "@api/chatApi";

export const useChats = () => useGetUserChatsQuery();
export const useChatHistory = (chatId: string) => useGetChatHistoryQuery(chatId);
export const useChatActions = () => {
    const [sendMessage, sendState] = useSendMessageMutation();
    const [deleteChat, deleteState] = useDeleteChatMutation();

    return {
        sendMessage,
        sendState,
        deleteChat,
        deleteState,
    };
};