import { api } from "@/lib/api/axios";
import { Partner, CreatePartnerDto, UpdatePartnerDto, BatchPromoDto } from "../types";

export const partnerService = {
  // Récupérer tous les partenaires
  async getAllPartners(): Promise<Partner[]> {
    const response = await api.get("/promo/partners");
    return response.data;
  },

  // Récupérer un partenaire par ID
  async getPartnerById(id: string): Promise<Partner> {
    const response = await api.get(`/promo/partners/${id}`);
    return response.data;
  },

  // Créer un partenaire
  async createPartner(data: CreatePartnerDto): Promise<Partner> {
    const response = await api.post("/promo/partners", data);
    return response.data;
  },

  // Modifier un partenaire
  async updatePartner(id: string, data: UpdatePartnerDto): Promise<Partner> {
    const response = await api.patch(`/promo/partners/${id}`, data);
    return response.data;
  },

  // Supprimer un partenaire
  async deletePartner(id: string): Promise<void> {
    await api.delete(`/promo/partners/${id}`);
  },

  // Générer un batch de codes promo pour un partenaire
  async generateBatchPromos(companyId: string, data: BatchPromoDto): Promise<void> {
    await api.post(`/promo/partners/${companyId}/promos/batch`, data);
  },
};
