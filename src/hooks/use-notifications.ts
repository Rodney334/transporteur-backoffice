// hooks/useNotifications.ts
import { useNotificationStore } from "@/lib/stores/notification-store";

export const useNotifications = () => {
  const store = useNotificationStore();

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    isLoading: store.isLoading,
    error: store.error,

    // Actions exposées
    fetchNotifications: store.fetchNotifications,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    clearError: store.clearError,

    // Helper pour recharger
    reloadNotifications: () => {
      store.clearError();
      store.fetchNotifications();
    },
  };
};
