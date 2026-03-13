"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Tag,
  Ticket,
  CheckCircle2,
  Clock,
  AlertCircle,
  Coins,
} from "lucide-react";
import { promoService } from "@/lib/services/promo-service";
import {
  ClientPromoItem,
  PromoUsageSchema,
  PromoType,
} from "@/app/(dashboard)/(admin)/admin/dashboard/codepromo/types";
import ProtectedRoute from "@/components/Protected-route";
import { GrantedRole } from "@/type/enum";

export default function CodepromoPage() {
  const [data, setData] = useState<PromoUsageSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await promoService.getMyPromoUsage();
      // Le retour est maintenant directement l'objet avec used, available, etc.
      setData(response);
    } catch (err: any) {
      console.error("Erreur chargement promos client:", err);
      setError("Impossible de charger vos codes promo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDiscount = (promo: ClientPromoItem) => {
    const value = promo.discount || 0;
    // Si l'API ne renvoie pas le type, on suppose que c'est un montant fixe (XOF)
    // ou on affiche juste le chiffre si on ne sait pas.
    // L'exemple montre "discount": 0.
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // The formatDate function is no longer used based on the provided diff.
  // const formatDate = (dateString: string | null) => {
  //   if (!dateString) return "Pas de date de fin";
  //   return new Date(dateString).toLocaleDateString("fr-FR", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[GrantedRole.Client]}>
      <div className="space-y-8 pb-10">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Mes codes promo</h1>
          <p className="text-gray-500 mt-2">
            Retrouvez ici vos avantages et votre historique d'utilisation.
          </p>
        </header>

        {/* Section Disponibles */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            <Ticket className="w-5 h-5 text-green-600" />
            <h2>Codes disponibles</h2>
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
              {data?.available.length || 0}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.available.length === 0 ? (
              <p className="text-gray-400 italic col-span-full py-4 text-center bg-gray-50 rounded-xl">
                Aucun code promo disponible pour le moment.
              </p>
            ) : (
              data?.available.map((promo) => (
                <div
                  key={promo.promoId}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-[#FD481A]/10 text-[#FD481A] rounded-lg font-mono font-bold text-lg tracking-wider">
                        {promo.code}
                      </div>
                      {/* <div className="text-2xl font-black text-gray-900">
                        {formatDiscount(promo)}
                      </div> */}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-gray-400" />
                        <span>
                          Valeur : {promo.promoValue}{" "}
                          {promo.promoType === PromoType.FIXED ? "FCFA" : "%"}
                        </span>
                      </div>
                      {promo.minOrderAmount > 0 && (
                        <div className="text-xs text-gray-500 italic">
                          Dès {promo.minOrderAmount.toLocaleString()} FCFA
                          d'achat
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section Indisponibles */}
        {/* <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2>Non applicables</h2>
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
              {data?.unavailable.length || 0}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-80">
            {data?.unavailable.length === 0 ? (
              <p className="text-gray-400 italic col-span-full py-4 text-center bg-gray-50 rounded-xl">
                Aucun code restreint.
              </p>
            ) : (
              data?.unavailable.map((promo) => (
                <div
                  key={promo.promoId}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-gray-100 text-gray-400 rounded-lg font-mono font-bold text-lg tracking-wider">
                      {promo.code}
                    </div>
                    <div className="text-lg font-bold text-gray-400">
                      {formatDiscount(promo)}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-700 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {promo.reason}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section> */}

        {/* Section Utilisés */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            <CheckCircle2 className="w-5 h-5 text-gray-400" />
            <h2>Déjà utilisés</h2>
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {data?.used.length || 0}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75 grayscale-[0.5]">
            {data?.used.length === 0 ? (
              <p className="text-gray-400 italic col-span-full py-4 text-center bg-gray-50 rounded-xl">
                Vous n'avez pas encore utilisé de code promo.
              </p>
            ) : (
              data?.used.map((promo) => (
                <div
                  key={promo.promoId}
                  className="bg-gray-50 p-5 rounded-2xl border border-gray-200 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-mono font-bold text-gray-500">
                      {promo.code}
                    </div>
                    {/* <div className="text-lg font-bold text-gray-400">
                      {formatDiscount(promo)}
                    </div> */}
                  </div>
                  <div className="text-xs text-gray-400">
                    Utilisé {promo.usedByUser} fois
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
