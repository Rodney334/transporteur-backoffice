// components/PromoFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Tag, Percent } from "lucide-react";
import { PromoCode, PromoType, PromoChannel, PromoConstraints } from "../types";
import { usePromos } from "../hooks";
import {
  Calendar,
  Users,
  Target,
  Globe,
  Lock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoToEdit?: PromoCode | null;
}

const getTodayAtTime = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatToDateTimeLocal = (dateString: string | undefined | null) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch (e) {
    return "";
  }
};

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
    maxDiscount: "",
    minOrderAmount: "0",
    usageLimit: "",
    usageLimitPerUser: "",
    startsAt: "",
    endsAt: "",
    channel: "PUBLIC" as PromoChannel,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promoToEdit) {
      setFormData({
        code: promoToEdit.code,
        type: promoToEdit.type,
        value: promoToEdit.value.toString(),
        maxDiscount: promoToEdit.maxDiscount?.toString() || "",
        minOrderAmount: promoToEdit.minOrderAmount.toString(),
        usageLimit: promoToEdit.usageLimit?.toString() || "",
        usageLimitPerUser: promoToEdit.usageLimitPerUser?.toString() || "",
        startsAt: formatToDateTimeLocal(promoToEdit.startsAt),
        endsAt: formatToDateTimeLocal(promoToEdit.endsAt),
        channel: promoToEdit.channel,
        isActive: promoToEdit.isActive,
      });
    } else {
      setFormData({
        code: "",
        type: PromoType.PERCENT,
        value: "",
        maxDiscount: "",
        minOrderAmount: "0",
        usageLimit: "",
        usageLimitPerUser: "",
        startsAt: getTodayAtTime(0, 0),
        endsAt: getTodayAtTime(23, 59),
        channel: PromoChannel.PUBLIC,
        isActive: true,
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
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        minOrderAmount: Number(formData.minOrderAmount),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        usageLimitPerUser: formData.usageLimitPerUser
          ? Number(formData.usageLimitPerUser)
          : null,
        startsAt: formData.startsAt || null,
        endsAt: formData.endsAt || null,
        channel: formData.channel,
        isActive: formData.isActive,
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
    <div className="fixed inset-0 lg:left-64 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
          <form
            id="promo-code-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
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
                  onClick={() =>
                    setFormData({ ...formData, type: PromoType.PERCENT })
                  }
                  className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    formData.type === PromoType.PERCENT
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
                  onClick={() =>
                    setFormData({ ...formData, type: PromoType.FIXED })
                  }
                  className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    formData.type === PromoType.FIXED
                      ? "border-[#FD481A] bg-orange-50 text-[#FD481A]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={isLoading}
                >
                  <span>Montant fixe (XOF)</span>
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

            {/* Canal de diffusion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal de diffusion <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, channel: PromoChannel.PUBLIC })
                  }
                  className={`cursor-pointer flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg border transition-colors ${
                    formData.channel === PromoChannel.PUBLIC
                      ? "border-[#FD481A] bg-orange-50 text-[#FD481A]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={isLoading}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs">Public</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, channel: PromoChannel.PARTNER })
                  }
                  className={`cursor-pointer flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg border transition-colors ${
                    formData.channel === PromoChannel.PARTNER
                      ? "border-[#FD481A] bg-orange-50 text-[#FD481A]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={isLoading}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Partenaire</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, channel: PromoChannel.VIP })
                  }
                  className={`cursor-pointer flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg border transition-colors ${
                    formData.channel === PromoChannel.VIP
                      ? "border-[#FD481A] bg-orange-50 text-[#FD481A]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={isLoading}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs">VIP</span>
                </button>
              </div>
            </div>

            {/* Limites d'utilisation */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'utilisateur
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    placeholder="Illimité"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    disabled={isLoading}
                  />
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'utilisation par utilisateur
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.usageLimitPerUser}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimitPerUser: e.target.value,
                      })
                    }
                    placeholder="Illimité"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    disabled={isLoading}
                  />
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Montants additionnels */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant minimum (XOF)
                </label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderAmount: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remise max (XOF)
                </label>
                <input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDiscount: e.target.value })
                  }
                  placeholder="Illimité"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Période de validité */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(e) =>
                      setFormData({ ...formData, startsAt: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={(e) =>
                      setFormData({ ...formData, endsAt: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Statut d'activation */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${formData.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {formData.isActive ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Code promo actif</p>
                  <p className="text-xs text-gray-500">
                    {formData.isActive
                      ? "Le code peut être utilisé immédiatement"
                      : "Le code ne peut pas être utilisé"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, isActive: !formData.isActive })
                }
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
              form="promo-code-form"
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
