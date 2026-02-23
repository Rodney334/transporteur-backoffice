// hooks/use-promos.ts
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { usePromoStore } from "../stores";
import { promoService } from "../services";
import { useAuth } from "@/hooks/use-auth";
import { PromoCode, PromoType, CreatePromoDto, UpdatePromoDto } from "../types";

export const usePromos = () => {
  const { user } = useAuth();
  const {
    promos,
    selectedPromo,
    loading,
    error,
    setPromos,
    setSelectedPromo,
    clearSelectedPromo,
    setLoading,
    setError,
    addPromo,
    updatePromo,
    removePromo,
  } = usePromoStore();

  // Charger les codes promo
  const loadPromos = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const promosData = await promoService.getAllPromos();
      setPromos(promosData);
    } catch (error: any) {
      console.error("Erreur chargement codes promo:", error);
      setError(error.message || "Erreur lors du chargement des codes promo");
      toast.error("Erreur lors du chargement des codes promo", {
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  }, [user, setPromos, setLoading, setError]);

  // Créer un code promo
  const createPromo = useCallback(
    async (data: CreatePromoDto) => {
      try {
        setLoading(true);
        const newPromo = await promoService.createPromo(data);
        addPromo(newPromo);
        toast.success("Code promo créé avec succès", {
          position: "top-left",
        });
        return newPromo;
      } catch (error: any) {
        console.error("Erreur création code promo:", error);
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la création du code promo",
          {
            position: "top-left",
          },
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addPromo, setLoading],
  );

  // Modifier un code promo
  const updatePromoCode = useCallback(
    async (
      id: string,
      data: UpdatePromoDto,
    ) => {
      try {
        setLoading(true);
        const updatedPromo = await promoService.updatePromo(id, data);
        updatePromo(id, updatedPromo);
        toast.success("Code promo modifié avec succès", {
          position: "top-left",
        });
        return updatedPromo;
      } catch (error: any) {
        console.error("Erreur modification code promo:", error);
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la modification du code promo",
          {
            position: "top-left",
          },
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [updatePromo, setLoading],
  );

  // Supprimer un code promo
  const deletePromo = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await promoService.deletePromo(id);
        removePromo(id);
        toast.success("Code promo supprimé avec succès", {
          position: "top-left",
        });
        return true;
      } catch (error: any) {
        console.error("Erreur suppression code promo:", error);
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la suppression du code promo",
          {
            position: "top-left",
          },
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [removePromo, setLoading],
  );

  // Exporter les codes promo
  const exportPromos = useCallback(
    async (format: "csv" = "csv") => {
      try {
        setLoading(true);
        if (format === "csv") {
          await promoService.exportToCSV(promos);
          toast.success("Export CSV généré avec succès", {
            position: "top-left",
          });
        }
      } catch (error: any) {
        console.error("Erreur export codes promo:", error);
        toast.error("Erreur lors de l'export des codes promo", {
          position: "top-left",
        });
      } finally {
        setLoading(false);
      }
    },
    [promos, setLoading],
  );

  // Formater la date
  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Formater le type de promo
  const formatPromoType = useCallback((type: PromoType, value: number) => {
    if (type === "PERCENT") {
      return `${value}%`;
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  // Obtenir la couleur du statut actif/inactif
  const getActiveStatusColor = useCallback((isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  }, []);

  // Ouvrir le modal de détails
  const openDetailsModal = useCallback(
    (promo: PromoCode) => {
      setSelectedPromo(promo);
    },
    [setSelectedPromo],
  );

  // Fermer le modal
  const closeDetailsModal = useCallback(() => {
    clearSelectedPromo();
  }, [clearSelectedPromo]);

  // Charger les codes promo au montage
  useEffect(() => {
    if (user) {
      loadPromos();
    }
  }, [user, loadPromos]);

  return {
    // Données
    promos,
    selectedPromo,
    isLoading: loading,
    error,

    // Actions
    loadPromos,
    createPromo,
    updatePromo: updatePromoCode,
    deletePromo,
    exportPromos,
    openDetailsModal,
    closeDetailsModal,

    // Formateurs
    formatDate,
    formatPromoType,
    getActiveStatusColor,
  };
};
