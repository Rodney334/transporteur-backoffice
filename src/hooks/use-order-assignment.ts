// hooks/use-order-assignment.ts -
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { userService } from "@/lib/services/user-service";
import { orderService } from "@/lib/services/order-service";
import { User } from "@/type/user.type";
import { GrantedRole } from "@/type/enum";

export const useOrderAssignment = () => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [livreurs, setLivreurs] = useState<User[]>([]);
  const [isLoadingLivreurs, setIsLoadingLivreurs] = useState(false);

  // Charger les livreurs
  const loadLivreurs = useCallback(async () => {
    setIsLoadingLivreurs(true);
    try {
      // Récupérer tous les utilisateurs
      const allUsers = await userService.getAllUsers();
      // Filtrer pour ne garder que les livreurs
      const livreursList = allUsers.filter(
        (user) => user.role === GrantedRole.Livreur
      );
      setLivreurs(livreursList);
    } catch (error: any) {
      console.log("Erreur chargement livreurs:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors du chargement des livreurs",
        { position: "top-left" }
      );
    } finally {
      setIsLoadingLivreurs(false);
    }
  }, []);

  // Charger les livreurs au montage
  // useEffect(() => {
  //   loadLivreurs();
  // }, [loadLivreurs]);

  // Ouvrir le modal d'assignation
  const openAssignmentModal = useCallback(
    (orderId: string) => {
      setSelectedOrder(orderId);
      // Recharger les livreurs à chaque ouverture du modal pour avoir les données à jour
      loadLivreurs();
    },
    [loadLivreurs]
  );

  // Fermer le modal d'assignation
  const closeAssignmentModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  // Assigner une commande à un livreur
  const assignOrder = useCallback(
    async (livreurId: string, auto: boolean = true): Promise<boolean> => {
      if (!selectedOrder) {
        toast.error("Aucune commande sélectionnée", {
          position: "top-left",
        });
        return false;
      }

      setIsAssigning(true);
      const toastId = toast.loading("Assignation de la commande...", {
        position: "top-left",
      });

      try {
        await orderService.assignOrder(selectedOrder, livreurId, auto);

        toast.update(toastId, {
          render: "Commande assignée avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });

        closeAssignmentModal();
        return true;
      } catch (error: any) {
        console.log("Erreur assignation commande:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Erreur lors de l'assignation de la commande";

        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 7000,
          closeButton: true,
        });
        return false;
      } finally {
        setIsAssigning(false);
      }
    },
    [selectedOrder, closeAssignmentModal]
  );

  return {
    livreurs,
    isLoadingLivreurs,
    isAssigning,
    selectedOrder,
    openAssignmentModal,
    closeAssignmentModal,
    assignOrder,
    loadLivreurs, // Pour recharger manuellement si besoin
  };
};
