"use client";

import { useState } from "react";
import { useNotificationsStore } from "@/stores/notifications.store";
import { useNotificationsSSE } from "@/hooks/use-notifications-sse";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Calendar,
    CreditCard,
    Star,
    XCircle,
    LogIn,
    LogOut,
    AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { NotificationType } from "@/types/notification.interface";

const notificationIcons: Record<NotificationType, typeof Bell> = {
    booking: Calendar,
    payment: CreditCard,
    review: Star,
    cancellation: XCircle,
    check_in: LogIn,
    check_out: LogOut,
    system: AlertCircle,
};

const notificationColors: Record<NotificationType, string> = {
    booking: "text-blue-500",
    payment: "text-green-500",
    review: "text-yellow-500",
    cancellation: "text-red-500",
    check_in: "text-purple-500",
    check_out: "text-orange-500",
    system: "text-gray-500",
};

const Notification = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotificationsStore();
    const [open, setOpen] = useState(false);

    useNotificationsSSE({ enabled: false });

    const handleNotificationClick = (id: string, actionUrl?: string) => {
        markAsRead(id);
        if (actionUrl) {
            setOpen(false);
        }
    };

    const handleMarkAllRead = () => {
        markAllAsRead();
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteNotification(id);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h3 className="font-semibold text-lg">Notifications</h3>
                        <p className="text-xs text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            className="h-8 text-xs"
                        >
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                We&apos;ll notify you when something arrives
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => {
                                const Icon = notificationIcons[notification.type];
                                const colorClass = notificationColors[notification.type];

                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "group relative p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                                            !notification.read && "bg-blue-50/50 dark:bg-blue-950/20"
                                        )}
                                        onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={cn("flex-shrink-0 mt-0.5", colorClass)}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm leading-tight">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <div className="flex-shrink-0">
                                                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(notification.timestamp), {
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {!notification.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notification.id);
                                                                }}
                                                            >
                                                                <Check className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-destructive"
                                                            onClick={(e) => handleDelete(e, notification.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {notification.actionUrl && (
                                                    <Link
                                                        href={notification.actionUrl}
                                                        className="text-xs text-primary hover:underline mt-1 inline-block"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        View details →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <>
                        <Separator />
                        <div className="p-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-center text-sm"
                                onClick={() => setOpen(false)}
                            >
                                View all notifications
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notification;
