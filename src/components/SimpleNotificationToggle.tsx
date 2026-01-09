// components/SimpleNotificationToggle.tsx (version améliorée)
"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Check, AlertCircle } from "lucide-react";
import { requestNotificationPermission } from "@/utils/web-notifications-simple";
import { toast } from "react-toastify";

export const SimpleNotificationToggle = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);

  // Synchroniser l'état avec la permission réelle
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("Notification" in window) {
      setPermission(Notification.permission);

      // Écouter les changements de permission
      const checkPermission = () => {
        setPermission(Notification.permission);
      };

      // Vérifier périodiquement (optionnel)
      const interval = setInterval(checkPermission, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      toast.warning("Votre navigateur ne supporte pas les notifications", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (permission === "granted") {
        // L'utilisateur veut peut-être "désactiver"
        // Note: On ne peut pas vraiment désactiver, on peut juste informer
        toast.info(
          "Pour désactiver les notifications, allez dans les paramètres de votre navigateur",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } else if (permission === "denied") {
        // Permission refusée précédemment
        toast.warning(
          "Vous avez bloqué les notifications. Activez-les dans les paramètres de votre navigateur.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } else {
        // Demander la permission
        const granted = await requestNotificationPermission();
        setPermission(Notification.permission);

        if (granted) {
          toast.success("Notifications activées avec succès !", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.info("Vous pouvez activer les notifications plus tard", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Erreur permission:", error);
      toast.error("Erreur lors de l'activation des notifications", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rendu selon l'état
  const renderContent = () => {
    if (!("Notification" in window)) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BellOff className="w-4 h-4" />
          <span>Non supporté</span>
        </div>
      );
    }

    switch (permission) {
      case "granted":
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Check className="w-4 h-4" />
            <span>Notifications activées</span>
            <button
              onClick={toggleNotifications}
              disabled={isLoading}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {isLoading ? "..." : "Gérer"}
            </button>
          </div>
        );

      case "denied":
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Notifications bloquées</span>
            <button
              onClick={toggleNotifications}
              disabled={isLoading}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {isLoading ? "..." : "Activer"}
            </button>
          </div>
        );

      default: // "default"
        return (
          <button
            onClick={toggleNotifications}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1 bg-[#FD481A] text-white text-sm rounded-lg hover:bg-[#E63F15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Activer les notifications</span>
              </>
            )}
          </button>
        );
    }
  };

  return <div className="inline-flex">{renderContent()}</div>;
};
