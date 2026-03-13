import { api } from "@/lib/api/axios";
import { PromoUsageResponse } from "@/app/(dashboard)/(admin)/admin/dashboard/codepromo/types";

export const promoService = {
  /**
   * Récupérer les codes promo utilisés et disponibles pour l'utilisateur connecté
   */
  async getMyPromoUsage(): Promise<PromoUsageResponse> {
    const response = await api.get("/promo/my-usage");
    return response.data;
  },
};
