// lib/services/negotiation-service.ts
import { api } from "@/lib/api/axios";
import { Negotiation } from "@/type/order.type";

export const negotiationService = {
  async getAllNegotiations(): Promise<Negotiation[]> {
    const response = await api.get<Negotiation[]>("/negotiation");
    return response.data;
  },

  async resolveConflict(orderId: string, amount: number): Promise<Negotiation> {
    const response = await api.patch<Negotiation>(
      `/negotiation/${orderId}/override`,
      { amount }
    );
    return response.data;
  },
};
