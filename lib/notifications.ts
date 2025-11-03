// Notifications utility functions using local storage

export interface Notification {
  id: string;
  type: "token_purchase" | "tip_generation" | "tipster_results" | "tip_assigned";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

const NOTIFICATIONS_KEY = "tbase_notifications";

export const notificationService = {
  // Get all notifications for current user
  getNotifications(): Notification[] {
    if (typeof window === "undefined") return [];
    const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!notificationsData) return [];
    try {
      return JSON.parse(notificationsData);
    } catch {
      return [];
    }
  },

  // Add a notification
  addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">): void {
    if (typeof window === "undefined") return;
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };
    
    // Add to beginning of array (most recent first)
    notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    const limitedNotifications = notifications.slice(0, 50);
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(limitedNotifications));
    
    // Dispatch custom event to notify components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notifications-change"));
    }
  },

  // Mark notification as read
  markAsRead(notificationId: string): void {
    if (typeof window === "undefined") return;
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notifications-change"));
    }
  },

  // Mark all notifications as read
  markAllAsRead(): void {
    if (typeof window === "undefined") return;
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notifications-change"));
    }
  },

  // Get unread count
  getUnreadCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(notif => !notif.read).length;
  },

  // Clear all notifications
  clearAll(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notifications-change"));
    }
  },
};

