import {
  ArticleType,
  DeliveryType,
  NegotiationStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ServiceType,
  TransportMode,
} from "./enum";
import { User } from "./user.type";

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}
export interface OrderResponse {
  _id: string;
  serviceType: string;
  description: string;
  weight: number;
  pickupAddress: any;
  deliveryAddress: any;
  deliveryType: string;
  zone: string;
  estimatedPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInterface {
  name: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  street: string;
}

export interface CreateOrderInterface {
  serviceType: ServiceType;
  description: string;
  weight?: number;
  pickupAddress: AddressInterface;
  deliveryAddress: AddressInterface;
  deliveryType: DeliveryType;
  transportMode: TransportMode;
  articleType: ArticleType;
  zone?: string;
  estimatedPrice?: number;
  scheduledAt?: string;
  promoCodeId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderSeq: string;
  serviceType: string;
  description: string;
  weight: number;
  pickupAddress: AddressInterface;
  deliveryAddress: AddressInterface;
  deliveryType: string;
  zone: string;
  estimatedPrice: number | null;
  finalPrice: number | null;
  isArchived: boolean;
  status: OrderStatus;
  createdBy: User;
  transportMode: string;
  articleType: string;
  assignedTo: string;
  isAutoAssigned: boolean;
  createdAt: string;
  updatedAt: string;
  payments?: Payment[];
  scheduledAt?: string;
  isScheduled: boolean;
  scheduledNotifiedAt?: string;
  promoCodeId?: string;
  promoCodeText?: string;
  promoErrorMessage?: string;
  discountAmount?: number;
  basePriceBeforeDiscount: number;
  hiddenForClient?: boolean;
  hiddenForCourier?: boolean;
}

export interface Negotiation {
  id: string;
  order: Order;
  proposedByCourier: number | null;
  confirmedByClient: number | null;
  status: NegotiationStatus;
  paymentMethod: PaymentMethod | null;
  adminOverride: boolean;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
}
