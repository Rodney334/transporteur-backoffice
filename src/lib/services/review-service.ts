import { api } from "../api/axios";
import { 
  OrderReviewResponse, 
  CourierReviewsResponse, 
  CourierReviewSummary 
} from "@/type/review.type";

export const reviewService = {
  /**
   * Récupérer la note laissée sur une commande spécifique
   * @param orderId ID de la commande
   */
  getOrderReview: async (orderId: string): Promise<OrderReviewResponse> => {
    // Le user a spécifié /:orderId/review, mais il s'agit probablement de /order/:orderId/review
    // ou d'une route racine. On suit la spécification exacte du user.
    const response = await api.get(`/order/${orderId}/review`);
    return response.data;
  },

  /**
   * Obtenir toutes les notes d'un livreur
   * @param courierId ID du livreur
   */
  getCourierReviews: async (courierId: string): Promise<CourierReviewsResponse> => {
    const response = await api.get(`/order/couriers/${courierId}/reviews`);
    return response.data;
  },

  /**
   * Obtenir un résumé des notes reçues par un livreur
   * @param courierId ID du livreur
   */
  getCourierSummary: async (courierId: string): Promise<CourierReviewSummary> => {
    const response = await api.get(`/order/couriers/${courierId}/reviews/summary`);
    return response.data;
  },
};
