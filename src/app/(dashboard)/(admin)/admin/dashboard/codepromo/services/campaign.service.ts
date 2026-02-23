import { api } from "@/lib/api/axios";
import { Campaign, CreateCampaignDto, UpdateCampaignDto } from "../types";

export const campaignService = {
  // Récupérer les campagnes d'un partenaire
  async getCampaignsByPartner(partnerId: string): Promise<Campaign[]> {
    const response = await api.get(`/promo/partners/${partnerId}/campaigns`);
    return response.data;
  },

  // Créer une campagne pour un partenaire
  async createCampaign(partnerId: string, data: CreateCampaignDto): Promise<Campaign> {
    const response = await api.post(`/promo/partners/${partnerId}/campaigns`, data);
    return response.data;
  },

  // Modifier une campagne
  async updateCampaign(partnerId: string, campaignId: string, data: UpdateCampaignDto): Promise<Campaign> {
    const response = await api.patch(`/promo/partners/${partnerId}/campaigns/${campaignId}`, data);
    return response.data;
  },

  // Supprimer une campagne
  async deleteCampaign(partnerId: string, campaignId: string): Promise<void> {
    await api.delete(`/promo/partners/${partnerId}/campaigns/${campaignId}`);
  },
};
