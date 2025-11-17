// lib/services/order-service.ts
import { api } from "@/lib/api/axios";
import { CreateOrderInterface } from "@/type/order.type";

export const orderService = {
  async createOrder(orderData: CreateOrderInterface) {
    const response = await api.post("/order", orderData);
    return response.data;
  },
};
