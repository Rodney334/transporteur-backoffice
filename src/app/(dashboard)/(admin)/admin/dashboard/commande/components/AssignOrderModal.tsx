// components/AssignOrderModal.tsx - AJOUT DU LOADING
"use client";

import { useState } from "react";
import { X, Package, UserCheck } from "lucide-react";
import { LivreurSearchSelect } from "./LivreurSearchSelect";
import { User } from "@/type/user.type";

interface AssignOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (livreurId: string, auto?: boolean) => Promise<boolean>;
  livreurs: User[];
  isAssigning: boolean;
  isLoadingLivreurs?: boolean; // Nouvelle prop
  orderReference?: string;
}

export const AssignOrderModal = ({
  isOpen,
  onClose,
  onAssign,
  livreurs,
  isAssigning,
  isLoadingLivreurs = false, // Valeur par défaut
  orderReference,
}: AssignOrderModalProps) => {
  const [selectedLivreur, setSelectedLivreur] = useState<User | null>(null);
  const [autoAssign, setAutoAssign] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLivreur) {
      return;
    }

    const success = await onAssign(selectedLivreur._id, autoAssign);
    if (success) {
      setSelectedLivreur(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-[#FD481A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#131313]">
                  Assigner une commande
                </h3>
                {orderReference && (
                  <p className="text-sm text-[#333333] mt-1">
                    Référence : {orderReference}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-[#FD481A]" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-6">
              {/* Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#FD481A]" />
                  <p className="text-sm text-[#333333]">
                    Sélectionnez un livreur pour assigner cette commande. Le
                    livreur recevra une notification et pourra accepter la
                    commande.
                  </p>
                </div>
              </div>

              {/* Sélecteur de livreur */}
              <LivreurSearchSelect
                livreurs={livreurs}
                selectedLivreur={selectedLivreur}
                onSelectLivreur={setSelectedLivreur}
                isLoading={isLoadingLivreurs}
              />

              {/* Option d'assignation automatique */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <input
                  type="checkbox"
                  id="autoAssign"
                  checked={autoAssign}
                  onChange={(e) => setAutoAssign(e.target.checked)}
                  className="w-4 h-4 text-[#FD481A] border-gray-300 rounded focus:ring-[#FD481A]"
                />
                <label htmlFor="autoAssign" className="text-sm text-[#333333]">
                  Assignation automatique (la commande sera directement marquée
                  comme assignée)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[#131313] font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              disabled={isAssigning}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!selectedLivreur || isAssigning || isLoadingLivreurs}
              className="flex-1 px-4 py-3 bg-linear-to-r from-[#FD481A] to-[#E63F15] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAssigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Assignation...</span>
                </>
              ) : (
                "Assigner la commande"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
