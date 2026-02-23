// lib/services/promo-service.ts
import { PromoCode, CreatePromoDto, UpdatePromoDto } from "../types";
import { api } from "@/lib/api/axios";

export const promoService = {
  // Récupérer tous les codes promo
  async getAllPromos(): Promise<PromoCode[]> {
    const response = await api.get("/promo/codes");
    return response.data;
  },

  // Récupérer un code promo par ID
  async getPromoById(id: string): Promise<PromoCode> {
    const response = await api.get(`/promo/codes/${id}`);
    return response.data;
  },

  // Créer un code promo
  async createPromo(data: CreatePromoDto): Promise<PromoCode> {
    const response = await api.post("/promo/codes", data);
    return response.data;
  },

  // Modifier un code promo
  async updatePromo(id: string, data: UpdatePromoDto): Promise<PromoCode> {
    const response = await api.patch(`/promo/codes/${id}`, data);
    return response.data;
  },

  // Supprimer un code promo
  async deletePromo(id: string): Promise<void> {
    await api.delete(`/promo/codes/${id}`);
  },

  // Exporter en CSV
  async exportToCSV(promos: PromoCode[]): Promise<void> {
    const headers = [
      "ID",
      "Code",
      "Type",
      "Valeur",
      "Actif",
      "Limite utilisations",
      "Limite par utilisateur",
      "Date début",
      "Date fin",
      "Créé le",
      "Mis à jour le",
      "Canal",
      "Company ID",
      "Campagne ID",
      "User ID assigné",
      "Montant min. commande",
      "Remise max",
      "Contraintes",
    ];

    const rows = promos.map((promo) => [
      promo.id,
      promo.code,
      promo.type,
      promo.type === "PERCENT" ? `${promo.value}%` : `${promo.value} XOF`,
      promo.isActive ? "Oui" : "Non",
      promo.usageLimit?.toString() || "-",
      promo.usageLimitPerUser?.toString() || "-",
      promo.startsAt ? new Date(promo.startsAt).toLocaleString("fr-FR") : "-",
      promo.endsAt ? new Date(promo.endsAt).toLocaleString("fr-FR") : "-",
      new Date(promo.createdAt).toLocaleString("fr-FR"),
      new Date(promo.updatedAt).toLocaleString("fr-FR"),
      promo.channel,
      promo.companyId || "-",
      promo.campaignId || "-",
      promo.assignedUserId || "-",
      promo.minOrderAmount?.toString() || "-",
      promo.maxDiscount?.toString() || "-",
      promo.constraints ? JSON.stringify(promo.constraints) : "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `codes_promo_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
