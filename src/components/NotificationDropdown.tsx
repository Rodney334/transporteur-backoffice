// components/NotificationDropdown.tsx
import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, AlertCircle } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { formatRelativeTime } from "@/lib/utils/date-utils";

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearError,
    reloadNotifications,
  } = useNotifications();

  // Gestion du clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Charger les notifications seulement quand le dropdown s'ouvre pour la première fois
  useEffect(() => {
    if (
      isOpen &&
      !hasLoaded &&
      !isLoading &&
      !error &&
      notifications.length === 0
    ) {
      fetchNotifications();
      setHasLoaded(true);
    }
  }, [
    isOpen,
    hasLoaded,
    isLoading,
    error,
    notifications.length,
    fetchNotifications,
  ]);

  // Réinitialiser hasLoaded quand le dropdown se ferme (optionnel)
  useEffect(() => {
    if (!isOpen) {
      // Vous pouvez garder les données en cache ou les vider
      // Pour vider le cache quand on ferme :
      // setHasLoaded(false);
    }
  }, [isOpen]);

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleRetry = () => {
    clearError();
    reloadNotifications();
  };

  const handleOpenDropdown = () => {
    setIsOpen(true);
    if (!hasLoaded && !isLoading && !error && notifications.length === 0) {
      fetchNotifications();
      setHasLoaded(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de notification */}
      <button
        onClick={handleOpenDropdown}
        className="relative p-2 hover:bg-gray-50 border border-[#9D1D01B2] rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell width={25} height={25} color={"#9D1D01B2"} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FD481A] text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* En-tête */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center text-sm text-[#9D1D01] hover:text-[#7a1601] transition-colors"
                  disabled={isLoading}
                >
                  <Check size={16} className="mr-1" />
                  Tout marquer comme lu
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Contenu du dropdown */}
          <div className="max-h-[75vh] overflow-y-auto">
            {error ? (
              <div className="p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-[#9D1D01] text-white rounded hover:bg-[#7a1601] transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Chargement..." : "Réessayer"}
                </button>
              </div>
            ) : isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9D1D01] mx-auto"></div>
                <p className="mt-3 text-gray-500">
                  Chargement des notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.readAt ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.readAt && (
                            <span
                              className="w-2 h-2 bg-[#FD481A] rounded-full ml-2 mt-1 shrink-0"
                              aria-label="Non lue"
                            />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pied de page seulement s'il y a des notifications */}
          {notifications.length > 0 && !error && (
            <div className="p-3 border-t bg-gray-50 text-center">
              <span className="text-sm text-gray-600">
                {unreadCount} notification{unreadCount !== 1 ? "s" : ""} non-lue
                {unreadCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
