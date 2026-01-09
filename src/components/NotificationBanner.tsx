// components/notifications/NotificationBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { SimpleNotificationToggle } from "./SimpleNotificationToggle";

export const NotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si les notifications sont supportées mais non activées
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      // Attendre un peu avant d'afficher la bannière
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Afficher après 3 secondes

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-[#FD481A]" />
          </div>
          <h3 className="font-medium text-gray-900">
            Activer les notifications
          </h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Recevez des notifications en temps réel pour ne rien manquer
      </p>

      <div className="flex gap-2">
        <SimpleNotificationToggle />
        <button
          onClick={() => setIsVisible(false)}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
};
