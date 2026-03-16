// utils/notification-queue.ts
// Module singleton : file d'attente de toasts et notifications avec délai 2s entre chaque

import { toast, ToastOptions } from "react-toastify";

const TOAST_DELAY_MS = 2000;

interface ToastQueueItem {
  message: string;
  options?: ToastOptions;
}

interface NotificationQueueItem {
  title: string;
  body: string;
}

type QueueItem =
  | { kind: "toast"; data: ToastQueueItem }
  | { kind: "notification"; data: NotificationQueueItem };

class NotificationQueue {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  // Ensemble des clés de déduplication pour éviter d'enqueuer deux fois le même message
  private recentKeys = new Set<string>();
  private recentKeysTtl = 3000; // ms

  /**
   * Ajouter un toast à la file.
   * @param dedupKey clé optionnelle pour éviter les doublons (ex. type+orderId)
   */
  enqueueToast(message: string, options?: ToastOptions, dedupKey?: string): void {
    if (dedupKey) {
      if (this.recentKeys.has(dedupKey)) {
        // Message identique déjà dans la queue ou récemment affiché → ignorer
        return;
      }
      this.recentKeys.add(dedupKey);
      setTimeout(() => this.recentKeys.delete(dedupKey), this.recentKeysTtl);
    }

    this.queue.push({ kind: "toast", data: { message, options } });
    this.processNext();
  }

  /**
   * Ajouter une notification web native à la file.
   * @param dedupKey clé optionnelle pour éviter les doublons
   */
  enqueueNotification(title: string, body: string, dedupKey?: string): void {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    if (dedupKey) {
      if (this.recentKeys.has(dedupKey)) return;
      this.recentKeys.add(dedupKey);
      setTimeout(() => this.recentKeys.delete(dedupKey), this.recentKeysTtl);
    }

    this.queue.push({ kind: "notification", data: { title, body } });
    this.processNext();
  }

  private processNext(): void {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const item = this.queue.shift()!;
    this.display(item);

    // Planifier le prochain élément après le délai
    if (this.queue.length > 0) {
      setTimeout(() => {
        this.isProcessing = false;
        this.processNext();
      }, TOAST_DELAY_MS);
    } else {
      this.isProcessing = false;
    }
  }

  private display(item: QueueItem): void {
    if (item.kind === "toast") {
      const { message, options } = item.data;
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        ...options,
      });
    } else if (item.kind === "notification") {
      const { title, body } = item.data;
      try {
        const notif = new Notification(title, {
          body,
          icon: "/icon.png",
        });
        setTimeout(() => notif.close(), 6000);
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.warn("Notification native impossible:", e);
      }
    }
  }
}

// Export singleton
export const notificationQueue = new NotificationQueue();
