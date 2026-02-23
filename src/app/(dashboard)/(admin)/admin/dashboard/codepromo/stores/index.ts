// stores/promo-store.ts
import { create } from "zustand";
import { PromoCode } from "../types";

interface PromoStore {
  // États
  promos: PromoCode[];
  selectedPromo: PromoCode | null;
  loading: boolean;
  error: string | null;

  // Actions
  setPromos: (promos: PromoCode[]) => void;
  setSelectedPromo: (promo: PromoCode | null) => void;
  clearSelectedPromo: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD actions
  addPromo: (promo: PromoCode) => void;
  updatePromo: (promoId: string, updates: Partial<PromoCode>) => void;
  removePromo: (promoId: string) => void;
}

export const usePromoStore = create<PromoStore>((set) => ({
  promos: [],
  selectedPromo: null,
  loading: false,
  error: null,

  setPromos: (promos) => set({ promos }),
  setSelectedPromo: (promo) => set({ selectedPromo: promo }),
  clearSelectedPromo: () => set({ selectedPromo: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addPromo: (promo) =>
    set((state) => ({
      promos: [promo, ...state.promos],
    })),

  updatePromo: (promoId, updates) =>
    set((state) => ({
      promos: state.promos.map((promo) =>
        promo.id === promoId ? { ...promo, ...updates } : promo,
      ),
    })),

  removePromo: (promoId) =>
    set((state) => ({
      promos: state.promos.filter((promo) => promo.id !== promoId),
    })),
}));
