import { GenderType, GrantedRole } from "@/type/enum";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  role: GrantedRole;
  genderrole: GenderType;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  refreshToken: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  isAdmin: boolean;
  isClient: boolean;
  isLivreur: boolean;
  isOperateur: boolean;
}

// Helper pour gérer les cookies
const cookieHelper = {
  setToken: (name: string, token: string, maxAge: number) => {
    if (typeof document !== "undefined") {
      document.cookie = `${name}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  },

  removeToken: (name: string) => {
    if (typeof document !== "undefined") {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  },

  getToken: (name: string): string | null => {
    if (typeof document !== "undefined") {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift() || null;
      }
    }
    return null;
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isLoading: true, // ← CHANGEMENT ICI : true par défaut
      error: null,

      // Computed values
      isAdmin: false,
      isClient: false,
      isLivreur: false,
      isOperateur: false,

      setTokens: (accessToken: string, refreshToken: string) => {
        // Mettre à jour les cookies
        cookieHelper.setToken("auth-token", accessToken, 86400);
        cookieHelper.setToken("refresh-token", refreshToken, 604800);

        set({
          accessToken,
          refreshToken,
          error: null,
          isLoading: false, // ← CHANGEMENT ICI : passer à false après auth
          isAdmin: get().user?.role === GrantedRole.Admin,
          isClient: get().user?.role === GrantedRole.Client,
          isLivreur: get().user?.role === GrantedRole.Livreur,
          isOperateur: get().user?.role === GrantedRole.Operateur,
        });
      },

      setUser: (user: User) => {
        const currentState = get();
        const hasTokens = currentState.accessToken && currentState.refreshToken;

        set({
          user,
          error: null,
          isLoading: false, // ← CHANGEMENT ICI : passer à false
          isAdmin: user.role === GrantedRole.Admin,
          isClient: user.role === GrantedRole.Client,
          isLivreur: user.role === GrantedRole.Livreur,
          isOperateur: user.role === GrantedRole.Operateur,
        });

        if (
          hasTokens &&
          currentState.accessToken &&
          currentState.refreshToken
        ) {
          cookieHelper.setToken("auth-token", currentState.accessToken, 86400);
          cookieHelper.setToken(
            "refresh-token",
            currentState.refreshToken,
            604800
          );
        }
      },

      logout: () => {
        cookieHelper.removeToken("auth-token");
        cookieHelper.removeToken("refresh-token");

        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          error: null,
          isLoading: false, // ← CHANGEMENT ICI : false après logout
          isAdmin: false,
          isClient: false,
          isLivreur: false,
          isOperateur: false,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      // Optionnel : recréer l'état de loading après rehydratation
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false; // ← Hydratation terminée
        }
      },
    }
  )
);
