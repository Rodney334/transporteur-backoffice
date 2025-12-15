// hooks/use-users-management.ts
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useUsersStore } from "@/lib/stores/users-store";
import { userService } from "@/lib/services/user-service";
import { GrantedRole } from "@/type/enum";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/type/user.type";

export const useUsersManagement = () => {
  const { user: currentUser } = useAuth();
  const {
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    setLoading,
    setError,
    clearError,
    promoteUser: updateUserInStore,
  } = useUsersStore();

  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Charger les utilisateurs
  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    clearError();

    try {
      const users = await userService.getAllUsers();
      setUsers(users);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors du chargement des utilisateurs";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-left" });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [setUsers, setError, clearError]);

  // Ouvrir le modal de promotion
  const openPromotionModal = useCallback(
    (user: User) => {
      setSelectedUser(user);
    },
    [setSelectedUser]
  );

  // Fermer le modal
  const closePromotionModal = useCallback(() => {
    setSelectedUser(null);
  }, [setSelectedUser]);

  // Promouvoir un utilisateur
  const promoteUser = useCallback(
    async (userId: string, role: GrantedRole) => {
      const toastId = toast.loading("Changement de rôle en cours...", {
        position: "top-left",
      });

      try {
        const updatedUser = await userService.promoteUser(userId, role);

        // Mettre à jour le store local
        updateUserInStore(userId, role);

        toast.update(toastId, {
          render: `Rôle mis à jour avec succès !`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });

        closePromotionModal();
        return updatedUser;
      } catch (error: any) {
        console.error("Erreur promotion utilisateur:", error);
        const errorMessage =
          error.response?.data?.message || "Erreur lors du changement de rôle";

        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 7000,
          closeButton: true,
        });
        throw error;
      }
    },
    [updateUserInStore, closePromotionModal]
  );

  // Vérifier si l'utilisateur courant est admin
  const isAdmin = currentUser?.role === GrantedRole.Admin;

  // Obtenir le libellé du rôle
  const getRoleLabel = useCallback((role: GrantedRole): string => {
    const labels: Record<GrantedRole, string> = {
      [GrantedRole.Admin]: "Administrateur",
      [GrantedRole.Livreur]: "Livreur",
      [GrantedRole.Operateur]: "Opérateur",
      [GrantedRole.Client]: "Client",
      [GrantedRole.User]: "Utilisateur",
    };
    return labels[role] || role;
  }, []);

  // Obtenir le libellé du genre
  const getGenderLabel = useCallback((gender: string): string => {
    const genders: Record<string, string> = {
      man: "Homme",
      women: "Femme",
      other: "Autre",
    };
    return genders[gender] || gender;
  }, []);

  return {
    // State
    users,
    isLoadingUsers,
    selectedUser,
    isAdmin,

    // Actions
    loadUsers,
    openPromotionModal,
    closePromotionModal,
    promoteUser,
    getRoleLabel,
    getGenderLabel,
  };
};
