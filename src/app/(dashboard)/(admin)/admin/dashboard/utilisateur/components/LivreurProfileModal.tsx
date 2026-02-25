// app/(dashboard)/utilisateur/components/LivreurProfileModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Motorbike, X, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUsersManagement } from "@/hooks/use-users-management";
import type { UpdateLivreurProfileData } from "@/type/livreur.type";

// Options pour les selects
const ID_TYPE_OPTIONS = ["CIP/CIPR", "CNI", "Passeport", "Permis de conduire"];

interface LivreurProfileFormData {
  motoPlateNumber: string;
  motoChassisNumber: string;
  motoBrand: string;
  motoModel: string;
  ifuNumber: string;
  idType: string;
  idNumber: string;
}

export default function LivreurProfileModal() {
  const {
    selectedLivreur,
    livreurProfile,
    isLivreurModalOpen,
    closeLivreurProfileModal,
    updateLivreurProfile,
    approveLivreurProfile,
    rejectLivreurProfile,
    loadLivreurProfile,
    isLoadingLivreurProfile,
    getVerificationStatusLabel,
  } = useUsersManagement();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<LivreurProfileFormData | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LivreurProfileFormData>({
    defaultValues: {
      motoPlateNumber: "",
      motoChassisNumber: "",
      motoBrand: "",
      motoModel: "",
      ifuNumber: "",
      idType: "",
      idNumber: "",
    },
  });

  // Surveiller les changements
  const formValues = watch();

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (livreurProfile && isLivreurModalOpen) {
      const initialFormData = {
        motoPlateNumber: livreurProfile.motoPlateNumber || "",
        motoChassisNumber: livreurProfile.motoChassisNumber || "",
        motoBrand: livreurProfile.motoBrand || "",
        motoModel: livreurProfile.motoModel || "",
        ifuNumber: livreurProfile.ifuNumber || "",
        idType: livreurProfile.idType || "",
        idNumber: livreurProfile.idNumber || "",
      };

      reset(initialFormData);
      setInitialData(initialFormData);
      setHasChanges(false);
      setRejectNote("");
    } else if (isLivreurModalOpen && !livreurProfile) {
      // Pas de données existantes
      reset({
        motoPlateNumber: "",
        motoChassisNumber: "",
        motoBrand: "",
        motoModel: "",
        ifuNumber: "",
        idType: "",
        idNumber: "",
      });
      setInitialData(null);
      setHasChanges(false);
      setRejectNote("");
    }
  }, [livreurProfile, isLivreurModalOpen, reset]);

  // Vérifier les changements
  useEffect(() => {
    if (initialData && formValues) {
      const hasFormChanged = Object.keys(formValues).some(
        (key) =>
          formValues[key as keyof LivreurProfileFormData] !==
          initialData[key as keyof LivreurProfileFormData],
      );
      setHasChanges(hasFormChanged);
    } else if (!initialData && formValues) {
      // Pas de données initiales, vérifier si au moins un champ est rempli
      const hasAnyValue = Object.values(formValues).some(
        (value) => value.trim() !== "",
      );
      setHasChanges(hasAnyValue);
    }
  }, [formValues, initialData]);

  // Vérifier si au moins un champ est rempli
  const hasAtLeastOneField = () => {
    return Object.values(formValues).some((value) => value.trim() !== "");
  };

  const handleClose = () => {
    if (!isSubmitting && !isApproving && !isRejecting) {
      closeLivreurProfileModal();
      setRejectNote("");
    }
  };

  const handleSaveAndApprove = async (data: LivreurProfileFormData) => {
    if (!selectedLivreur) return;

    setIsSubmitting(true);
    try {
      // 1. Mettre à jour le profil
      const updateData: UpdateLivreurProfileData = {
        motoPlateNumber: data.motoPlateNumber.trim() || undefined,
        motoChassisNumber: data.motoChassisNumber.trim() || undefined,
        motoBrand: data.motoBrand.trim() || undefined,
        motoModel: data.motoModel.trim() || undefined,
        ifuNumber: data.ifuNumber.trim() || undefined,
        idType: data.idType.trim() || undefined,
        idNumber: data.idNumber.trim() || undefined,
      };

      await updateLivreurProfile(selectedLivreur._id, updateData);

      // 2. Approuver le profil
      await approveLivreurProfile(selectedLivreur._id);

      // 3. Fermer le modal
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde et approbation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedLivreur) return;

    setIsApproving(true);
    try {
      await approveLivreurProfile(selectedLivreur._id);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedLivreur || !rejectNote.trim()) {
      toast.error("Veuillez saisir une note de rejet", {
        position: "top-left",
      });
      return;
    }

    setIsRejecting(true);
    try {
      await rejectLivreurProfile(selectedLivreur._id, rejectNote);
      handleClose();
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  // Déterminer quels boutons afficher
  const showApproveRejectButtons = livreurProfile && !hasChanges;
  const showSaveButton = !livreurProfile || hasChanges;

  if (!isLivreurModalOpen || !selectedLivreur) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* En-tête fixe */}
        <div className="p-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Motorbike className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Profil Livreur
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedLivreur.name} • {selectedLivreur.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors"
              disabled={isSubmitting || isApproving || isRejecting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Chargement */}
            {isLoadingLivreurProfile ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Chargement du profil...
                </span>
              </div>
            ) : (
              <>
                {/* Statut actuel */}
                {livreurProfile && (
                  <div
                    className={`p-2 rounded-lg ${
                      livreurProfile.verificationStatus === "APPROVED"
                        ? "bg-green-50 border border-green-200"
                        : livreurProfile.verificationStatus === "REJECTED"
                          ? "bg-red-50 border border-red-200"
                          : "bg-yellow-50 border border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          livreurProfile.verificationStatus === "APPROVED"
                            ? "bg-green-100 text-green-600"
                            : livreurProfile.verificationStatus === "REJECTED"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {livreurProfile.verificationStatus === "APPROVED" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : livreurProfile.verificationStatus === "REJECTED" ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">!</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Statut:{" "}
                          {getVerificationStatusLabel(
                            livreurProfile.verificationStatus,
                          )}
                        </p>
                        {livreurProfile.verificationNote && (
                          <p className="text-sm text-gray-600 mt-1">
                            Note: {livreurProfile.verificationNote}
                          </p>
                        )}
                        {livreurProfile.verifiedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Le{" "}
                            {new Date(
                              livreurProfile.verifiedAt,
                            ).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Formulaire */}
                <form
                  onSubmit={handleSubmit(handleSaveAndApprove)}
                  className="space-y-4"
                >
                  {/* Informations de la moto */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Informations de la moto
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plaque d'immatriculation
                        </label>
                        <input
                          type="text"
                          placeholder="AB-1234-CD"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...register("motoPlateNumber")}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Marque
                          </label>
                          <input
                            type="text"
                            placeholder="Honda, Haojue..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("motoBrand")}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Modèle
                          </label>
                          <input
                            type="text"
                            placeholder="Click 125"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("motoModel")}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro de chassis
                        </label>
                        <input
                          type="text"
                          placeholder="VIN-CHASSIS-123456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...register("motoChassisNumber")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informations personnelles */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Informations personnelles
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro IFU
                        </label>
                        <input
                          type="text"
                          placeholder="IFU-123456789"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...register("ifuNumber")}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pièce d'identité
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("idType")}
                          >
                            <option value="">Sélectionnez</option>
                            {ID_TYPE_OPTIONS.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Numéro de pièce
                          </label>
                          <input
                            type="text"
                            placeholder="P12345678"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("idNumber")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Note de rejet (seulement visible quand on peut approuver/rejeter) */}
                  {showApproveRejectButtons && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note de rejet (obligatoire pour rejeter)
                      </label>
                      <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="Raison du rejet..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={showApproveRejectButtons}
                      />
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>

        {/* Pied de page fixe */}
        <div className="p-3 border-t border-gray-200 shrink-0">
          {isLoadingLivreurProfile ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : showApproveRejectButtons ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReject}
                disabled={isRejecting || isApproving || !rejectNote.trim()}
                className="cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Rejet en cours...
                  </span>
                ) : (
                  "Rejeter le profil"
                )}
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Approbation en cours...
                  </span>
                ) : (
                  "Approuver le profil"
                )}
              </button>
            </div>
          ) : showSaveButton ? (
            <button
              type="button"
              onClick={handleSubmit(handleSaveAndApprove)}
              disabled={isSubmitting || !hasAtLeastOneField()}
              className="cursor-pointer w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sauvegarde en cours...
                </span>
              ) : (
                "Sauvegarder et approuver le profil"
              )}
            </button>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">
                Aucune modification détectée. Les boutons d'approbation/rejet
                sont disponibles.
              </p>
            </div>
          )}

          {/* Message d'information */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 text-center">
              {showApproveRejectButtons
                ? "Aucune modification détectée. Vous pouvez approuver ou rejeter le profil."
                : showSaveButton
                  ? "Au moins un champ doit être rempli pour sauvegarder."
                  : "Veuillez remplir les informations du livreur."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
