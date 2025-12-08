import axios from "axios";
import { useAuthStore } from "@/lib/stores/auth-store";
import { authService } from "@/lib/services/auth-service";

// Configuration de base
export const api = axios.create({
  baseURL: "https://letransporteur-production.up.railway.app/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variables pour gérer la file d'attente pendant le refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

// Fonction pour traiter la file d'attente
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur pour injecter le token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// NOUVEAU : Intercepteur de réponse avancé avec gestion du refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà retenté
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   // Si déjà en train de rafraîchir, mettre en file d'attente
    //   if (isRefreshing) {
    //     return new Promise((resolve, reject) => {
    //       failedQueue.push({ resolve, reject });
    //     })
    //       .then((token) => {
    //         originalRequest.headers.Authorization = `Bearer ${token}`;
    //         return api(originalRequest);
    //       })
    //       .catch((err) => Promise.reject(err));
    //   }

    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   try {
    //     const refreshToken = useAuthStore.getState().refreshToken;

    //     if (!refreshToken) {
    //       throw new Error("Aucun refresh token disponible");
    //     }

    //     // Appel au endpoint de refresh
    //     const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    //       await authService.refreshTokens(refreshToken);

    //     // Mettre à jour le store avec les nouveaux tokens
    //     useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

    //     // Traiter la file d'attente avec le nouveau token
    //     processQueue(null, newAccessToken);

    //     // Retenter la requête originale avec le nouveau token
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return api(originalRequest);
    //   } catch (refreshError) {
    //     // En cas d'erreur de refresh, déconnecter l'utilisateur
    //     processQueue(refreshError, null);
    //     useAuthStore.getState().logout();

    //     // Rediriger vers la page de login si on est côté client
    //     if (typeof window !== "undefined") {
    //       window.location.href = "/login";
    //     }

    //     return Promise.reject(refreshError);
    //   } finally {
    //     isRefreshing = false;
    //   }
    // }

    // Gestion d'autres erreurs
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
