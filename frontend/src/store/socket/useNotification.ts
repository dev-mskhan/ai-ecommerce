import { useEffect } from 'react';
import { getSocket } from '@store/socket/socket';
import { useNotificationStore } from '@store/zustand/notificationStore';

export const useNotifications = () => {
    const { addNotification, setUnreadCount } = useNotificationStore();

    useEffect(() => {
        const s = getSocket();

        s.emit('notification:unread_count');

        s.on('notification:new', (notification) => {
            addNotification(notification);
        });

        s.on('notification:unread_count', ({ count }) => {
            setUnreadCount(count);
        });

        s.on('notification:read_ack', ({ notificationId }) => {
        });

        return () => {
            s.off('notification:new');
            s.off('notification:unread_count');
            s.off('notification:read_ack');
        };
    }, []);

    const markRead = (notificationId: string) => getSocket().emit('notification:read', notificationId);
    const markAllRead = () => getSocket().emit('notification:read_all');

    return { markRead, markAllRead };
};