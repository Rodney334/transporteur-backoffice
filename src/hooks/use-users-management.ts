// hooks/use-users-management.ts
import { useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { getFriendlyErrorMessage } from "@/utils/error-handler";
import { useUsersStore } from "@/lib/stores/users-store";
import { userService } from "@/lib/services/user-service";
import { livreurService } from "@/lib/services/livreur-service"; // IMPORT NOUVEAU
import { GrantedRole, LivreurVerificationStatus } from "@/type/enum";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/type/user.type";
import type {
  LivreurProfile,
  UpdateLivreurProfileData,
  ApproveRejectData,
} from "@/type/livreur.type";

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

    // NOUVEAU : État et actions pour le livreur
    selectedLivreur,
    livreurProfile,
    isLivreurModalOpen,
    setSelectedLivreur,
    setLivreurProfile,
    openLivreurModal,
    closeLivreurModal,
  } = useUsersStore();

  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingLivreurProfile, setIsLoadingLivreurProfile] = useState(false);

  // Charger les utilisateurs
  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    clearError();

    try {
      const users = await userService.getAllUsers();
      setUsers(users);
    } catch (error: any) {
      const errorMessage = getFriendlyErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-left" });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [setUsers, setError, clearError]);

  // NOUVEAU : Charger le profil livreur
  const loadLivreurProfile = useCallback(
    async (userId: string) => {
      setIsLoadingLivreurProfile(true);
      try {
        const profile = await livreurService.getLivreurProfile(userId);
        setLivreurProfile(profile);
        return profile;
      } catch (error: any) {
        console.log("Erreur chargement profil livreur:", error);
        // Si le profil n'existe pas (404), on retourne null
        if (error.response?.status === 404) {
          setLivreurProfile(null);
          return null;
        }
        const errorMessage = getFriendlyErrorMessage(error);
        toast.error(errorMessage, { position: "top-left" });
        throw error;
      } finally {
        setIsLoadingLivreurProfile(false);
      }
    },
    [setLivreurProfile],
  );

  // Ouvrir le modal de promotion
  const openPromotionModal = useCallback(
    (user: User) => {
      setSelectedUser(user);
    },
    [setSelectedUser],
  );

  // Fermer le modal de promotion
  const closePromotionModal = useCallback(() => {
    setSelectedUser(null);
  }, [setSelectedUser]);

  // NOUVEAU : Ouvrir le modal livreur et charger les données
  const openLivreurProfileModal = useCallback(
    async (user: User) => {
      setSelectedLivreur(user);
      openLivreurModal(user);

      // Charger les données existantes
      await loadLivreurProfile(user._id);
    },
    [setSelectedLivreur, openLivreurModal, loadLivreurProfile],
  );

  // NOUVEAU : Fermer le modal livreur
  const closeLivreurProfileModal = useCallback(() => {
    closeLivreurModal();
  }, [closeLivreurModal]);

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
        console.log("Erreur promotion utilisateur:", error);
        const errorMessage = getFriendlyErrorMessage(error);

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
    [updateUserInStore, closePromotionModal],
  );

  // NOUVEAU : Mettre à jour le profil livreur
  const updateLivreurProfile = useCallback(
    async (
      userId: string,
      data: UpdateLivreurProfileData,
    ): Promise<LivreurProfile> => {
      const toastId = toast.loading("Mise à jour du profil en cours...", {
        position: "top-left",
      });

      try {
        const updatedProfile = await livreurService.updateLivreurProfile(
          userId,
          data,
        );

        // Mettre à jour le store local
        setLivreurProfile(updatedProfile);

        toast.update(toastId, {
          render: "Profil mis à jour avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });

        return updatedProfile;
      } catch (error: any) {
        console.log("Erreur mise à jour profil livreur:", error);
        const errorMessage = getFriendlyErrorMessage(error);

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
    [setLivreurProfile],
  );

  // NOUVEAU : Approuver le profil
  const approveLivreurProfile = useCallback(
    async (userId: string, note?: string): Promise<{ message: string }> => {
      const toastId = toast.loading("Approbation du profil en cours...", {
        position: "top-left",
      });

      try {
        const result = await livreurService.approveLivreurProfile(userId, {
          note,
        });

        // Recharger le profil pour obtenir le statut mis à jour
        await loadLivreurProfile(userId);

        toast.update(toastId, {
          render: "Profil approuvé avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });

        return result;
      } catch (error: any) {
        console.log("Erreur approbation profil livreur:", error);
        const errorMessage = getFriendlyErrorMessage(error);

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
    [loadLivreurProfile],
  );

  // NOUVEAU : Rejeter le profil
  const rejectLivreurProfile = useCallback(
    async (userId: string, note: string): Promise<{ message: string }> => {
      const toastId = toast.loading("Rejet du profil en cours...", {
        position: "top-left",
      });

      try {
        const result = await livreurService.rejectLivreurProfile(userId, {
          note,
        });

        // Recharger le profil pour obtenir le statut mis à jour
        await loadLivreurProfile(userId);

        toast.update(toastId, {
          render: "Profil rejeté avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });

        return result;
      } catch (error: any) {
        console.log("Erreur rejet profil livreur:", error);
        const errorMessage = getFriendlyErrorMessage(error);

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
    [loadLivreurProfile],
  );

  // Vérifier si l'utilisateur courant est admin ou opérateur
  const isAdmin = currentUser?.role === GrantedRole.Admin;
  const isOperateur = currentUser?.role === GrantedRole.Operateur;
  const canManageLivreur = isAdmin || isOperateur;

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

  // Obtenir le libellé du statut de vérification
  const getVerificationStatusLabel = useCallback(
    (status: LivreurVerificationStatus): string => {
      const labels: Record<LivreurVerificationStatus, string> = {
        [LivreurVerificationStatus.PENDING]: "En attente",
        [LivreurVerificationStatus.APPROVED]: "Approuvé",
        [LivreurVerificationStatus.REJECTED]: "Rejeté",
      };
      return labels[status] || status;
    },
    [],
  );

  const getLivreurs = useCallback(async (): Promise<User[]> => {
    try {
      const allUsers = await userService.getAllUsers();
      return allUsers.filter((user) => user.role === GrantedRole.Livreur);
    } catch (error: any) {
      console.log("Erreur chargement livreurs:", error);
      return [];
    }
  }, []);

  const livreurs = useMemo(() => {
    return users.filter((user) => user.role === GrantedRole.Livreur);
  }, [users]);

  return {
    // State
    users,
    isLoadingUsers,
    selectedUser,
    isAdmin,
    isOperateur,
    canManageLivreur,
    livreurs,

    // NOUVEAU : État livreur
    selectedLivreur,
    livreurProfile,
    isLivreurModalOpen,
    isLoadingLivreurProfile,

    // Actions
    loadUsers,
    openPromotionModal,
    closePromotionModal,
    promoteUser,
    getRoleLabel,
    getGenderLabel,
    getLivreurs,
    getVerificationStatusLabel,

    // NOUVEAU : Actions livreur
    openLivreurProfileModal,
    closeLivreurProfileModal,
    loadLivreurProfile,
    updateLivreurProfile,
    approveLivreurProfile,
    rejectLivreurProfile,
  };
};

// // hooks/use-users-management.ts
// import { useState, useCallback, useMemo } from "react";
// import { toast } from "react-toastify";
// import { useUsersStore } from "@/lib/stores/users-store";
// import { userService } from "@/lib/services/user-service";
// import { GrantedRole } from "@/type/enum";
// import { useAuth } from "@/hooks/use-auth";
// import { User } from "@/type/user.type";

// export const useUsersManagement = () => {
//   const { user: currentUser } = useAuth();
//   const {
//     users,
//     setUsers,
//     selectedUser,
//     setSelectedUser,
//     setLoading,
//     setError,
//     clearError,
//     promoteUser: updateUserInStore,
//   } = useUsersStore();

//   const [isLoadingUsers, setIsLoadingUsers] = useState(false);

//   // Charger les utilisateurs
//   const loadUsers = useCallback(async () => {
//     setIsLoadingUsers(true);
//     clearError();

//     try {
//       const users = await userService.getAllUsers();
//       setUsers(users);
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message ||
//         "Erreur lors du chargement des utilisateurs";
//       setError(errorMessage);
//       toast.error(errorMessage, { position: "top-left" });
//     } finally {
//       setIsLoadingUsers(false);
//     }
//   }, [setUsers, setError, clearError]);

//   // Ouvrir le modal de promotion
//   const openPromotionModal = useCallback(
//     (user: User) => {
//       setSelectedUser(user);
//     },
//     [setSelectedUser]
//   );

//   // Fermer le modal
//   const closePromotionModal = useCallback(() => {
//     setSelectedUser(null);
//   }, [setSelectedUser]);

//   // Promouvoir un utilisateur
//   const promoteUser = useCallback(
//     async (userId: string, role: GrantedRole) => {
//       const toastId = toast.loading("Changement de rôle en cours...", {
//         position: "top-left",
//       });

//       try {
//         const updatedUser = await userService.promoteUser(userId, role);

//         // Mettre à jour le store local
//         updateUserInStore(userId, role);

//         toast.update(toastId, {
//           render: `Rôle mis à jour avec succès !`,
//           type: "success",
//           isLoading: false,
//           autoClose: 5000,
//           closeButton: true,
//         });

//         closePromotionModal();
//         return updatedUser;
//       } catch (error: any) {
//         console.log("Erreur promotion utilisateur:", error);
//         const errorMessage =
//           error.response?.data?.message || "Erreur lors du changement de rôle";

//         toast.update(toastId, {
//           render: errorMessage,
//           type: "error",
//           isLoading: false,
//           autoClose: 7000,
//           closeButton: true,
//         });
//         throw error;
//       }
//     },
//     [updateUserInStore, closePromotionModal]
//   );

//   // Vérifier si l'utilisateur courant est admin
//   const isAdmin = currentUser?.role === GrantedRole.Admin;

//   // Obtenir le libellé du rôle
//   const getRoleLabel = useCallback((role: GrantedRole): string => {
//     const labels: Record<GrantedRole, string> = {
//       [GrantedRole.Admin]: "Administrateur",
//       [GrantedRole.Livreur]: "Livreur",
//       [GrantedRole.Operateur]: "Opérateur",
//       [GrantedRole.Client]: "Client",
//       [GrantedRole.User]: "Utilisateur",
//     };
//     return labels[role] || role;
//   }, []);

//   // Obtenir le libellé du genre
//   const getGenderLabel = useCallback((gender: string): string => {
//     const genders: Record<string, string> = {
//       man: "Homme",
//       women: "Femme",
//       other: "Autre",
//     };
//     return genders[gender] || gender;
//   }, []);

//   const getLivreurs = useCallback(async (): Promise<User[]> => {
//     try {
//       const allUsers = await userService.getAllUsers();
//       return allUsers.filter((user) => user.role === GrantedRole.Livreur);
//     } catch (error: any) {
//       console.log("Erreur chargement livreurs:", error);
//       return [];
//     }
//   }, []);

//   const livreurs = useMemo(() => {
//     return users.filter((user) => user.role === GrantedRole.Livreur);
//   }, [users]);

//   return {
//     // State
//     users,
//     isLoadingUsers,
//     selectedUser,
//     isAdmin,
//     livreurs,

//     // Actions
//     loadUsers,
//     openPromotionModal,
//     closePromotionModal,
//     promoteUser,
//     getRoleLabel,
//     getGenderLabel,
//     getLivreurs,
//   };
// };
