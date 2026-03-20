import { api } from "../api/axios";
import { FormSubmission, FormSubmissionsResponse } from "@/type/form-submission.type";

export const formSubmissionService = {
  /**
   * Récupérer la liste des soumissions de formulaire
   * @param page Numéro de la page (1-based)
   * @param limit Nombre d'éléments par page
   */
  getSubmissions: async (page: number = 1, limit: number = 10): Promise<FormSubmissionsResponse> => {
    const response = await api.get("/formssubmition", {
      params: { page, limit },
    });
    // Si l'API renvoie directement le tableau, on adapte
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length, // À ajuster si l'API renvoie le total ailleurs
        page,
        limit,
      };
    }
    return response.data;
  },

  /**
   * Supprimer une soumission
   * @param id ID de la soumission
   */
  deleteSubmission: async (id: string): Promise<void> => {
    await api.delete(`/formssubmition/${id}`);
  },

  /**
   * Marquer une soumission comme traitée ou non
   * @param id ID de la soumission
   * @param isHandled État de traitement
   */
  toggleHandled: async (id: string, isHandled: boolean): Promise<FormSubmission> => {
    const response = await api.patch(`/formssubmition/${id}/handled`, { isHandled });
    return response.data;
  },
};
