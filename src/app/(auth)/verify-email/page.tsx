"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService, type VerifyEmailData } from "@/lib/services/auth-service";
import { LoadingFullPage } from "@/components/Loading";
import { toast } from "react-toastify";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "error" | "loading"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setVerificationStatus("error");
        setErrorMessage("Lien de vérification invalide ou expiré.");
        setIsVerifying(false);
        return;
      }

      try {
        const data: VerifyEmailData = {
          email: decodeURIComponent(email),
          token,
        };

        await authService.verifyEmail(data);

        setVerificationStatus("success");
        toast.success("Email vérifié avec succès !", {
          autoClose: 3000,
        });

        // Redirection vers la page de succès avec l'email en paramètre
        setTimeout(() => {
          router.push(`/verification-success?email=${email}`);
        }, 2000);
      } catch (error: any) {
        setVerificationStatus("error");
        if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else if (error.response?.status === 400) {
          setErrorMessage("Lien de vérification invalide ou expiré.");
        } else if (error.response?.status === 409) {
          setErrorMessage("Cet email a déjà été vérifié.");
        } else if (error.response?.status === 410) {
          setErrorMessage("Ce lien de vérification a expiré.");
        } else if (error.message?.includes("timeout")) {
          setErrorMessage(
            "La requête a pris trop de temps. Veuillez réessayer.",
          );
        } else {
          setErrorMessage(
            "Une erreur est survenue lors de la vérification. Veuillez réessayer.",
          );
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-md text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Vérification de l'email
        </h1>
        <p className="text-gray-600">Nous vérifions votre adresse email...</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        {isVerifying ? (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-[#FD481A] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-700">
              Vérification en cours, veuillez patienter...
            </p>
          </div>
        ) : verificationStatus === "success" ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Email vérifié !
            </h2>
            <p className="text-gray-600">
              Redirection vers la page de succès...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#FD481A] h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Échec de la vérification
            </h2>
            <p className="text-gray-600">{errorMessage}</p>
            <div className="pt-4 space-y-3">
              <Link
                href="/login"
                className="block w-full bg-[#FD481A] text-white py-3 rounded-lg font-medium hover:bg-[#E63F15] transition-colors"
              >
                Retour à la connexion
              </Link>
              <Link
                href="/check-email"
                className="block text-[#FD481A] hover:underline font-medium text-sm"
              >
                Renvoyer l'email de vérification
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFullPage />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
