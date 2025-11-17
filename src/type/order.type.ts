import { ArticleType, DeliveryType, ServiceType, TransportMode } from "./enum";

// export interface CreateOrderData {
//   serviceType: "courrier" | "colis" | "transport";
//   description: string;
//   weight: number;
//   pickupAddress: {
//     name: string;
//     phone: string;
//     country: string;
//     city: string;
//     district: string;
//     street: string;
//   };
//   deliveryAddress: {
//     name: string;
//     phone: string;
//     country: string;
//     city: string;
//     district: string;
//     street: string;
//   };
//   deliveryType: "express" | "standard";
//   zone: string;
//   estimatedPrice: number;
// }

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
