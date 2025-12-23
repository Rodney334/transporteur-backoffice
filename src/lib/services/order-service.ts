// lib/services/order-service.ts
import { api } from "@/lib/api/axios";
import { OrderStatus } from "@/type/enum";
import { CreateOrderInterface, Negotiation, Order } from "@/type/order.type";

export const orderService = {
  async createOrder(orderData: CreateOrderInterface) {
    const response = await api.post("/order", orderData);
    return response.data;
  },

  async getOrder(): Promise<Order[]> {
    const response = await api.get("/order/orders");
    // console.log("get order : ", response.data);
    return response.data;
  },

  async getUserOrder(clientId: string): Promise<Order[]> {
    const response = await api.get(`/order/client/${clientId}`);
    console.log("get user order : ", response.data);
    return response.data;
  },

  async getLivreurOrder(userId: string): Promise<Order[]> {
    const response = await api.get(`/order/user/${userId}`);
    return response.data;
  },

  async acceptOrder(orderId: string) {
    const response = await api.patch(`/order/${orderId}/claim`, {});
    return response.data;
  },

  async rejectOrder(orderId: string) {
    const response = await api.patch(`/order/${orderId}/reject`, {});
    return response.data;
  },

  async endOrder(orderId: string) {
    const response = await api.patch(`/order/${orderId}/status`, {
      status: OrderStatus.LIVREE,
    });
    return response.data;
  },

  async assignOrder(orderId: string, livreurId: string, auto: boolean = true) {
    const response = await api.patch(`/order/${orderId}/assign`, {
      livreurId,
      auto,
    });
    return response.data;
  },

  async validatePrice(orderId: string, amount: number) {
    const response = await api.patch(`/negotiation/${orderId}/propose`, {
      amount,
    });
    return response.data;
  },

  async clientValidatePrice(orderId: string, amount: number, method: string) {
    const response = await api.patch(`/negotiation/${orderId}/confirm`, {
      amount,
      method,
    });
    return response.data;
  },

  async getOrderNegociationPrice(orderId: string): Promise<Negotiation> {
    const response = await api.get(`/negotiation/${orderId}`);
    return response.data;
  },
};
