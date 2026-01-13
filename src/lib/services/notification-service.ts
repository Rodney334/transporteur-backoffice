// lib/services/notification-service.ts
import { api } from "@/lib/api/axios";
import { Notification } from "@/lib/stores/notification-store";

export const notificationService = {
  // Récupérer toutes les notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get("/notifications/");
    return response.data;
  },

  // Marquer une notification comme lue
  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  },
};
