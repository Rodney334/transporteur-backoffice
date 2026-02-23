"use client";

import { useState, useEffect } from "react";
import { X, Users, Tag, ShieldCheck, ShieldAlert } from "lucide-react";
import { Partner } from "../types";
import { usePartners } from "../hooks/use-partners";

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerToEdit?: Partner | null;
}

export default function PartnerFormModal({
  isOpen,
  onClose,
  partnerToEdit,
}: PartnerFormModalProps) {
  const { createPartner, updatePartner, isLoading } = usePartners();
  const [formData, setFormData] = useState({
    name: "",
    codePrefix: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (partnerToEdit) {
      setFormData({
        name: partnerToEdit.name,
        codePrefix: partnerToEdit.codePrefix,
        isActive: partnerToEdit.isActive,
      });
    } else {
      setFormData({
        name: "",
        codePrefix: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [partnerToEdit, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.codePrefix.trim()) {
      newErrors.codePrefix = "Le préfixe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (partnerToEdit) {
        await updatePartner(partnerToEdit.id, formData);
      } else {
        await createPartner(formData);
      }
      onClose();
    } catch (error) {
      // Géré dans le hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="w-6 h-6 text-[#FD481A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {partnerToEdit ? "Modifier le partenaire" : "Nouveau partenaire"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du partenaire <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: MTN Cameroon"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Préfixe des codes <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.codePrefix}
              onChange={(e) => setFormData({ ...formData, codePrefix: e.target.value.toUpperCase() })}
              placeholder="Ex: MTN"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                errors.codePrefix ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.codePrefix && (
              <p className="mt-1 text-sm text-red-500">{errors.codePrefix}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Ce préfixe sera utilisé pour générer les codes promo du partenaire.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  formData.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {formData.isActive ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Partenaire actif</p>
                <p className="text-[10px] text-gray-500">
                  {formData.isActive ? "Activé" : "Désactivé"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                formData.isActive ? "bg-[#FD481A]" : "bg-gray-300"
              }`}
              disabled={isLoading}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : partnerToEdit ? (
                "Modifier"
              ) : (
                "Créer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
