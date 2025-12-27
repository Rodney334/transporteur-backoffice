// hooks/use-negotiation-management.ts
import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { negotiationService } from "@/lib/services/negotiation-service";
import { userService } from "@/lib/services/user-service";
import { Negotiation, Order } from "@/type/order.type";
import { NegotiationStatus, GrantedRole } from "@/type/enum";
import { User } from "@/type/user.type";
import { useAuth } from "@/hooks/use-auth";

export interface ExtendedNegotiation extends Negotiation {
  livreur?: User;
  client?: User;
}

export const useNegotiationManagement = () => {
  const { user: currentUser } = useAuth();
  const [negotiations, setNegotiations] = useState<ExtendedNegotiation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<NegotiationStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isResolving, setIsResolving] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] =
    useState<ExtendedNegotiation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  // Vérifier les permissions
  const canResolve =
    currentUser?.role === GrantedRole.Admin ||
    currentUser?.role === GrantedRole.Operateur;

  // Charger les négociations
  const loadNegotiations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Chargement des litiges...", {
      position: "top-left",
    });

    try {
      const negotiationsData = await negotiationService.getAllNegotiations();

      // Enrichir les données avec les informations des utilisateurs
      const enrichedNegotiations = await Promise.all(
        negotiationsData.map(async (negotiation) => {
          let livreur: User | undefined;
          let client: User | undefined;

          try {
            // Récupérer les informations du livreur
            if (negotiation.order.assignedTo) {
              livreur = await userService.getUserById(
                negotiation.order.assignedTo
              );
            }

            // Récupérer les informations du client
            if (negotiation.order.createdBy?._id) {
              client = negotiation.order.createdBy;
            }
          } catch (error) {
            console.error("Erreur chargement utilisateurs:", error);
          }

          return {
            ...negotiation,
            livreur,
            client,
          };
        })
      );

      setNegotiations(enrichedNegotiations);

      toast.update(toastId, {
        render: "Litiges chargés avec succès",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    } catch (error: any) {
      console.error("Erreur chargement négociations:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors du chargement des litiges";

      setError(errorMessage);
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger au montage
  useEffect(() => {
    if (canResolve) {
      loadNegotiations();
    }
  }, [loadNegotiations, canResolve]);

  // Filtrer et paginer les négociations
  const filteredNegotiations = useMemo(() => {
    return negotiations.filter((negotiation) => {
      // Filtre par statut
      if (statusFilter !== "all" && negotiation.status !== statusFilter) {
        return false;
      }

      // Filtre par recherche
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        negotiation.order.id.toLowerCase().includes(query) ||
        negotiation.order.pickupAddress.city.toLowerCase().includes(query) ||
        negotiation.order.deliveryAddress.city.toLowerCase().includes(query) ||
        negotiation.livreur?.name.toLowerCase().includes(query) ||
        false ||
        negotiation.client?.name.toLowerCase().includes(query) ||
        false ||
        negotiation.proposedByCourier?.toString().includes(query) ||
        false ||
        negotiation.confirmedByClient?.toString().includes(query) ||
        false
      );
    });
  }, [negotiations, statusFilter, searchQuery]);

  // Pagination
  const paginatedNegotiations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNegotiations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNegotiations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredNegotiations.length / itemsPerPage);

  // Résoudre un conflit
  const resolveConflict = useCallback(
    async (orderId: string, amount: number) => {
      setIsResolving(true);
      const toastId = toast.loading("Résolution du litige en cours...", {
        position: "top-left",
      });

      try {
        const updatedNegotiation = await negotiationService.resolveConflict(
          orderId,
          amount
        );

        // Mettre à jour la liste
        setNegotiations((prev) =>
          prev.map((n) =>
            n.id === updatedNegotiation.id
              ? {
                  ...n,
                  ...updatedNegotiation,
                  status: updatedNegotiation.status,
                }
              : n
          )
        );

        toast.update(toastId, {
          render: "Litige résolu avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });

        setShowResolveModal(false);
        return true;
      } catch (error: any) {
        console.error("Erreur résolution litige:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Erreur lors de la résolution du litige";

        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 7000,
          closeButton: true,
        });
        return false;
      } finally {
        setIsResolving(false);
      }
    },
    []
  );

  // Ouvrir le modal de détails
  const openDetailModal = useCallback((negotiation: ExtendedNegotiation) => {
    setSelectedNegotiation(negotiation);
    setShowDetailModal(true);
  }, []);

  // Ouvrir le modal de résolution
  const openResolveModal = useCallback((negotiation: ExtendedNegotiation) => {
    setSelectedNegotiation(negotiation);
    setShowResolveModal(true);
  }, []);

  // Fermer les modals
  const closeModals = useCallback(() => {
    setShowDetailModal(false);
    setShowResolveModal(false);
    setSelectedNegotiation(null);
  }, []);

  // Statistiques
  const stats = useMemo(() => {
    const total = negotiations.length;
    const inConflict = negotiations.filter(
      (n) => n.status === NegotiationStatus.EN_CONFLIT
    ).length;
    const pending = negotiations.filter(
      (n) => n.status === NegotiationStatus.EN_ATTENTE
    ).length;
    const resolved = negotiations.filter(
      (n) => n.status === NegotiationStatus.PRIX_VALIDE
    ).length;

    return { total, inConflict, pending, resolved };
  }, [negotiations]);

  return {
    // Données
    negotiations: paginatedNegotiations,
    filteredNegotiations,
    selectedNegotiation,
    stats,

    // États
    isLoading,
    error,
    isResolving,
    showDetailModal,
    showResolveModal,
    searchQuery,
    statusFilter,
    currentPage,
    itemsPerPage,
    totalPages,
    canResolve,

    // Actions
    setSearchQuery,
    setStatusFilter,
    setCurrentPage,
    loadNegotiations,
    resolveConflict,
    openDetailModal,
    openResolveModal,
    closeModals,
  };
};
