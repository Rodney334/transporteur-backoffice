import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useCampaignStore } from "../stores/campaign-store";
import { campaignService } from "../services/campaign.service";
import { Campaign, CreateCampaignDto, UpdateCampaignDto } from "../types";

export const useCampaigns = (partnerId?: string) => {
  const {
    campaigns,
    loading,
    error,
    setCampaigns,
    setLoading,
    setError,
    addCampaign,
    updateCampaign,
    removeCampaign,
  } = useCampaignStore();

  const loadCampaigns = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaignService.getCampaignsByPartner(id);
      setCampaigns(data);
    } catch (err: any) {
      console.error("Erreur chargement campagnes:", err);
      setError(err.message || "Erreur chargement campagnes");
      toast.error("Erreur lors du chargement des campagnes");
    } finally {
      setLoading(false);
    }
  }, [setCampaigns, setLoading, setError]);

  const createCampaignAction = useCallback(async (partnerId: string, data: CreateCampaignDto) => {
    try {
      setLoading(true);
      const newCampaign = await campaignService.createCampaign(partnerId, data);
      addCampaign(newCampaign);
      toast.success("Campagne créée avec succès");
      return newCampaign;
    } catch (err: any) {
      console.error("Erreur création campagne:", err);
      toast.error(err.response?.data?.message || "Erreur création campagne");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addCampaign, setLoading]);

  const updateCampaignAction = useCallback(async (partnerId: string, campaignId: string, data: UpdateCampaignDto) => {
    try {
      setLoading(true);
      const updated = await campaignService.updateCampaign(partnerId, campaignId, data);
      updateCampaign(campaignId, updated);
      toast.success("Campagne modifiée avec succès");
      return updated;
    } catch (err: any) {
      console.error("Erreur modification campagne:", err);
      toast.error(err.response?.data?.message || "Erreur modification campagne");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateCampaign, setLoading]);

  const deleteCampaignAction = useCallback(async (partnerId: string, campaignId: string) => {
    try {
      setLoading(true);
      await campaignService.deleteCampaign(partnerId, campaignId);
      removeCampaign(campaignId);
      toast.success("Campagne supprimée avec succès");
      return true;
    } catch (err: any) {
      console.error("Erreur suppression campagne:", err);
      toast.error(err.response?.data?.message || "Erreur suppression campagne");
      return false;
    } finally {
      setLoading(false);
    }
  }, [removeCampaign, setLoading]);

  return {
    campaigns,
    isLoading: loading,
    error,
    loadCampaigns,
    createCampaign: createCampaignAction,
    updateCampaign: updateCampaignAction,
    deleteCampaign: deleteCampaignAction,
  };
};
