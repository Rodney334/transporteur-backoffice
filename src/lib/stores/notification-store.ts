// lib/stores/notification-store.ts
import { create } from "zustand";
import { notificationService } from "../services/notification-service";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  payload: Record<string, any>;
  channel: string;
  readAt: string | null;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Récupérer toutes les notifications
  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const notifications = await notificationService.getNotifications();

      const unreadCount = notifications.filter((n) => !n.readAt).length;

      set({
        notifications,
        unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Erreur lors du chargement des notifications",
        isLoading: false,
      });
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (id: string) => {
    try {
      // Mise à jour optimiste
      const updatedNotifications = get().notifications.map((notification) =>
        notification.id === id
          ? { ...notification, readAt: new Date().toISOString() }
          : notification
      );

      const unreadCount = updatedNotifications.filter((n) => !n.readAt).length;

      set({
        notifications: updatedNotifications,
        unreadCount,
      });

      // Appel API
      await notificationService.markAsRead(id);
    } catch (error: any) {
      // Revert en cas d'erreur
      await get().fetchNotifications();
      set({
        error: error.message || "Erreur lors du marquage de la notification",
      });
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async () => {
    try {
      // Mise à jour optimiste
      const updatedNotifications = get().notifications.map((notification) => ({
        ...notification,
        readAt: notification.readAt || new Date().toISOString(),
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
      });

      // Appel API
      await notificationService.markAllAsRead();
    } catch (error: any) {
      // Revert en cas d'erreur
      await get().fetchNotifications();
      set({
        error:
          error.message ||
          "Erreur lors du marquage de toutes les notifications",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
