// components/negotiations/ResolveConflictModal.tsx - VERSION AVEC SCROLL
"use client";

import { useState } from "react";
import {
  X,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { ExtendedNegotiation } from "../use-negotiation-management";

interface ResolveConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: ExtendedNegotiation | null;
  isResolving: boolean;
  onResolve: (amount: number) => Promise<boolean>;
}

export const ResolveConflictModal = ({
  isOpen,
  onClose,
  negotiation,
  isResolving,
  onResolve,
}: ResolveConflictModalProps) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !negotiation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    const amountValue = parseFloat(amount);
    if (!amount.trim()) {
      setError("Veuillez entrer un montant");
      return;
    }
    if (isNaN(amountValue)) {
      setError("Veuillez entrer un nombre valide");
      return;
    }
    if (amountValue <= 0) {
      setError("Le montant doit être positif");
      return;
    }

    const success = await onResolve(amountValue);
    if (success) {
      setAmount("");
    }
  };

  const suggestPrice = (type: "middle" | "proposed" | "client") => {
    const proposed = negotiation.proposedByCourier || 0;
    const client = negotiation.confirmedByClient || 0;

    switch (type) {
      case "middle":
        return Math.round((proposed + client) / 2);
      case "proposed":
        return proposed;
      case "client":
        return client;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header fixe */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl z-10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#FD481A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#131313]">
                  Résoudre le conflit
                </h3>
                <p className="text-sm text-[#333333] mt-1">
                  Commande #{negotiation.order.id.slice(0, 8)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isResolving}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-[#FD481A]" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              {/* Résumé des prix */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Prix livreur
                      </span>
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                      {negotiation.proposedByCourier
                        ? `${negotiation.proposedByCourier} FCFA`
                        : "-"}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Prix client
                      </span>
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      {negotiation.confirmedByClient
                        ? `${negotiation.confirmedByClient} FCFA`
                        : "-"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  Écart :{" "}
                  {negotiation.proposedByCourier &&
                  negotiation.confirmedByClient
                    ? `${Math.abs(
                        negotiation.proposedByCourier -
                          negotiation.confirmedByClient
                      )} FCFA`
                    : "-"}
                </div>
              </div>

              {/* Suggestions de prix */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Suggestions de prix
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => setAmount(suggestPrice("middle").toString())}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    Milieu ({suggestPrice("middle")} FCFA)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAmount(suggestPrice("proposed").toString())
                    }
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    Livreur ({suggestPrice("proposed")} FCFA)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(suggestPrice("client").toString())}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    Client ({suggestPrice("client")} FCFA)
                  </button>
                </div>
              </div>

              {/* Champ de prix */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Prix final (FCFA)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError("");
                    }}
                    placeholder="Entrez le montant final"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200 ${
                      error
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    disabled={isResolving}
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              {/* Avertissement */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Action irréversible
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Le prix que vous définissez sera final et ne pourra plus
                      être modifié. Cette décision sera enregistrée comme
                      arbitrage administratif.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer fixe */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 rounded-b-2xl shrink-0">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isResolving}
                className="flex-1 px-4 py-3 text-[#131313] font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isResolving || !amount.trim()}
                className="flex-1 px-4 py-3 bg-linear-to-r from-[#FD481A] to-[#E63F15] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isResolving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Résolution...</span>
                  </>
                ) : (
                  "Confirmer le prix"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
