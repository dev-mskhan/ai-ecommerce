import { useEffect } from 'react';
import { getSocket } from '@store/socket/socket';

export const useChatSocket = (chatId: string, onTyping?: (data: any) => void) => {
    useEffect(() => {
        if (!chatId) return;
        const s = getSocket();
        s.emit('chat:join', chatId);

        if (onTyping) s.on('chat:typing', onTyping);

        return () => {
            s.emit('chat:leave', chatId);
            s.off('chat:typing');
        };
    }, [chatId]);

    const sendTyping = (recipientId: string) =>
        getSocket().emit('chat:typing', { chatId, recipientId });

    const sendStopTyping = (recipientId: string) =>
        getSocket().emit('chat:stop_typing', { chatId, recipientId });

    const sendRead = () =>
        getSocket().emit('chat:read', { chatId });

    return { sendTyping, sendStopTyping, sendRead };
};