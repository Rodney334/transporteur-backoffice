"use client";

import { X, Users, Globe } from "lucide-react";

interface PromoTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGeneral: () => void;
  onSelectUserSpecific: () => void;
}

export default function PromoTypeSelectionModal({
  isOpen,
  onClose,
  onSelectGeneral,
  onSelectUserSpecific,
}: PromoTypeSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 lg:left-64 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Type de code promo
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Choisissez comment vous souhaitez diffuser ce code promo.
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          <button
            onClick={() => {
              onSelectGeneral();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#FD481A] hover:bg-orange-50 transition-all group text-left"
          >
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Tous les utilisateurs</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                Standard
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onSelectUserSpecific();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#FD481A] hover:bg-orange-50 transition-all group text-left"
          >
            <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">
                Utilisateurs spécifiques
              </h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                Ciblé
              </p>
            </div>
          </button>
        </div>

        {/* Pied de page */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
