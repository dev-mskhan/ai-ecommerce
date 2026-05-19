import { create } from 'zustand';

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    data?: Record<string, any>;
    createdAt: string;
}

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (n: Notification) => void;
    setUnreadCount: (count: number) => void;
    markRead: (id: string) => void;
    markAllRead: () => void;
    setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (n) => set(state => ({
        notifications: [n, ...state.notifications],
        unreadCount: state.unreadCount + 1,
    })),

    setUnreadCount: (count) => set({ unreadCount: count }),

    markRead: (id) => set(state => ({
        notifications: state.notifications.map(n =>
            n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),

    markAllRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
    })),

    setNotifications: (notifications) => set({
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length,
    }),
}));