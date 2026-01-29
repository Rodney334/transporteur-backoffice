// app/(dashboard)/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Globe,
  User,
  Lock,
  Calendar,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { GenderType, GrantedRole } from "@/type/enum";
import { useAuthStore } from "@/lib/stores/auth-store";
import { SimpleNotificationToggle } from "@/components/SimpleNotificationToggle";
import { DeliveryDriverProfileForm } from "./components/DeliveryDriverProfileForm";
import { LivreurVerificationStatus } from "@/type/enum";
import { livreurService } from "@/lib/services/livreur-service";

// Liste des codes pays (vous pouvez l'étendre)
const COUNTRY_CODES = [
  { code: "+229", name: "Bénin" },
  { code: "+33", name: "France" },
  { code: "+41", name: "Suisse" },
  { code: "+32", name: "Belgique" },
  { code: "+1", name: "États-Unis/Canada" },
  { code: "+44", name: "Royaume-Uni" },
  { code: "+49", name: "Allemagne" },
  { code: "+34", name: "Espagne" },
  { code: "+39", name: "Italie" },
  { code: "+237", name: "Cameroun" },
  { code: "+225", name: "Côte d'Ivoire" },
  { code: "+221", name: "Sénégal" },
];

interface DriverProfileData {
  _id: string;
  userId: string;
  motoPlateNumber?: string;
  motoChassisNumber?: string;
  motoBrand?: string;
  motoModel?: string;
  ifuNumber?: string;
  idType?: string;
  idNumber?: string;
  verificationStatus: LivreurVerificationStatus;
  verificationNote?: string | null;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Mes informations");
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverProfile, setDriverProfile] = useState<DriverProfileData | null>(
    null,
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const {
    user,
    profileForm,
    passwordForm,
    updateProfile,
    changePassword,
    isUpdatingProfile,
    isChangingPassword,
  } = useUserProfile();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = profileForm;

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
  } = passwordForm;

  const tabs = [
    "Mes informations",
    "Profil",
    "Mot de passe",
    "Notifications web",
  ];

  // Vérifier si l'utilisateur est un livreur
  const isDeliveryDriver = user?.role === GrantedRole.Livreur;

  // Charger le profil livreur si l'utilisateur est un livreur
  useEffect(() => {
    if (isDeliveryDriver && user?._id) {
      fetchDriverProfile();
    }
  }, [isDeliveryDriver, user?._id]);

  const fetchDriverProfile = async () => {
    if (!user?._id) return;

    setIsLoadingProfile(true);
    try {
      const response = await livreurService.getLivreurProfile(user._id);
      if (response) {
        const data = response;
        setDriverProfile(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil livreur:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Formatage de la date de création
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Traduction du rôle
  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      Admin: "Administrateur",
      Client: "Client",
      Livreur: "Livreur",
      Operateur: "Opérateur",
    };
    return roles[role] || role;
  };

  // Traduction du genre
  const getGenderLabel = (gender: GenderType) => {
    const genders: Record<GenderType, string> = {
      [GenderType.Man]: "Homme",
      [GenderType.Women]: "Femme",
      [GenderType.Other]: "Autre",
    };
    return genders[gender] || gender;
  };

  // Traduction du statut de vérification
  const getVerificationStatusLabel = (status: LivreurVerificationStatus) => {
    const statusLabels: Record<LivreurVerificationStatus, string> = {
      [LivreurVerificationStatus.PENDING]: "En attente",
      [LivreurVerificationStatus.APPROVED]: "Approuvé",
      [LivreurVerificationStatus.REJECTED]: "Rejeté",
    };
    return statusLabels[status] || status;
  };

  // Si pas d'utilisateur, afficher un état de chargement
  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A] mx-auto"></div>
            <p className="mt-4 text-gray-500">Chargement des informations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div>
          {/* Onglet "Mes informations" - Lecture seule */}
          {activeTab === "Mes informations" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Mes informations
                </h2>
                <p className="text-sm text-gray-500">
                  Consultez vos informations personnelles.
                </p>
              </div>

              <div className="space-y-6">
                {/* Nom complet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={user.name}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={user.email}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={`${user.countryCode} ${user.phoneNumber}`}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={getGenderLabel(user.genderrole)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Rôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={getRoleLabel(user.role)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Date de création */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membre depuis
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formatDate(user.createdAt)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Statut de vérification du livreur */}
                {isDeliveryDriver && driverProfile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut de vérification
                    </label>
                    <div className="flex items-center gap-2">
                      {driverProfile.verificationStatus ===
                      LivreurVerificationStatus.APPROVED ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : driverProfile.verificationStatus ===
                        LivreurVerificationStatus.REJECTED ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          driverProfile.verificationStatus ===
                          LivreurVerificationStatus.APPROVED
                            ? "text-green-600"
                            : driverProfile.verificationStatus ===
                                LivreurVerificationStatus.REJECTED
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {getVerificationStatusLabel(
                          driverProfile.verificationStatus,
                        )}
                      </span>
                    </div>
                    {driverProfile.verificationNote &&
                      driverProfile.verificationStatus ===
                        LivreurVerificationStatus.REJECTED && (
                        <p className="mt-2 text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                          Note: {driverProfile.verificationNote}
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet "Profil" - Formulaire d'édition */}
          {activeTab === "Profil" && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Profil
                  </h2>
                  <p className="text-sm text-gray-500">
                    Mettez à jour vos informations personnelles ici.
                  </p>
                </div>

                {/* Bouton pour ouvrir le modal des informations du livreur */}
                {isDeliveryDriver && (
                  <button
                    type="button"
                    onClick={() => setShowDriverModal(true)}
                    disabled={
                      driverProfile?.verificationStatus ===
                      LivreurVerificationStatus.APPROVED
                    }
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-4 h-4" />
                    {driverProfile
                      ? "Modifier informations"
                      : "Soumettre informations"}
                  </button>
                )}
              </div>

              {/* Avertissement si profil approuvé */}
              {isDeliveryDriver &&
                driverProfile?.verificationStatus ===
                  LivreurVerificationStatus.APPROVED && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-800">
                        Votre profil livreur a été approuvé. Vous ne pouvez plus
                        modifier ces informations.
                      </p>
                    </div>
                  </div>
                )}

              {/* Avertissement si profil en attente */}
              {isDeliveryDriver &&
                driverProfile?.verificationStatus ===
                  LivreurVerificationStatus.PENDING && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        Votre profil est en cours de vérification par
                        l'administration.
                      </p>
                    </div>
                  </div>
                )}

              {/* Avertissement si profil rejeté */}
              {isDeliveryDriver &&
                driverProfile?.verificationStatus ===
                  LivreurVerificationStatus.REJECTED && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium">
                          Votre profil a été rejeté.
                        </p>
                        {driverProfile.verificationNote && (
                          <p className="mt-1">
                            Raison: {driverProfile.verificationNote}
                          </p>
                        )}
                        <p className="mt-1">
                          Vous pouvez modifier vos informations et les soumettre
                          à nouveau.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              <form onSubmit={handleSubmitProfile(updateProfile)}>
                <div className="space-y-6">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        {...registerProfile("name", {
                          required: "Le nom est requis",
                          minLength: {
                            value: 2,
                            message:
                              "Le nom doit contenir au moins 2 caractères",
                          },
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                          profileErrors.name
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Code pays et téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code pays
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <select
                          {...registerProfile("countryCode", {
                            required: "Le code pays est requis",
                          })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] appearance-none bg-white ${
                            profileErrors.countryCode
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Sélectionnez un code pays</option>
                          {COUNTRY_CODES.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      {profileErrors.countryCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.countryCode.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          {...registerProfile("phoneNumber", {
                            required: "Le numéro de téléphone est requis",
                            pattern: {
                              value: /^[0-9\s\-\(\)]+$/,
                              message: "Numéro de téléphone invalide",
                            },
                          })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                            profileErrors.phoneNumber
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {profileErrors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genre
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                      <select
                        {...registerProfile("genderrole", {
                          required: "Le genre est requis",
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] appearance-none bg-white ${
                          profileErrors.genderrole
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value={GenderType.Man}>Homme</option>
                        <option value={GenderType.Women}>Femme</option>
                        <option value={GenderType.Other}>Autre</option>
                      </select>
                    </div>
                    {profileErrors.genderrole && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.genderrole.message}
                      </p>
                    )}
                  </div>

                  {/* Bouton de soumission */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="cursor-pointer px-6 py-3 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingProfile
                        ? "Mise à jour..."
                        : "Enregistrer les modifications"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Onglet "Mot de passe" */}
          {activeTab === "Mot de passe" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Mot de passe
                </h2>
                <p className="text-sm text-gray-500">
                  Changez votre mot de passe ici.
                </p>
              </div>

              <form onSubmit={handleSubmitPassword(changePassword)}>
                <div className="space-y-6">
                  {/* Mot de passe actuel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        {...registerPassword("currentPassword", {
                          required: "Le mot de passe actuel est requis",
                          minLength: {
                            value: 6,
                            message:
                              "Le mot de passe doit contenir au moins 6 caractères",
                          },
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                          passwordErrors.currentPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Nouveau mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        {...registerPassword("newPassword", {
                          required: "Le nouveau mot de passe est requis",
                          minLength: {
                            value: 6,
                            message:
                              "Le mot de passe doit contenir au moins 6 caractères",
                          },
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                          passwordErrors.newPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirmation du mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        {...registerPassword("confirmPassword", {
                          required:
                            "La confirmation du mot de passe est requise",
                          validate: (value) =>
                            value === watch("newPassword") ||
                            "Les mots de passe ne correspondent pas",
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                          passwordErrors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Bouton de soumission */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="cursor-pointer px-6 py-3 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isChangingPassword
                        ? "Changement..."
                        : "Changer le mot de passe"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Onglet Notifications web */}
          {activeTab === "Notifications web" && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Notifications Web</h3>
                <p className="text-sm text-gray-500">
                  Recevez des notifications même quand l'application n'est pas
                  ouverte
                </p>
              </div>
              <SimpleNotificationToggle />
            </div>
          )}
        </div>
      </div>

      {/* Modal pour le formulaire du livreur */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Informations du livreur
                </h3>
                <button
                  onClick={() => setShowDriverModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <DeliveryDriverProfileForm
                userId={user._id}
                existingData={driverProfile}
                onClose={() => {
                  setShowDriverModal(false);
                  fetchDriverProfile(); // Rafraîchir les données après soumission
                }}
                isDisabled={
                  driverProfile?.verificationStatus ===
                  LivreurVerificationStatus.APPROVED
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// // app/(dashboard)/page.tsx
// "use client";

// import { useState } from "react";
// import { Mail, Phone, Globe, User, Lock, Calendar } from "lucide-react";
// import { useUserProfile } from "@/hooks/use-user-profile";
// import { GenderType } from "@/type/enum";
// import { useAuthStore } from "@/lib/stores/auth-store";
// import { SimpleNotificationToggle } from "@/components/SimpleNotificationToggle";

// // Liste des codes pays (vous pouvez l'étendre)
// const COUNTRY_CODES = [
//   { code: "+229", name: "Bénin" },
//   { code: "+33", name: "France" },
//   { code: "+41", name: "Suisse" },
//   { code: "+32", name: "Belgique" },
//   { code: "+1", name: "États-Unis/Canada" },
//   { code: "+44", name: "Royaume-Uni" },
//   { code: "+49", name: "Allemagne" },
//   { code: "+34", name: "Espagne" },
//   { code: "+39", name: "Italie" },
//   { code: "+237", name: "Cameroun" },
//   { code: "+225", name: "Côte d'Ivoire" },
//   { code: "+221", name: "Sénégal" },
// ];

// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState("Mes informations");
//   const {
//     user,
//     profileForm,
//     passwordForm,
//     updateProfile,
//     changePassword,
//     isUpdatingProfile,
//     isChangingPassword,
//   } = useUserProfile();

//   const {
//     register: registerProfile,
//     handleSubmit: handleSubmitProfile,
//     formState: { errors: profileErrors },
//   } = profileForm;

//   const {
//     register: registerPassword,
//     handleSubmit: handleSubmitPassword,
//     formState: { errors: passwordErrors },
//     watch,
//   } = passwordForm;

//   const tabs = [
//     "Mes informations",
//     "Profil",
//     "Mot de passe",
//     "Notifications web",
//   ];

//   // Formatage de la date de création
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("fr-FR", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   // Traduction du rôle
//   const getRoleLabel = (role: string) => {
//     const roles: Record<string, string> = {
//       Admin: "Administrateur",
//       Client: "Client",
//       Livreur: "Livreur",
//       Operateur: "Opérateur",
//     };
//     return roles[role] || role;
//   };

//   // Traduction du genre
//   const getGenderLabel = (gender: GenderType) => {
//     const genders: Record<GenderType, string> = {
//       [GenderType.Man]: "Homme",
//       [GenderType.Women]: "Femme",
//       [GenderType.Other]: "Autre",
//     };
//     return genders[gender] || gender;
//   };

//   // Si pas d'utilisateur, afficher un état de chargement
//   if (!user) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm p-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A] mx-auto"></div>
//             <p className="mt-4 text-gray-500">Chargement des informations...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-8">
//       {/* Header */}
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

//       {/* Tabs */}
//       <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`cursor-pointer pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
//               activeTab === tab
//                 ? "text-gray-900"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             {tab}
//             {activeTab === tab && (
//               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Contenu des onglets */}
//       <div>
//         {/* Onglet "Mes informations" - Lecture seule */}
//         {activeTab === "Mes informations" && (
//           <div className="space-y-6">
//             <div className="mb-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-2">
//                 Mes informations
//               </h2>
//               <p className="text-sm text-gray-500">
//                 Consultez vos informations personnelles.
//               </p>
//             </div>

//             <div className="space-y-6">
//               {/* Nom complet */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Nom complet
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={user.name}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
//                     readOnly
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Adresse email
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="email"
//                     value={user.email}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
//                     readOnly
//                   />
//                 </div>
//               </div>

//               {/* Téléphone */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Numéro de téléphone
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={`${user.countryCode} ${user.phoneNumber}`}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
//                     readOnly
//                   />
//                 </div>
//               </div>

//               {/* Genre */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Genre
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={getGenderLabel(user.genderrole)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
//                     readOnly
//                   />
//                 </div>
//               </div>

//               {/* Rôle */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Rôle
//                 </label>
//                 <div className="relative">
//                   <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={getRoleLabel(user.role)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
//                     readOnly
//                   />
//                 </div>
//               </div>

//               {/* Date de création */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Membre depuis
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={formatDate(user.createdAt)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
//                     readOnly
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Onglet "Profil" - Formulaire d'édition */}
//         {activeTab === "Profil" && (
//           <div>
//             <div className="mb-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-2">Profil</h2>
//               <p className="text-sm text-gray-500">
//                 Mettez à jour vos informations personnelles ici.
//               </p>
//             </div>

//             <form onSubmit={handleSubmitProfile(updateProfile)}>
//               <div className="space-y-6">
//                 {/* Nom */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Nom complet
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       {...registerProfile("name", {
//                         required: "Le nom est requis",
//                         minLength: {
//                           value: 2,
//                           message: "Le nom doit contenir au moins 2 caractères",
//                         },
//                       })}
//                       className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
//                         profileErrors.name
//                           ? "border-red-300"
//                           : "border-gray-300"
//                       }`}
//                     />
//                   </div>
//                   {profileErrors.name && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {profileErrors.name.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Code pays et téléphone */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Code pays
//                     </label>
//                     <div className="relative">
//                       <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
//                       <select
//                         {...registerProfile("countryCode", {
//                           required: "Le code pays est requis",
//                         })}
//                         className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] appearance-none bg-white ${
//                           profileErrors.countryCode
//                             ? "border-red-300"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         <option value="">Sélectionnez un code pays</option>
//                         {COUNTRY_CODES.map((country) => (
//                           <option key={country.code} value={country.code}>
//                             {country.name} ({country.code})
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     {profileErrors.countryCode && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {profileErrors.countryCode.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Numéro de téléphone
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         type="tel"
//                         {...registerProfile("phoneNumber", {
//                           required: "Le numéro de téléphone est requis",
//                           pattern: {
//                             value: /^[0-9\s\-\(\)]+$/,
//                             message: "Numéro de téléphone invalide",
//                           },
//                         })}
//                         className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
//                           profileErrors.phoneNumber
//                             ? "border-red-300"
//                             : "border-gray-300"
//                         }`}
//                       />
//                     </div>
//                     {profileErrors.phoneNumber && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {profileErrors.phoneNumber.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Genre */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Genre
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
//                     <select
//                       {...registerProfile("genderrole", {
//                         required: "Le genre est requis",
//                       })}
//                       className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] appearance-none bg-white ${
//                         profileErrors.genderrole
//                           ? "border-red-300"
//                           : "border-gray-300"
//                       }`}
//                     >
//                       <option value={GenderType.Man}>Homme</option>
//                       <option value={GenderType.Women}>Femme</option>
//                       <option value={GenderType.Other}>Autre</option>
//                     </select>
//                   </div>
//                   {profileErrors.genderrole && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {profileErrors.genderrole.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Bouton de soumission */}
//                 <div className="pt-6 border-t border-gray-200">
//                   <button
//                     type="submit"
//                     disabled={isUpdatingProfile}
//                     className="cursor-pointer px-6 py-3 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isUpdatingProfile
//                       ? "Mise à jour..."
//                       : "Enregistrer les modifications"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Onglet "Mot de passe" */}
//         {activeTab === "Mot de passe" && (
//           <div>
//             <div className="mb-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-2">
//                 Mot de passe
//               </h2>
//               <p className="text-sm text-gray-500">
//                 Changez votre mot de passe ici.
//               </p>
//             </div>

//             <form onSubmit={handleSubmitPassword(changePassword)}>
//               <div className="space-y-6">
//                 {/* Mot de passe actuel */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Mot de passe actuel
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="password"
//                       {...registerPassword("currentPassword", {
//                         required: "Le mot de passe actuel est requis",
//                         minLength: {
//                           value: 6,
//                           message:
//                             "Le mot de passe doit contenir au moins 6 caractères",
//                         },
//                       })}
//                       className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
//                         passwordErrors.currentPassword
//                           ? "border-red-300"
//                           : "border-gray-300"
//                       }`}
//                     />
//                   </div>
//                   {passwordErrors.currentPassword && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {passwordErrors.currentPassword.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Nouveau mot de passe */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Nouveau mot de passe
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="password"
//                       {...registerPassword("newPassword", {
//                         required: "Le nouveau mot de passe est requis",
//                         minLength: {
//                           value: 6,
//                           message:
//                             "Le mot de passe doit contenir au moins 6 caractères",
//                         },
//                       })}
//                       className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
//                         passwordErrors.newPassword
//                           ? "border-red-300"
//                           : "border-gray-300"
//                       }`}
//                     />
//                   </div>
//                   {passwordErrors.newPassword && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {passwordErrors.newPassword.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Confirmation du mot de passe */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirmer le nouveau mot de passe
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="password"
//                       {...registerPassword("confirmPassword", {
//                         required: "La confirmation du mot de passe est requise",
//                         validate: (value) =>
//                           value === watch("newPassword") ||
//                           "Les mots de passe ne correspondent pas",
//                       })}
//                       className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
//                         passwordErrors.confirmPassword
//                           ? "border-red-300"
//                           : "border-gray-300"
//                       }`}
//                     />
//                   </div>
//                   {passwordErrors.confirmPassword && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {passwordErrors.confirmPassword.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Bouton de soumission */}
//                 <div className="pt-6 border-t border-gray-200">
//                   <button
//                     type="submit"
//                     disabled={isChangingPassword}
//                     className="cursor-pointer px-6 py-3 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isChangingPassword
//                       ? "Changement..."
//                       : "Changer le mot de passe"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Onglet Notifications web */}
//         {activeTab === "Notifications web" && (
//           <div className="flex items-center justify-between p-4 border rounded-lg">
//             <div>
//               <h3 className="font-medium">Notifications Web</h3>
//               <p className="text-sm text-gray-500">
//                 Recevez des notifications même quand l'application n'est pas
//                 ouverte
//               </p>
//             </div>
//             <SimpleNotificationToggle />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
