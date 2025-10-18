"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { NotificationService } from "@/lib/services/notification-service";
import { useAuth } from "@/lib/auth/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.id) {
      loadNotifications();
      loadUnreadCount();

      // Subscribe to real-time notifications
      const channel = NotificationService.subscribeToNotifications(
        userProfile.id,
        (newNotification) => {
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      );

      return () => {
        NotificationService.unsubscribeFromNotifications(channel);
      };
    }
  }, [userProfile?.id]);

  const loadNotifications = async () => {
    const result = await NotificationService.getUserNotifications(
      userProfile.id,
      10
    );
    if (result.data) {
      setNotifications(result.data);
    }
  };

  const loadUnreadCount = async () => {
    const result = await NotificationService.getUnreadCount(userProfile.id);
    if (result.data !== null) {
      setUnreadCount(result.data);
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    await NotificationService.markAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead(userProfile.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    await NotificationService.deleteNotification(notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    if (!notifications.find((n) => n.id === notificationId)?.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const getNotificationLink = (notification) => {
    if (!notification.data) return null;

    const data = typeof notification.data === 'string'
      ? JSON.parse(notification.data)
      : notification.data;

    if (data.order_id) {
      return `/orders/${data.order_id}`;
    }
    if (data.listing_id) {
      return `/view-details/${data.listing_id}`;
    }
    return null;
  };

  const NotificationItem = ({ notification }) => {
    const link = getNotificationLink(notification);
    const formattedTime = notification.created_at
      ? formatDistanceToNow(new Date(notification.created_at), {
          addSuffix: true,
        })
      : "";

    return (
      <div
        className={`flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors ${
          !notification.read ? "bg-blue-50" : ""
        }`}
      >
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {
          if (link) {
            window.location.href = link;
            setIsOpen(false);
          }
        }}>
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm ${
                !notification.read ? "font-semibold" : "font-medium"
              } text-gray-900`}
            >
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">{formattedTime}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {!notification.read && (
            <button
              onClick={(e) => handleMarkAsRead(notification.id, e)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Mark as read"
            >
              <Check className="h-4 w-4 text-gray-600" />
            </button>
          )}
          <button
            onClick={(e) => handleDelete(notification.id, e)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  if (!userProfile) {
    // Return invisible placeholder to maintain SSR/client consistency
    return <div className="w-10 h-10" />;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
          <Bell className="h-5 w-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto p-0">
        <DropdownMenuLabel className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <span className="font-semibold text-lg">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-7"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>

        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/notifications";
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
