export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
}

export type NotificationType = 
    | "booking" 
    | "payment" 
    | "review" 
    | "cancellation" 
    | "check_in" 
    | "check_out" 
    | "system";

export interface NotificationGroup {
    date: string;
    notifications: Notification[];
}
