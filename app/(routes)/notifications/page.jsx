/**
 * صفحة الإشعارات
 * هذه الصفحة تعرض جميع الإشعارات الخاصة بالمستخدم
 * يمكن عرض الإشعارات، وضع علامة مقروء، والحذف
 *
 * Notifications Page
 * This page displays all user notifications
 * Can view notifications, mark as read, and delete
 */

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { NotificationService } from "@/lib/services/notification-service";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, Loader, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function NotificationsPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  useEffect(() => {
    if (userProfile?.id && !authLoading) {
      loadNotifications();

      // Subscribe to real-time notifications
      const channel = NotificationService.subscribeToNotifications(
        userProfile.id,
        (newNotification) => {
          setNotifications((prev) => [newNotification, ...prev]);
        }
      );

      return () => {
        NotificationService.unsubscribeFromNotifications(channel);
      };
    }
  }, [userProfile?.id, authLoading]);

  const loadNotifications = async () => {
    setLoading(true);
    const result = await NotificationService.getUserNotifications(
      userProfile.id,
      100
    );
    if (result.data) {
      setNotifications(result.data);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    await NotificationService.markAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    toast.success("Marked as read");
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead(userProfile.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = async (notificationId) => {
    await NotificationService.deleteNotification(notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast.success("Notification deleted");
  };

  const getNotificationLink = (notification) => {
    if (!notification.data) return null;

    const data =
      typeof notification.data === "string"
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const NotificationCard = ({ notification }) => {
    const link = getNotificationLink(notification);
    const formattedTime = notification.created_at
      ? formatDistanceToNow(new Date(notification.created_at), {
          addSuffix: true,
        })
      : "";

    return (
      <div
        className={`bg-white rounded-lg shadow-md border overflow-hidden transition-all hover:shadow-lg ${
          !notification.read ? "border-blue-300 bg-blue-50" : "border-gray-200"
        }`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={`text-lg ${
                    !notification.read ? "font-bold" : "font-semibold"
                  } text-gray-900`}
                >
                  {notification.title}
                </h3>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <p className="text-sm text-gray-500">{formattedTime}</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{notification.message}</p>

          <div className="flex gap-2 flex-wrap">
            {link && (
              <Link href={link}>
                <Button size="sm" variant="default">
                  View Details
                </Button>
              </Link>
            )}
            {!notification.read && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(notification.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Bell className="h-8 w-8" />
                Notifications
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${
                      unreadCount === 1 ? "" : "s"
                    }`
                  : "You're all caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread" },
            { value: "read", label: "Read" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={filter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
              {tab.value === "all" && (
                <span className="ml-2 bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {notifications.length}
                </span>
              )}
              {tab.value === "unread" && unreadCount > 0 && (
                <span className="ml-2 bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "You don't have any notifications yet"
                : `No ${filter} notifications`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
