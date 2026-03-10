"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoadingFullPage } from "@/components/Loading";

function VerificationSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // Optionnel : Redirection automatique après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full max-w-md text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Félicitations !
        </h1>
        <p className="text-gray-600">Votre compte a été activé avec succès.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Email vérifié avec succès !
          </h2>

          <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <span className="font-medium text-[#131313]">
                ✓ Vérification terminée
              </span>
              <br />
              <span className="text-sm text-gray-600">
                Votre adresse email a été confirmée.
              </span>
            </p>

            {email && (
              <p className="text-gray-700">
                <span className="font-medium text-[#131313]">
                  📧 Email vérifié :
                </span>
                <br />
                <span className="text-sm text-gray-600 break-all">
                  {decodeURIComponent(email)}
                </span>
              </p>
            )}

            <p className="text-gray-700">
              <span className="font-medium text-[#131313]">
                🎉 Prêt à commencer
              </span>
              <br />
              <span className="text-sm text-gray-600">
                Vous pouvez maintenant vous connecter et utiliser toutes les
                fonctionnalités.
              </span>
            </p>
          </div>

          <p className="text-gray-600 text-sm">
            Vous allez être redirigé vers la page de connexion dans 10
            secondes...
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Link
            href="/login"
            className="block w-full bg-[#FD481A] text-white py-3.5 rounded-lg font-medium hover:bg-[#E63F15] transition-colors shadow-sm"
          >
            Se connecter maintenant
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="block border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Page d'accueil
            </Link>
            <Link
              href="/register"
              className="block border border-[#FD481A] text-[#FD481A] py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm"
            >
              Créer un autre compte
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-xs">
            Vous avez des questions ?{" "}
            <Link href="/contact" className="text-[#FD481A] hover:underline">
              Contactez notre support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerificationSuccessPage() {
  return (
    <Suspense fallback={<LoadingFullPage />}>
      <VerificationSuccessContent />
    </Suspense>
  );
}
