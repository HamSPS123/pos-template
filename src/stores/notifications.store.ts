import { create } from "zustand";
import { Notification } from "@/types/notification.interface";

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "booking",
        title: "New Order",
        message: "New order #1234 has been placed",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
        actionUrl: "/sales/orders",
    },
    {
        id: "2",
        type: "payment",
        title: "Payment Received",
        message: "Payment of ฿2,500 received for order #1233",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        actionUrl: "/sales/orders",
    },
    {
        id: "3",
        type: "system",
        title: "Low Stock Alert",
        message: "Product 'Rice 5kg' is running low on stock",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
        actionUrl: "/inventory/stock",
    },
];

export const useNotificationsStore = create<NotificationsState>((set) => ({
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter((n) => !n.read).length,

    addNotification: (notification) =>
        set((state) => {
            const newNotification: Notification = {
                ...notification,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date(),
                read: false,
            };
            return {
                notifications: [newNotification, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            };
        }),

    markAsRead: (id) =>
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (!notification || notification.read) return state;

            return {
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: state.unreadCount - 1,
            };
        }),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        })),

    deleteNotification: (id) =>
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: notification && !notification.read 
                    ? state.unreadCount - 1 
                    : state.unreadCount,
            };
        }),

    clearAll: () =>
        set({
            notifications: [],
            unreadCount: 0,
        }),
}));
