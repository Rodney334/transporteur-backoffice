// components/ConfirmDeleteModal.tsx
"use client";

import { X, AlertTriangle, Tag } from "lucide-react";
import { PromoCode } from "../types";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  promo: PromoCode | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  promo,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmDeleteModalProps) {
  if (!isOpen || !promo) return null;

  return (
    <div className="fixed inset-0 lg:left-64 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirmer la suppression
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Êtes-vous sûr de vouloir supprimer ce code promo ? Cette action est
            irréversible.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Code:</span>
                <span className="text-sm font-bold text-[#FD481A]">
                  {promo.code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type:</span>
                <span className="text-sm text-gray-900">
                  {promo.type === "PERCENT" ? "Pourcentage" : "Montant fixe"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Valeur:</span>
                <span className="text-sm font-medium text-gray-900">
                  {promo.type === "PERCENT"
                    ? `${promo.value}%`
                    : `${promo.value} XOF`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Statut:</span>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    promo.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {promo.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">ID:</span>
                <span className="text-xs font-mono text-gray-500">
                  {promo.id.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Suppression...
                </>
              ) : (
                "Supprimer définitivement"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
