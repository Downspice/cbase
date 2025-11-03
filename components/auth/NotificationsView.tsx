"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotifications } from "@/hooks/use-notifications";
import { motion } from "framer-motion";

interface NotificationsViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsView({ open, onOpenChange }: NotificationsViewProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const formatTime = (timestamp: number) => {
    try {
      const now = Date.now();
      const diff = now - timestamp;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} day${days !== 1 ? "s" : ""} ago`;
      if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
      if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
      return "Just now";
    } catch {
      return "Recently";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "token_purchase":
        return "🪙";
      case "tip_generation":
        return "✨";
      default:
        return "📬";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "token_purchase":
        return "bg-[#f4d03f]/10 border-[#f4d03f]/20";
      case "tip_generation":
        return "bg-[#4a4856]/10 border-[#4a4856]/20";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-[#3a3947]">
                Notifications
              </DialogTitle>
              <DialogDescription className="text-[#6b6a7a]">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
              </DialogDescription>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    className="text-xs px-3 py-1 rounded-lg border border-[#4a4856] text-[#3a3947] hover:bg-[#4a4856] hover:text-[#fefdfb] transition-colors"
                  >
                    Mark all read
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (confirm("Are you sure you want to clear all notifications?")) {
                      clearAll();
                    }
                  }}
                  className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Clear all
                </motion.button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2 mt-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <div className="text-lg font-semibold text-[#3a3947] mb-2">No notifications</div>
              <div className="text-sm text-[#6b6a7a]">You're all caught up!</div>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  notification.read
                    ? getNotificationColor(notification.type)
                    : `${getNotificationColor(notification.type)} border-[#f4d03f] border-2`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-[#3a3947] ${notification.read ? "" : "font-bold"}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-[#f4d03f] flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-[#6b6a7a] mt-1">{notification.message}</p>
                    <p className="text-xs text-[#6b6a7a] mt-2">{formatTime(notification.timestamp)}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

