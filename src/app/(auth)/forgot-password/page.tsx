"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  authService,
  type ForgotPasswordData,
} from "@/lib/services/auth-service";
import { LoadingFullPage } from "@/components/Loading";
import { toast } from "react-toastify";

function ForgotPasswordContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>();

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    setError("");

    try {
      await authService.forgotPassword(data);

      // Rediriger vers la page de succès avec l'email en paramètre
      router.push(
        `/forgot-password/success?email=${encodeURIComponent(data.email)}`,
      );
    } catch (error: any) {
      console.error("Forgot password error:", error);

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

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Mot de passe oublié ?
        </h1>
        <p className="text-gray-600">
          Entrez votre adresse email pour réinitialiser votre mot de passe.
        </p>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="uistore@gmail.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", {
              required: "L'email est obligatoire",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Adresse email invalide",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
            ? "Envoi en cours..."
            : "Envoyer le lien de réinitialisation"}
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

      {/* Information supplémentaire */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-700">Note :</span> Vous
          recevrez un email contenant un lien pour réinitialiser votre mot de
          passe. Ce lien a une durée limitée.
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingFullPage />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
