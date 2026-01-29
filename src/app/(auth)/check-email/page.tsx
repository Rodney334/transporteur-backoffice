"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  authService,
  type ResendVerificationData,
} from "@/lib/services/auth-service";
import { LoadingFullPage } from "@/components/Loading";
import { toast } from "react-toastify";

function CheckEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState<string>(searchParams.get("email") || "");
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [resendCount, setResendCount] = useState<number>(0);
  const MAX_RESEND_ATTEMPTS = 3;
  const COOLDOWN_DURATION = 60; // 60 secondes

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Aucun email disponible pour renvoyer la vérification.");
      return;
    }

    if (resendCount >= MAX_RESEND_ATTEMPTS) {
      toast.error(
        `Vous avez atteint la limite de ${MAX_RESEND_ATTEMPTS} tentatives. Veuillez patienter.`,
      );
      return;
    }

    if (resendCooldown > 0) {
      toast.error(
        `Veuillez patienter ${resendCooldown} secondes avant de réessayer.`,
      );
      return;
    }

    setIsResending(true);
    try {
      const data: ResendVerificationData = { email };
      await authService.resendVerificationEmail(data);

      setResendCount((prev) => prev + 1);

      // Appliquer un cooldown si on approche de la limite
      if (resendCount + 1 >= MAX_RESEND_ATTEMPTS) {
        setResendCooldown(COOLDOWN_DURATION * 2); // Double cooldown pour la dernière tentative
      } else if (resendCount > 0) {
        setResendCooldown(COOLDOWN_DURATION);
      }

      toast.success("Un nouvel email de vérification a été envoyé !", {
        autoClose: 5000,
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        toast.error("Aucun compte trouvé avec cet email.");
      } else if (error.response?.status === 409) {
        toast.error("Cet email a déjà été vérifié.");
      } else {
        toast.error(
          "Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer.",
        );
      }
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Vérifiez votre email
          </h1>
          <p className="text-gray-600">
            Presque terminé ! Un email de confirmation vous a été envoyé.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-[#FD481A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Consultez votre boîte mail
            </h2>
            <p className="text-gray-600">
              Nous avons envoyé un lien de confirmation à{" "}
              <span className="font-medium text-[#131313]">
                {email || "votre adresse email"}
              </span>
            </p>
            <p className="text-gray-600 text-sm">
              Cliquez sur le lien dans l'email pour activer votre compte.
              Vérifiez également vos spams au cas où.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <div className="space-y-2">
              <button
                onClick={handleResendEmail}
                disabled={isResending || resendCooldown > 0}
                className={`w-full ${
                  resendCount >= MAX_RESEND_ATTEMPTS
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  isResending && "animate-pulse"
                }`}
              >
                {isResending
                  ? "Envoi en cours..."
                  : resendCooldown > 0
                    ? `Réessayer dans ${formatTime(resendCooldown)}`
                    : resendCount >= MAX_RESEND_ATTEMPTS
                      ? "Limite de tentatives atteinte"
                      : "Renvoyer l'email de confirmation"}
              </button>

              {resendCount > 0 && (
                <p className="text-xs text-gray-500">
                  Tentatives : {resendCount}/{MAX_RESEND_ATTEMPTS}
                  {resendCount >= MAX_RESEND_ATTEMPTS && (
                    <span className="block text-red-500 mt-1">
                      Veuillez patienter avant de réessayer.
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm mb-3">
                Vous avez déjà vérifié votre email ?
              </p>
              <Link
                href="/login"
                className="block w-full border-2 border-[#FD481A] text-[#FD481A] py-3 rounded-lg font-medium hover:bg-[#FD481A] hover:text-white transition-colors"
              >
                Retour à la page de connexion
              </Link>
            </div>
          </div>

          <div className="pt-6">
            <p className="text-gray-500 text-xs">
              Vous n'avez pas reçu l'email ? Attendez quelques minutes ou
              vérifiez que l'adresse email est correcte.
              <br />
              <span className="font-medium">
                Email utilisé : {email || "Non spécifié"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<LoadingFullPage />}>
      <CheckEmailContent />
    </Suspense>
  );
}
