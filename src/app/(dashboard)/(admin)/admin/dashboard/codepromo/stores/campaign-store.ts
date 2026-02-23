import { create } from "zustand";
import { Campaign } from "../types";

interface CampaignStore {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;

  setCampaigns: (campaigns: Campaign[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => void;
  removeCampaign: (campaignId: string) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  campaigns: [],
  loading: false,
  error: null,

  setCampaigns: (campaigns: Campaign[]) => set({ campaigns }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  addCampaign: (campaign: Campaign) =>
    set((state) => ({
      campaigns: [campaign, ...state.campaigns],
    })),

  updateCampaign: (campaignId: string, updates: Partial<Campaign>) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, ...updates } : campaign,
      ),
    })),

  removeCampaign: (campaignId: string) =>
    set((state) => ({
      campaigns: state.campaigns.filter((campaign) => campaign.id !== campaignId),
    })),
}));
