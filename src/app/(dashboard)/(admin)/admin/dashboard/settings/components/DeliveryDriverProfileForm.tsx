// components/DeliveryDriverProfileForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { LivreurVerificationStatus } from "@/type/enum";
import { livreurService } from "@/lib/services/livreur-service";

interface DeliveryDriverProfileFormProps {
  userId: string;
  existingData: any;
  onClose: () => void;
  isDisabled?: boolean;
}

interface DriverFormData {
  motoPlateNumber: string;
  motoChassisNumber: string;
  motoBrand: string;
  motoModel: string;
  idType: string;
  idNumber: string;
}

export function DeliveryDriverProfileForm({
  userId,
  existingData,
  onClose,
  isDisabled = false,
}: DeliveryDriverProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const ID_TYPE_OPTIONS = [
    "CIP/CIPR",
    "CNI",
    "Passeport",
    "Permis de conduire",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DriverFormData>({
    defaultValues: {
      motoPlateNumber: existingData?.motoPlateNumber || "",
      motoChassisNumber: existingData?.motoChassisNumber || "",
      motoBrand: existingData?.motoBrand || "",
      motoModel: existingData?.motoModel || "",
      idType: existingData?.idType || "",
      idNumber: existingData?.idNumber || "",
    },
  });

  const onSubmit = async (data: DriverFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await livreurService.updateLivreurProfile(userId, data);

      if (response) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si le formulaire est désactivé (profil approuvé), afficher seulement les informations
  if (isDisabled) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">
              Votre profil a été approuvé. Vous ne pouvez plus modifier ces
              informations.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plaque d'immatriculation
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              {existingData?.motoPlateNumber || "Non renseigné"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de châssis
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              {existingData?.motoChassisNumber || "Non renseigné"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marque de la moto
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              {existingData?.motoBrand || "Non renseigné"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modèle de la moto
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              {existingData?.motoModel || "Non renseigné"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de pièce d'identité
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              {existingData?.idType || "Non renseigné"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de la pièce d'identité
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              {existingData?.idNumber || "Non renseigné"}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">
              Informations soumises avec succès ! Redirection...
            </p>
          </div>
        </div>
      )}

      {/* Avertissement si profil rejeté */}
      {existingData?.verificationStatus ===
        LivreurVerificationStatus.REJECTED && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">
                Votre profil précédent a été rejeté.
              </p>
              {existingData.verificationNote && (
                <p className="mt-1">
                  Note de rejet: {existingData.verificationNote}
                </p>
              )}
              <p className="mt-1">
                Vous pouvez modifier vos informations et les soumettre à
                nouveau.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plaque d'immatriculation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plaque d'immatriculation *
          </label>
          <input
            type="text"
            {...register("motoPlateNumber", {
              required: "La plaque d'immatriculation est requise",
              pattern: {
                value: /^[A-Z0-9\s\-]+$/,
                message: "Format de plaque invalide",
              },
            })}
            disabled={isSubmitting || success}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] disabled:bg-gray-50 disabled:cursor-not-allowed ${
              errors.motoPlateNumber ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="AB-123-CD"
          />
          {errors.motoPlateNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.motoPlateNumber.message}
            </p>
          )}
        </div>

        {/* Numéro de châssis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de châssis *
          </label>
          <input
            type="text"
            {...register("motoChassisNumber", {
              required: "Le numéro de châssis est requis",
              pattern: {
                value: /^[A-Z0-9]+$/,
                message: "Format de châssis invalide",
              },
            })}
            disabled={isSubmitting || success}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] disabled:bg-gray-50 disabled:cursor-not-allowed ${
              errors.motoChassisNumber ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="VF1234567890ABCD"
          />
          {errors.motoChassisNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.motoChassisNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marque de la moto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marque de la moto *
          </label>
          <input
            type="text"
            {...register("motoBrand", {
              required: "La marque est requise",
              minLength: {
                value: 2,
                message: "La marque doit contenir au moins 2 caractères",
              },
            })}
            disabled={isSubmitting || success}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] disabled:bg-gray-50 disabled:cursor-not-allowed ${
              errors.motoBrand ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Yamaha"
          />
          {errors.motoBrand && (
            <p className="mt-1 text-sm text-red-600">
              {errors.motoBrand.message}
            </p>
          )}
        </div>

        {/* Modèle de la moto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modèle de la moto *
          </label>
          <input
            type="text"
            {...register("motoModel", {
              required: "Le modèle est requis",
              minLength: {
                value: 2,
                message: "Le modèle doit contenir au moins 2 caractères",
              },
            })}
            disabled={isSubmitting || success}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] disabled:bg-gray-50 disabled:cursor-not-allowed ${
              errors.motoModel ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="MT-07"
          />
          {errors.motoModel && (
            <p className="mt-1 text-sm text-red-600">
              {errors.motoModel.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type de pièce d'identité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de pièce d'identité *
          </label>
          <select
            {...register("idType", {
              required: "Le type de pièce d'identité est requis",
            })}
            disabled={isSubmitting || success}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] disabled:bg-gray-50 disabled:cursor-not-allowed ${
              errors.idType ? "border-red-300" : "border-gray-300"
            }`}
          >
            {ID_TYPE_OPTIONS.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.idType && (
            <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
          )}
        </div>

        {/* Numéro de la pièce d'identité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de la pièce d'identité *
          </label>
          <input
            type="text"
            {...register("idNumber", {
              required: "Le numéro de la pièce d'identité est requis",
              minLength: {
                value: 3,
                message: "Le numéro doit contenir au moins 3 caractères",
              },
            })}
            disabled={isSubmitting || success}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] disabled:bg-gray-50 disabled:cursor-not-allowed ${
              errors.idNumber ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="AB123456"
          />
          {errors.idNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.idNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting || success}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="cursor-pointer px-6 py-3 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Soumission...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Soumis
            </>
          ) : (
            "Soumettre les informations"
          )}
        </button>
      </div>
    </form>
  );
}
