// components/PromoFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Tag, Percent, DollarSign } from "lucide-react";
import { PromoCode, PromoType } from "../types";
import { usePromos } from "../hooks";

interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoToEdit?: PromoCode | null;
}

export default function PromoFormModal({
  isOpen,
  onClose,
  promoToEdit,
}: PromoFormModalProps) {
  const { createPromo, updatePromo, isLoading } = usePromos();
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENT" as PromoType,
    value: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promoToEdit) {
      setFormData({
        code: promoToEdit.code,
        type: promoToEdit.type,
        value: promoToEdit.value.toString(),
      });
    } else {
      setFormData({
        code: "",
        type: "PERCENT",
        value: "",
      });
    }
    setErrors({});
  }, [promoToEdit, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Le code est requis";
    } else if (formData.code.length < 3) {
      newErrors.code = "Le code doit contenir au moins 3 caractères";
    }

    if (!formData.value) {
      newErrors.value = "La valeur est requise";
    } else {
      const numValue = Number(formData.value);
      if (isNaN(numValue) || numValue <= 0) {
        newErrors.value = "La valeur doit être un nombre positif";
      }
      if (formData.type === "PERCENT" && numValue > 100) {
        newErrors.value = "Le pourcentage ne peut pas dépasser 100%";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: Number(formData.value),
      };

      if (promoToEdit) {
        await updatePromo(promoToEdit.id, data);
      } else {
        await createPromo(data);
      }
      onClose();
    } catch (error) {
      // Les erreurs sont déjà gérées dans le hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* En-tête fixe */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Tag className="w-6 h-6 text-[#FD481A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {promoToEdit ? "Modifier le code promo" : "Créer un code promo"}
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

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code promo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code promo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="EX: PROMO10"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                  errors.code ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">{errors.code}</p>
              )}
            </div>

            {/* Type de réduction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de réduction <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "PERCENT" })}
                  className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    formData.type === "PERCENT"
                      ? "border-[#FD481A] bg-orange-50 text-[#FD481A]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={isLoading}
                >
                  <Percent className="w-4 h-4" />
                  <span>Pourcentage</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "FIXED" })}
                  className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    formData.type === "FIXED"
                      ? "border-[#FD481A] bg-orange-50 text-[#FD481A]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={isLoading}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Montant fixe</span>
                </button>
              </div>
            </div>

            {/* Valeur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valeur de la réduction <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder={formData.type === "PERCENT" ? "10" : "1000"}
                  min="0"
                  step={formData.type === "PERCENT" ? "1" : "100"}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                    errors.value ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {formData.type === "PERCENT" ? "%" : "XOF"}
                </div>
              </div>
              {errors.value && (
                <p className="mt-1 text-sm text-red-500">{errors.value}</p>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Note :</strong> Seuls ces champs sont modifiables. Les
                autres paramètres (dates, limites, contraintes) peuvent être
                configurés ultérieurement si nécessaire.
              </p>
            </div>
          </form>
        </div>

        {/* Pied de page fixe */}
        <div className="p-6 border-t border-gray-200 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {promoToEdit ? "Modification..." : "Création..."}
                </>
              ) : (
                <>{promoToEdit ? "Modifier" : "Créer"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
