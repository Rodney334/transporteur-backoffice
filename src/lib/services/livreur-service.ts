// lib/services/livreur-service.ts
import { api } from "@/lib/api/axios";
import {
  LivreurProfile,
  UpdateLivreurProfileData,
  ApproveRejectData,
} from "@/type/livreur.type";

export const livreurService = {
  // Récupérer le profil d'un livreur
  async getLivreurProfile(userId: string): Promise<LivreurProfile> {
    const response = await api.get<LivreurProfile>(
      `/livreur/${userId}/profile`,
    );
    return response.data;
  },

  // Mettre à jour le profil d'un livreur
  async updateLivreurProfile(
    userId: string,
    data: UpdateLivreurProfileData,
  ): Promise<LivreurProfile> {
    const response = await api.put<LivreurProfile>(
      `/livreur/${userId}/profile`,
      data,
    );
    return response.data;
  },

  // Approuver le profil d'un livreur (admin/opérateur)
  async approveLivreurProfile(
    userId: string,
    data?: ApproveRejectData,
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/livreuradmin/${userId}/approve`,
      data || { note: "Profil OK" },
    );
    return response.data;
  },

  // Rejeter le profil d'un livreur (admin/opérateur)
  async rejectLivreurProfile(
    userId: string,
    data: ApproveRejectData,
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/livreuradmin/${userId}/reject`,
      data,
    );
    return response.data;
  },
};
