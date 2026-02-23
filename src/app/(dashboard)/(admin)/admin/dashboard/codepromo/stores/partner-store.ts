import { create } from "zustand";
import { Partner } from "../types";

interface PartnerStore {
  partners: Partner[];
  selectedPartner: Partner | null;
  loading: boolean;
  error: string | null;

  setPartners: (partners: Partner[]) => void;
  setSelectedPartner: (partner: Partner | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  addPartner: (partner: Partner) => void;
  updatePartner: (partnerId: string, updates: Partial<Partner>) => void;
  removePartner: (partnerId: string) => void;
}

export const usePartnerStore = create<PartnerStore>((set) => ({
  partners: [],
  selectedPartner: null,
  loading: false,
  error: null,

  setPartners: (partners) => set({ partners }),
  setSelectedPartner: (partner) => set({ selectedPartner: partner }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addPartner: (partner) =>
    set((state) => ({
      partners: [partner, ...state.partners],
    })),

  updatePartner: (partnerId, updates) =>
    set((state) => ({
      partners: state.partners.map((partner) =>
        partner.id === partnerId ? { ...partner, ...updates } : partner,
      ),
    })),

  removePartner: (partnerId) =>
    set((state) => ({
      partners: state.partners.filter((partner) => partner.id !== partnerId),
    })),
}));
