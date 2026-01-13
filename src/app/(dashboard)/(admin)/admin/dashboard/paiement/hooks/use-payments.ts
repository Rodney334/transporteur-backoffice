import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { usePaymentStore } from "../stores/payment-store";
import { paymentService } from "@/lib/services/payment-service";
import { userService } from "@/lib/services/user-service";
import { useAuth } from "@/hooks/use-auth";
import { Payment } from "../types/payment.type";
import { PaymentStatus, PaymentMethod } from "@/type/enum";

export const usePayments = () => {
  const { user } = useAuth();
  const {
    payments,
    selectedPayment,
    loading,
    error,
    setPayments,
    setSelectedPayment,
    clearSelectedPayment,
    setLoading,
    setError,
    updatePayment,
    removePayment,
  } = usePaymentStore();

  const [deliverers, setDeliverers] = useState<Record<string, any>>({});

  // Charger les paiements
  const loadPayments = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const paymentsData = await paymentService.getAllPayments();
      setPayments(paymentsData);

      // Charger les informations des livreurs
      const delivererIds = Array.from(
        new Set(paymentsData.map((p) => p.order.assignedTo).filter(Boolean))
      );

      const delivererPromises = delivererIds.map(async (id) => {
        try {
          const deliverer = await userService.getUserById(id as string);
          return { [id]: deliverer };
        } catch (error) {
          console.error(`Erreur chargement livreur ${id}:`, error);
          return { [id]: null };
        }
      });

      const delivererResults = await Promise.all(delivererPromises);
      const deliverersMap = delivererResults.reduce<Record<string, any>>(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setDeliverers(deliverersMap);
    } catch (error: any) {
      console.log("Erreur chargement paiements:", error);
      setError(error.message || "Erreur lors du chargement des paiements");
      toast.error("Erreur lors du chargement des paiements", {
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  }, [user, setPayments, setLoading, setError]);

  // Marquer comme payé
  const markAsPaid = useCallback(
    async (paymentId: string) => {
      try {
        setLoading(true);
        const updatedPayment = await paymentService.markAsPaid(paymentId);
        updatePayment(paymentId, updatedPayment);
        toast.success("Paiement marqué comme reçu avec succès", {
          position: "top-left",
        });
        return true;
      } catch (error: any) {
        console.log("Erreur marquage paiement:", error);
        toast.error("Erreur lors du marquage du paiement", {
          position: "top-left",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updatePayment, setLoading]
  );

  // Supprimer un paiement
  const deletePayment = useCallback(
    async (paymentId: string) => {
      try {
        setLoading(true);
        await paymentService.deletePayment(paymentId);
        removePayment(paymentId);
        toast.success("Paiement supprimé avec succès", {
          position: "top-left",
        });
        return true;
      } catch (error: any) {
        console.log("Erreur suppression paiement:", error);
        toast.error("Erreur lors de la suppression du paiement", {
          position: "top-left",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [removePayment, setLoading]
  );

  // Exporter les paiements
  const exportPayments = useCallback(
    async (format: "csv" | "pdf" = "csv") => {
      try {
        setLoading(true);
        const result = await paymentService.exportPayments(format);

        if (result.csvUrl || result.pdfUrl) {
          const url = format === "csv" ? result.csvUrl : result.pdfUrl;
          window.open(url, "_blank");
          toast.success(`Export ${format.toUpperCase()} généré avec succès`, {
            position: "top-left",
          });
        } else {
          toast.info(result.message || "Export en cours de génération", {
            position: "top-left",
          });
        }

        return result;
      } catch (error: any) {
        console.log("Erreur export paiements:", error);
        toast.error("Erreur lors de l'export des paiements", {
          position: "top-left",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  // Formater l'adresse
  const formatAddress = useCallback((address: any) => {
    if (!address) return "N/A";
    const parts = [
      address.street,
      address.district,
      address.city,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  }, []);

  // Formater le prix
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Formater la date
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Formater la méthode de paiement
  const formatPaymentMethod = useCallback((method: PaymentMethod) => {
    const translations: Record<PaymentMethod, string> = {
      [PaymentMethod.CASH]: "Espèces",
      [PaymentMethod.MOBILE_MONEY]: "Mobile Money",
      [PaymentMethod.CARD]: "Carte",
    };
    return translations[method] || method;
  }, []);

  // Formater le statut
  const formatPaymentStatus = useCallback((status: PaymentStatus) => {
    const translations: Record<PaymentStatus, string> = {
      [PaymentStatus.PENDING]: "En attente",
      [PaymentStatus.PAID]: "Payé",
      [PaymentStatus.FAILED]: "Échoué",
    };
    return translations[status] || status;
  }, []);

  // Obtenir la couleur du statut
  const getStatusColor = useCallback((status: PaymentStatus) => {
    const colors: Record<PaymentStatus, string> = {
      [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [PaymentStatus.PAID]: "bg-green-100 text-green-800",
      [PaymentStatus.FAILED]: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }, []);

  // Obtenir la couleur de la méthode
  const getMethodColor = useCallback((method: PaymentMethod) => {
    const colors: Record<PaymentMethod, string> = {
      [PaymentMethod.CASH]: "bg-green-100 text-green-800",
      [PaymentMethod.MOBILE_MONEY]: "bg-blue-100 text-blue-800",
      [PaymentMethod.CARD]: "bg-purple-100 text-purple-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  }, []);

  // Ouvrir le modal de détails
  const openDetailsModal = useCallback(
    (payment: Payment) => {
      setSelectedPayment(payment);
    },
    [setSelectedPayment]
  );

  // Fermer le modal
  const closeDetailsModal = useCallback(() => {
    clearSelectedPayment();
  }, [clearSelectedPayment]);

  // Charger les paiements au montage
  useEffect(() => {
    if (user) {
      loadPayments();
    }
  }, [user, loadPayments]);

  return {
    // Données
    payments,
    selectedPayment,
    deliverers,
    isLoading: loading,
    error,

    // Actions
    loadPayments,
    markAsPaid,
    deletePayment,
    exportPayments,
    openDetailsModal,
    closeDetailsModal,

    // Formateurs
    formatAddress,
    formatPrice,
    formatDate,
    formatPaymentMethod,
    formatPaymentStatus,
    getStatusColor,
    getMethodColor,
  };
};
