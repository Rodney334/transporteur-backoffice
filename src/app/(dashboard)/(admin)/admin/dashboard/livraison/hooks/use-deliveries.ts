// hooks/use-deliveries.ts
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useOrderStore } from "@/lib/stores/order-store";
import { Order } from "@/type/order.type";
import { OrderStatus } from "@/type/enum";
import { useAuth } from "@/hooks/use-auth";
import { useDeliveriesStore } from "../stores/deliveries-store";

export const useDeliveries = () => {
  const { user } = useAuth();
  const { orders, loading, fetchOrders } = useOrderStore();

  const [filteredDeliveries, setFilteredDeliveries] = useState<Order[]>([]);
  // const [selectedDelivery, setSelectedDelivery] = useState<Order | null>(null);
  const { setSelectedDelivery, clearSelectedDelivery } = useDeliveriesStore();

  // Charger les commandes au montage
  const loadDeliveries = useCallback(async () => {
    if (!user) return;

    try {
      await fetchOrders(user._id, user.role);
    } catch (error: any) {
      console.error("Erreur chargement livraisons:", error);
      toast.error("Erreur lors du chargement des livraisons", {
        position: "top-left",
      });
    }
  }, [user, fetchOrders]);

  // Filtrer les commandes terminées (status = "livree")
  useEffect(() => {
    const completedDeliveries = orders.filter(
      (order) =>
        order.status === OrderStatus.LIVREE ||
        order.status === OrderStatus.ECHEC
    );
    setFilteredDeliveries(completedDeliveries);
  }, [orders]);

  // Formater l'adresse
  const formatAddress = useCallback((address: any) => {
    if (!address) return "N/A";
    const parts = [
      address.street,
      address.district,
      address.city,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  }, []);

  // Formater le prix
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Formater la date
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Ouvrir le modal de détails
  const openDetailsModal = useCallback(
    (delivery: Order) => {
      console.log({ delivery });
      setSelectedDelivery(delivery);
    },
    [setSelectedDelivery]
  );

  // Fermer le modal
  const closeDetailsModal = useCallback(() => {
    // setSelectedDelivery(null);
    clearSelectedDelivery();
  }, [clearSelectedDelivery]);

  // Vérifier les permissions
  const hasPermission =
    user?.role === "admin" ||
    user?.role === "livreur" ||
    user?.role === "operateur";

  return {
    // Données
    deliveries: filteredDeliveries,
    allOrders: orders,
    // selectedDelivery,
    isLoading: loading,

    // États
    hasPermission,

    // Actions
    loadDeliveries,
    openDetailsModal,
    closeDetailsModal,

    // Formateurs
    formatAddress,
    formatPrice,
    formatDate,
  };
};
