// components/OrdersManager/OrdersManager.constants.ts
import { OrderStatus } from "@/type/enum";

export const STATUS_MAPPING: Record<string, OrderStatus[]> = {
  Nouvelles: [OrderStatus.EN_ATTENTE],
  "En cours": [
    OrderStatus.ASSIGNEE,
    OrderStatus.EN_DISCUSSION,
    OrderStatus.PRIX_VALIDE,
    OrderStatus.EN_LIVRAISON,
  ],
  Terminées: [OrderStatus.LIVREE, OrderStatus.ECHEC],
};

export const CLIENT_STATUS_MAPPING: Record<string, OrderStatus[]> = {
  "En cours": [
    OrderStatus.EN_ATTENTE,
    OrderStatus.ASSIGNEE,
    OrderStatus.EN_DISCUSSION,
    OrderStatus.PRIX_VALIDE,
    OrderStatus.EN_LIVRAISON,
  ],
  Terminées: [OrderStatus.LIVREE, OrderStatus.ECHEC],
};
