// components/OrdersManager/OrdersManager.types.ts
import { Order } from "@/type/order.type";
import { FormattedOrder } from "@/type/command-card.type";
import { Negotiation } from "@/type/order.type";
import { OrderStatus, PaymentMethod, GrantedRole } from "@/type/enum";

export interface PriceFormData {
  price: string;
  method?: PaymentMethod;
}

export interface ContactCourseInterface {
  nom: string;
  telephone: string;
  ville: string;
  quartier: string;
  rue: string;
  pays: string;
}

export interface DetailCourseInterface {
  serviceType: string;
  articleType: string;
  transportMode: string;
  deliveryType: string;
  weight: number;
  status: OrderStatus;
}

export interface FormattedDeliveryCard {
  id: string;
  from: string;
  to: string;
  status: string;
  date: string;
  originalData: Order;
}

export interface FormattedCommandCard {
  id: string;
  reference: string;
  date: string;
  departure: string;
  arrival: string;
  originalData: Order;
}

export interface CommandCardProps {
  item: FormattedCommandCard;
  onViewDetails: (item: any) => void;
  onAccept?: (item: any) => void;
  onReject?: (item: any) => void;
  onEnd?: (item: any) => void;
  onAssign?: (item: any) => void;
  isProcessingAccept?: boolean;
  isProcessingReject?: boolean;
  isProcessingEnd?: boolean;
  isProcessingAssign?: boolean;
  activeTab: string;
  userRole?: GrantedRole;
}

export interface DeliveryCardProps {
  item: FormattedDeliveryCard;
  onViewDetails: (item: FormattedDeliveryCard) => void;
}

export interface OrdersManagerProps {
  // Configuration
  userRole: GrantedRole;
  tabs: string[];
  defaultTab: string;

  // Composants
  cardComponent: React.ComponentType<any>;

  // Logique métier
  shouldShowPriceForm: (
    negotiation: Negotiation | null,
    activeTab: string
  ) => boolean;
  formatOrder: (order: Order) => any;
  filterOrders: (orders: Order[], user: any, activeTab: string) => Order[];
  getEmptyMessage: (activeTab: string, user: any) => string;

  // Actions
  onAcceptOrder?: (orderId: string) => Promise<void>;
  onRejectOrder?: (orderId: string) => Promise<void>;
  onEndOrder?: (orderId: string) => Promise<void>;
  onValidatePrice?: (
    orderId: string,
    price: number,
    method: string
  ) => Promise<void>;

  // Customisation UI
  headerTitle?: string;
  showHeaderCounter?: boolean;
  customHeader?: React.ReactNode;
}

export interface OrdersManagerHandlers {
  onAccept: (command: FormattedOrder) => void;
  onReject: (command: FormattedOrder) => void;
  onEnd: (command: FormattedOrder) => void;
  onViewDetails: (command: FormattedOrder) => void;
  onValidatePrice: (data: PriceFormData) => void;
}
