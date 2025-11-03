"use client";

import { useState, useEffect, useCallback } from "react";
import { notificationService, Notification } from "@/lib/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const checkNotifications = useCallback(() => {
    const allNotifications = notificationService.getNotifications();
    const unread = notificationService.getUnreadCount();
    setNotifications(allNotifications);
    setUnreadCount(unread);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Load notifications on mount
    checkNotifications();

    // Listen for notification changes
    const handleNotificationChange = () => {
      checkNotifications();
    };

    window.addEventListener("notifications-change", handleNotificationChange);

    return () => {
      window.removeEventListener("notifications-change", handleNotificationChange);
    };
  }, [checkNotifications]);

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    checkNotifications();
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
    checkNotifications();
  };

  const clearAll = () => {
    notificationService.clearAll();
    checkNotifications();
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearAll,
    refresh: checkNotifications,
  };
}

