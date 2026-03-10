// components/OrdersManager/OrdersManager.utils.ts
import { Order } from "@/type/order.type";
import { FormattedOrder } from "@/type/command-card.type";
import { Negotiation } from "@/type/order.type";
import { OrderStatus, GrantedRole, PaymentMethod } from "@/type/enum";
import {
  STATUS_MAPPING,
  CLIENT_STATUS_MAPPING,
} from "./OrdersManager.constants";
import {
  FormattedCommandCard,
  FormattedDeliveryCard,
} from "./OrdersManager.types";
import { orderService } from "@/lib/services/order-service";

// Fonction pour obtenir le texte d'affichage du statut
export const getStatusDisplayText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.EN_ATTENTE]: "En attente",
    [OrderStatus.ASSIGNEE]: "Assignée",
    [OrderStatus.EN_DISCUSSION]: "En discussion",
    [OrderStatus.PRIX_VALIDE]: "Prix validé",
    [OrderStatus.EN_LIVRAISON]: "En livraison",
    [OrderStatus.LIVREE]: "Livrée",
    [OrderStatus.ECHEC]: "Annulée",
  };
  return statusMap[status] || status;
};

// Fonction pour obtenir le texte d'affichage de la méthode de paiement
export const getPaymentMethodDisplayText = (method: PaymentMethod): string => {
  const methodMap: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: "Espèces",
    [PaymentMethod.MOBILE_MONEY]: "Mobile Money",
    [PaymentMethod.CARD]: "Carte bancaire",
  };
  return methodMap[method] || method;
};

// Configuration pour le rôle CLIENT
export const getClientConfig = () => ({
  // Filtrage des commandes pour le client
  filterOrders: (orders: Order[], user: any, activeTab: string): Order[] => {
    const statuses = CLIENT_STATUS_MAPPING[activeTab] || [];
    return orders.filter((order) =>
      statuses.includes(order.status as OrderStatus)
    );
  },

  // Formatage des commandes pour le client
  formatOrder: (order: Order): FormattedDeliveryCard => ({
    id: `#${order.id.slice(0, 8).toUpperCase()}`,
    orderNumber: order.orderNumber,
    from: order.pickupAddress.city,
    to: order.deliveryAddress.city,
    status: getStatusDisplayText(order.status),
    date: new Date(order.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    originalData: order,
  }),

  // Déterminer si le formulaire de prix doit être affiché
  shouldShowPriceForm: (
    negotiation: Negotiation | null,
    activeTab: string
  ): boolean => {
    if (activeTab !== "En cours") return false;
    if (!negotiation) return true;
    return !negotiation.confirmedByClient;
  },

  // Message vide personnalisé pour le client
  getEmptyMessage: (activeTab: string, user: any): string => {
    return `Aucune commande ${activeTab.toLowerCase()}`;
  },

  // Actions disponibles pour le client
  onValidatePrice: async (orderId: string, price: number, method: string) => {
    await orderService.clientValidatePrice(orderId, price, method);
  },
});

// Configuration pour le rôle LIVREUR/ADMIN
export const getAdminConfig = () => ({
  // Filtrage des commandes pour admin/livreur
  filterOrders: (orders: Order[], user: any, activeTab: string): Order[] => {
    if (!user) return [];

    const isAdminOrOperateur =
      user.role === GrantedRole.Admin || user.role === GrantedRole.Operateur;
    const isLivreur = user.role === GrantedRole.Livreur;

    const statuses = STATUS_MAPPING[activeTab] || [];
    const now = new Date();

    return orders.filter((order) => {
      const isInStatus = statuses.includes(order.status as OrderStatus);
      if (!isInStatus) return false;
      // Logique spécifique pour les commandes programmées
      if (activeTab === "Nouvelles") {
        // Dans "Nouvelles", on ne veut pas les commandes programmées dans le futur
        if (order.isScheduled && order.scheduledAt) {
          const scheduledDate = new Date(order.scheduledAt);
          if (scheduledDate > now) return false;
        }
      } else if (activeTab === "Programmées") {
        // Dans "Programmées", on ne veut QUE les commandes programmées dans le futur
        if (!order.isScheduled || !order.scheduledAt) return false;
        const scheduledDate = new Date(order.scheduledAt);
        if (scheduledDate <= now) return false;
      }

      // Pour admin et opérateur : toutes les commandes qui passent les filtres ci-dessus
      if (isAdminOrOperateur) {
        return true;
      }

      // Pour livreur : logique spécifique
      if (isLivreur) {
        // Pour "Nouvelles" et "Programmées" : toutes les passées
        if (activeTab === "Nouvelles" || activeTab === "Programmées") {
          return true;
        }

        // Pour "En cours" et "Terminées" : seulement les commandes assignées à ce livreur
        if (activeTab === "En cours" || activeTab === "Terminées") {
          return order.assignedTo === user._id;
        }
      }

      return false;
    });
  },

  // Formatage des commandes pour admin/livreur
  formatOrder: (order: Order): FormattedCommandCard => ({
    id: order.id,
    reference: order.orderNumber,
    date: new Date(order.createdAt).toLocaleString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    departure: order.pickupAddress.city,
    arrival: order.deliveryAddress.city,
    originalData: order,
  }),

  // Déterminer si le formulaire de prix doit être affiché
  shouldShowPriceForm: (
    negotiation: Negotiation | null,
    activeTab: string
  ): boolean => {
    if (activeTab !== "En cours") return false;
    if (!negotiation) return true;
    return !negotiation.proposedByCourier;
  },

  // Message vide personnalisé pour admin/livreur
  getEmptyMessage: (activeTab: string, user: any): string => {
    if (!user) return "Aucune commande disponible";

    const isLivreur = user.role === GrantedRole.Livreur;

    if (activeTab === "En cours" && isLivreur) {
      return "Aucune commande en cours vous étant assignée";
    }

    if (activeTab === "Terminées" && isLivreur) {
      return "Aucune commande terminée vous étant assignée";
    }

    return `Aucune commande ${activeTab.toLowerCase()}`;
  },

  // Actions disponibles pour admin/livreur
  onAcceptOrder: async (orderId: string) => {
    await orderService.acceptOrder(orderId);
  },

  onRejectOrder: async (orderId: string) => {
    await orderService.rejectOrder(orderId);
  },

  onEndOrder: async (orderId: string) => {
    await orderService.endOrder(orderId);
  },

  onValidatePrice: async (orderId: string, price: number) => {
    await orderService.validatePrice(orderId, price);
  },
});
