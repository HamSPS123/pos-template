import { useEffect, useRef, useState } from "react";
import { useNotificationsStore } from "@/stores/notifications.store";

interface UseNotificationsSSEOptions {
    enabled?: boolean;
    url?: string;
}

export const useNotificationsSSE = (options: UseNotificationsSSEOptions = {}) => {
    const { enabled = true, url = "/api/notifications/stream" } = options;
    const { addNotification } = useNotificationsStore();
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        const connect = () => {
            try {
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                }

                const eventSource = new EventSource(url);
                eventSourceRef.current = eventSource;

                eventSource.onopen = () => {
                    console.log("SSE connection established");
                    reconnectAttempts.current = 0;
                    setIsConnected(true);
                };

                eventSource.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.type && data.title && data.message) {
                            addNotification({
                                type: data.type,
                                title: data.title,
                                message: data.message,
                                actionUrl: data.actionUrl,
                                metadata: data.metadata,
                            });

                            if ("Notification" in window && Notification.permission === "granted") {
                                new Notification(data.title, {
                                    body: data.message,
                                    icon: "/favicon.ico",
                                });
                            }
                        }
                    } catch (error) {
                        console.error("Error parsing SSE message:", error);
                    }
                };

                eventSource.onerror = (error) => {
                    console.error("SSE connection error:", error);
                    eventSource.close();
                    setIsConnected(false);

                    if (reconnectAttempts.current < maxReconnectAttempts) {
                        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
                        reconnectAttempts.current++;

                        reconnectTimeoutRef.current = setTimeout(() => {
                            connect();
                        }, delay);
                    } else {
                        console.error("Max reconnection attempts reached");
                    }
                };

            } catch (error) {
                console.error("Error creating SSE connection:", error);
            }
        };

        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        connect();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [enabled, url, addNotification]);

    return {
        isConnected,
    };
};
