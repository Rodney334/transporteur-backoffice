import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { usePartnerStore } from "../stores/partner-store";
import { partnerService } from "../services/partner.service";
import { Partner, CreatePartnerDto, UpdatePartnerDto, BatchPromoDto } from "../types";
import { useAuth } from "@/hooks/use-auth";

export const usePartners = () => {
  const { user } = useAuth();
  const {
    partners,
    selectedPartner,
    loading,
    error,
    setPartners,
    setSelectedPartner,
    setLoading,
    setError,
    addPartner,
    updatePartner,
    removePartner,
  } = usePartnerStore();

  const loadPartners = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await partnerService.getAllPartners();
      setPartners(data);
    } catch (err: any) {
      console.error("Erreur chargement partenaires:", err);
      setError(err.message || "Erreur chargement partenaires");
      toast.error("Erreur lors du chargement des partenaires");
    } finally {
      setLoading(false);
    }
  }, [user, setPartners, setLoading, setError]);

  const createPartner = useCallback(async (data: CreatePartnerDto) => {
    try {
      setLoading(true);
      const newPartner = await partnerService.createPartner(data);
      addPartner(newPartner);
      toast.success("Partenaire créé avec succès");
      return newPartner;
    } catch (err: any) {
      console.error("Erreur création partenaire:", err);
      toast.error(err.response?.data?.message || "Erreur création partenaire");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addPartner, setLoading]);

  const updatePartnerAction = useCallback(async (id: string, data: UpdatePartnerDto) => {
    try {
      setLoading(true);
      const updated = await partnerService.updatePartner(id, data);
      updatePartner(id, updated);
      toast.success("Partenaire modifié avec succès");
      return updated;
    } catch (err: any) {
      console.error("Erreur modification partenaire:", err);
      toast.error(err.response?.data?.message || "Erreur modification partenaire");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updatePartner, setLoading]);

  const deletePartnerAction = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await partnerService.deletePartner(id);
      removePartner(id);
      toast.success("Partenaire supprimé avec succès");
      return true;
    } catch (err: any) {
      console.error("Erreur suppression partenaire:", err);
      toast.error(err.response?.data?.message || "Erreur suppression partenaire");
      return false;
    } finally {
      setLoading(false);
    }
  }, [removePartner, setLoading]);

  const generateBatch = useCallback(async (companyId: string, data: BatchPromoDto) => {
    try {
      setLoading(true);
      await partnerService.generateBatchPromos(companyId, data);
      toast.success("Batch de codes promo généré avec succès");
      return true;
    } catch (err: any) {
      console.error("Erreur génération batch:", err);
      toast.error(err.response?.data?.message || "Erreur génération batch");
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    if (user) {
      loadPartners();
    }
  }, [user, loadPartners]);

  return {
    partners,
    selectedPartner,
    isLoading: loading,
    error,
    loadPartners,
    createPartner,
    updatePartner: updatePartnerAction,
    deletePartner: deletePartnerAction,
    generateBatch,
    setSelectedPartner,
  };
};
