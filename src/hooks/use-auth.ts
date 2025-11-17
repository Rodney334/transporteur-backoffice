import { useAuthStore } from "@/lib/stores/auth-store";
import { authService } from "@/lib/services/auth-service";
import type { GenderType } from "@/type/enum";
import { useCallback } from "react";

export const useAuth = () => {
  const {
    accessToken,
    refreshToken,
    user,
    isLoading,
    error,
    setTokens,
    setUser,
    logout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  // Fonction utilitaire pour gérer les erreurs
  const handleAuthError = useCallback((error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.status === 401) {
      return "Session expirée. Veuillez vous reconnecter.";
    }
    if (error.response?.status === 409) {
      return "Un compte avec cet email existe déjà";
    }
    if (error.response?.status >= 500) {
      return "Erreur serveur. Veuillez réessayer plus tard";
    }
    if (error.message?.includes("timeout")) {
      return "La requête a pris trop de temps. Veuillez réessayer.";
    }
    return "Une erreur est survenue. Veuillez réessayer";
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    clearError();
    try {
      const { accessToken: newAccessToken, user: newUser } =
        await authService.login({ email, password });
      console.log({ newUser });
      setTokens(newAccessToken, newUser.refreshToken || "");
      setUser(newUser);
      return newUser;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    countryCode: string;
    genderrole: GenderType;
  }) => {
    setLoading(true);
    clearError();
    try {
      // 1. Register
      await authService.register(userData);

      // 2. Login automatique avec les mêmes identifiants
      const { accessToken: newAccessToken, user: newUser } =
        await authService.login({
          email: userData.email,
          password: userData.password,
        });

      setTokens(newAccessToken, newUser.refreshToken || "");
      setUser(newUser);
      return newUser;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    if (!accessToken) return null;

    setLoading(true);
    clearError();
    try {
      // Pour l'instant, on retourne l'user du store
      // Quand /auth/me sera prêt, on l'utilisera ici
      return user;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      logout();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // NOUVEAU : Fonction pour rafraîchir manuellement les tokens
  const refreshAuth = async (): Promise<boolean> => {
    if (!refreshToken) {
      logout();
      return false;
    }

    console.log({ refreshToken });

    setLoading(true);
    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await authService.refreshTokens(refreshToken);

      setTokens(newAccessToken, newRefreshToken);
      return true;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    accessToken,
    refreshToken,
    user,
    isLoading,
    error,
    isAuthenticated: !!accessToken,

    // Actions
    login,
    register,
    logout: () => {
      authService.logout().catch(console.error);
      logout();
    },
    checkAuth,
    refreshAuth, // NOUVEAU
    clearError,
  };
};
