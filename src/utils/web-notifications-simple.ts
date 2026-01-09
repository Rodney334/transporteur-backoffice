// utils/web-notifications-simple.ts
let permissionGranted: NotificationPermission | null = null;

// Demander la permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("Notifications web non supportées");
    return false;
  }

  if (permissionGranted === "granted") return true;
  if (permissionGranted === "denied") return false;

  try {
    const permission = await Notification.requestPermission();
    permissionGranted = permission;
    return permission === "granted";
  } catch (error) {
    console.error("Erreur permission notifications:", error);
    return false;
  }
};

// Afficher une notification simple
export const showSimpleNotification = async (
  title: string,
  message: string
): Promise<void> => {
  // Vérifier support
  if (!("Notification" in window)) return;

  // Vérifier permission
  if (permissionGranted === null) {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;
  }

  if (permissionGranted !== "granted") return;

  try {
    const notification = new Notification(title, {
      body: message,
      icon: "/favicon.ico",
      silent: false,
    });

    // Fermer après 5 secondes
    setTimeout(() => notification.close(), 5000);

    // Rediriger au clic
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error("Erreur création notification:", error);
  }
};
