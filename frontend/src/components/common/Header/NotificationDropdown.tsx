'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NotificationDropdownProps {
    notifications: Array<{
        id: string;
        title: string;
        message: string;
        isRead: boolean;
        timestamp: string;
    }>;
}

export default function NotificationDropdown() {
    const notifications = [
        {
            id: '1',
            title: 'New Comment',
            message: 'You have a new comment on your post.',
            isRead: false,
            timestamp: '2024-10-01T10:00:00Z',
        },
    ];

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 px-0">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.slice(0, 5).map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start p-4 cursor-pointer"
                            >
                                <div className="flex w-full items-start justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">
                                            {notification.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {notification.message}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">
                                            {new Date(notification.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/notifications" className="w-full text-center">
                                View all notifications
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
