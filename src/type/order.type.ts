import {
  ArticleType,
  DeliveryType,
  NegotiationStatus,
  OrderStatus,
  PaymentMethod,
  ServiceType,
  TransportMode,
} from "./enum";
import { User } from "./user.type";

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
}

export interface Order {
  id: string;
  serviceType: string;
  description: string;
  weight: number;
  pickupAddress: AddressInterface;
  deliveryAddress: AddressInterface;
  deliveryType: string;
  zone: string;
  estimatedPrice: number | null;
  isArchived: boolean;
  status: OrderStatus;
  createdBy: User;
  transportMode: string;
  articleType: string;
  assignedTo: string;
  isAutoAssigned: boolean;
  createdAt: string;
  updatedAt: string;
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
