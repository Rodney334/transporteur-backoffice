// lib/firebase/fcm-service.ts
import { getToken, onMessage, Messaging } from "firebase/messaging";
import { messaging } from "./firebase-config";
import { firebaseConfig } from "./firebase-config";
import { notificationQueue } from "@/utils/notification-queue";

// VAPID key - You'll need to generate this from Firebase Console
// Go to: Project Settings > Cloud Messaging > Web Push certificates
const VAPID_KEY = firebaseConfig.vapidKey || "YOUR_VAPID_KEY_HERE"; // TODO: Replace with actual VAPID key

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

/**
 * Get FCM token for the current device
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn("Firebase Messaging is not supported in this browser");
      return null;
    }

    // Request permission first
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.warn("Notification permission denied");
      return null;
    }

    // Get registration token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      return token;
    } else {
      console.warn("No registration token available");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

/**
 * Listen for foreground messages (Firebase Cloud Messaging).
 * Les notifications passent par la notificationQueue (délai 2s, déduplication).
 * @param callback optionnel pour traitement supplémentaire
 */
export const onMessageListener = (
  callback?: (payload: any) => void,
): (() => void) => {
  if (!messaging) {
    console.warn("Firebase Messaging is not supported");
    return () => {};
  }

  return onMessage(messaging as Messaging, (payload) => {
    console.log("Message received in foreground:", payload);

    // Clé de déduplication basée sur messageId Firebase
    const dedupKey = payload.messageId
      ? `fcm_${payload.messageId}`
      : `fcm_${Math.floor(Date.now() / 2000)}`;

    const title =
      payload.notification?.title ||
      payload.data?.title ||
      "Nouvelle notification";
    const body = payload.notification?.body || payload.data?.body || "";

    // Toast via la queue (délai 2s entre chaque)
    const message = body ? `${title} — ${body}` : title;
    notificationQueue.enqueueToast(
      message,
      { position: "top-right", autoClose: 6000 },
      dedupKey,
    );

    // Notification native si permission accordée et corps présent
    if (body) {
      notificationQueue.enqueueNotification(title, body, `${dedupKey}_native`);
    }

    // Callback optionnel
    callback?.(payload);
  });
};
