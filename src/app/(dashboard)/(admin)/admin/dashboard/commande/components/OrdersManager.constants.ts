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
  Programmées: [OrderStatus.EN_ATTENTE],
  Terminées: [OrderStatus.LIVREE],
  Échouées: [
    OrderStatus.ECHEC,
    OrderStatus.ANNULEE_PAR_LIVREUR,
    OrderStatus.ANNULEE_PAR_CLIENT,
  ],
  "En conflit": [OrderStatus.CONFLIT],
};

export const CLIENT_STATUS_MAPPING: Record<string, OrderStatus[]> = {
  "En cours": [
    OrderStatus.EN_ATTENTE,
    OrderStatus.ASSIGNEE,
    OrderStatus.EN_DISCUSSION,
    OrderStatus.PRIX_VALIDE,
    OrderStatus.EN_LIVRAISON,
  ],
  Terminées: [OrderStatus.LIVREE],
  Échouées: [
    OrderStatus.ECHEC,
    OrderStatus.ANNULEE_PAR_LIVREUR,
    OrderStatus.ANNULEE_PAR_CLIENT,
  ],
  "En conflit": [OrderStatus.CONFLIT],
};
