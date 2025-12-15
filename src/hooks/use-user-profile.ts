// hooks/use-user-profile.ts
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/lib/stores/auth-store";
import { userService } from "@/lib/services/user-service";
import { GenderType } from "@/type/enum";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ProfileFormData {
  name: string;
  phoneNumber: string;
  countryCode: string;
  genderrole: GenderType;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useUserProfile = () => {
  const { user, setUser } = useAuthStore();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Formulaires
  const profileForm = useForm<ProfileFormData>();
  const passwordForm = useForm<PasswordFormData>();

  // Mettre à jour les valeurs par défaut quand l'utilisateur change
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        phoneNumber: user.phoneNumber,
        countryCode: user.countryCode,
        genderrole: user.genderrole,
      });
    }
  }, [user, profileForm]);

  // Mettre à jour le profil
  const updateProfile = async (data: ProfileFormData) => {
    if (!user) {
      toast.error("Utilisateur non trouvé");
      return;
    }

    setIsUpdatingProfile(true);
    const toastId = toast.loading("Mise à jour du profil en cours...", {
      position: "top-left",
    });

    try {
      const updatedUser = await userService.updateProfile(user._id, data);

      // Mettre à jour le store
      setUser({
        ...user,
        name: updatedUser.name,
        phoneNumber: updatedUser.phoneNumber,
        countryCode: updatedUser.countryCode,
        genderrole: updatedUser.genderrole,
      });

      toast.update(toastId, {
        render: "Profil mis à jour avec succès !",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });

      return updatedUser;
    } catch (error: any) {
      console.error("Erreur mise à jour profil:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour";

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 7000,
        closeButton: true,
      });
      throw error;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Changer le mot de passe
  const changePassword = async (data: PasswordFormData) => {
    if (!user) {
      toast.error("Utilisateur non trouvé");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsChangingPassword(true);
    const toastId = toast.loading("Changement de mot de passe en cours...", {
      position: "top-left",
    });

    try {
      await userService.changePassword(user._id, {
        password: data.currentPassword,
        newpassword: data.newPassword,
        confirmpassword: data.confirmPassword,
      });

      toast.update(toastId, {
        render: "Mot de passe changé avec succès !",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });

      // Réinitialiser le formulaire
      passwordForm.reset();
    } catch (error: any) {
      console.error("Erreur changement mot de passe:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors du changement de mot de passe";

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 7000,
        closeButton: true,
      });
      throw error;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    user,
    profileForm,
    passwordForm,
    updateProfile,
    changePassword,
    isUpdatingProfile,
    isChangingPassword,
  };
};
