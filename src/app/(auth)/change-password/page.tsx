"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  authService,
  type ResetPasswordData,
} from "@/lib/services/auth-service";
import { LoadingFullPage } from "@/components/Loading";
import { toast } from "react-toastify";

interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();

  const newPassword = watch("newPassword");

  // Vérifier si les paramètres sont présents
  useEffect(() => {
    if (!token || !email) {
      setIsValidLink(false);
      toast.error("Lien de réinitialisation invalide ou expiré.", {
        autoClose: 5000,
      });
    } else {
      setIsValidLink(true);
    }
  }, [token, email]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!token || !email) {
      setError("Lien de réinitialisation invalide.");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const resetData: ResetPasswordData = {
        email: decodeURIComponent(email),
        token,
        newPassword: data.newPassword,
      };

      await authService.resetPassword(resetData);

      // Rediriger vers la page de succès
      router.push("/password-reset-success");
    } catch (error: any) {
      console.error("Reset password error:", error);

      // Afficher un message d'erreur standard
      setError("Une erreur inattendue est survenue. Veuillez réessayer.");

      // Optionnel : Afficher le message d'erreur de l'API si disponible
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, { autoClose: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Si le lien n'est pas valide, afficher un message d'erreur
  if (isValidLink === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.406 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Lien invalide
            </h2>
            <p className="text-gray-600">
              Ce lien de réinitialisation est invalide ou a expiré. Veuillez
              demander un nouveau lien.
            </p>
            <div className="pt-4 space-y-3">
              <Link
                href="/forgot-password"
                className="block w-full bg-[#FD481A] text-white py-3 rounded-lg font-medium hover:bg-[#E63F15] transition-colors"
              >
                Demander un nouveau lien
              </Link>
              <Link
                href="/login"
                className="block text-[#FD481A] hover:underline font-medium text-sm"
              >
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Nouveau mot de passe
          </h1>
          <p className="text-gray-600">
            Créez un nouveau mot de passe pour votre compte.
          </p>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nouveau mot de passe */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all pr-12 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("newPassword", {
                  required: "Le nouveau mot de passe est obligatoire",
                  minLength: {
                    value: 6,
                    message:
                      "Le mot de passe doit contenir au moins 6 caractères",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirmer le mot de passe */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all pr-12 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("confirmPassword", {
                  required: "Veuillez confirmer votre mot de passe",
                  validate: (value) =>
                    value === newPassword ||
                    "Les mots de passe ne correspondent pas",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading && "animate-pulse"
            } w-full bg-[#FD481A] text-white py-3.5 rounded-lg font-medium hover:bg-[#E63F15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm`}
          >
            {isLoading
              ? "Réinitialisation..."
              : "Réinitialiser le mot de passe"}
          </button>

          {/* Retour à la connexion */}
          <div className="text-center pt-4">
            <Link
              href="/login"
              className="text-sm text-[#FD481A] hover:underline font-medium"
            >
              ← Retour à la page de connexion
            </Link>
          </div>
        </form>

        {/* Conseils de sécurité */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Conseils pour un mot de passe sécurisé :
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Utilisez au moins 6 caractères</li>
            <li>• Évitez les mots de passe courants</li>
            <li>• Ne réutilisez pas d'anciens mots de passe</li>
            <li>• Changez régulièrement votre mot de passe</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<LoadingFullPage />}>
      <ChangePasswordContent />
    </Suspense>
  );
}
