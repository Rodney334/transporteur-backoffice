"use client";

import { useState, useEffect } from "react";
import {
  X,
  Tag,
  Percent,
  Users,
  Globe,
  ShieldCheck,
  ShieldAlert,
  Search,
  Check,
} from "lucide-react";
import {
  PromoCode,
  PromoType,
  PromoChannel,
  PromoConstraints,
  PromoUserEligibilityDto,
} from "../types";
import { usePromos } from "../hooks";
import { User } from "@/type/user.type";
import { GrantedRole } from "@/type/enum";

interface UserSpecificPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

const getTodayAtTime = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function UserSpecificPromoModal({
  isOpen,
  onClose,
  users,
}: UserSpecificPromoModalProps) {
  const { createPromo, setUserEligibility, isLoading } = usePromos();
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENT" as PromoType,
    value: "",
    maxDiscount: "",
    minOrderAmount: "0",
    usageLimit: "",
    usageLimitPerUser: "1",
    startsAt: "",
    endsAt: "",
    channel: "VIP" as PromoChannel,
    isActive: true,
    forbidIfAlreadyUsed: true,
  });

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        code: "",
        type: "PERCENT",
        value: "",
        maxDiscount: "",
        minOrderAmount: "0",
        usageLimit: "",
        usageLimitPerUser: "1",
        startsAt: getTodayAtTime(0, 0),
        endsAt: getTodayAtTime(23, 59),
        channel: "VIP",
        isActive: true,
        forbidIfAlreadyUsed: true,
      });
      setSelectedUserIds([]);
      setUserSearchTerm("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(
    (user) =>
      user.role === GrantedRole.Client &&
      (user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.phoneNumber.includes(userSearchTerm)),
  );

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

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

    if (selectedUserIds.length === 0) {
      newErrors.users = "Veuillez sélectionner au moins un utilisateur";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // 1. Créer le code promo (Requête standard)
      const promoData = {
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

      await createPromo(promoData);

      // 2. Définir l'éligibilité (Requête spécifique avec body de 4 champs)
      const eligibilityData: PromoUserEligibilityDto = {
        code: formData.code.toUpperCase().trim(),
        userIds: selectedUserIds,
        mode: "ADD",
        forbidIfAlreadyUsed: formData.forbidIfAlreadyUsed,
      };

      await setUserEligibility(eligibilityData);

      onClose();
    } catch (error) {
      // Les erreurs sont déjà gérées dans le hook
    }
  };

  return (
    <div className="fixed inset-0 lg:left-64 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Code promo ciblé
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Créer un code promo pour des utilisateurs spécifiques
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Section 1: Configuration du code */}
              <div className="space-y-6">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Tag className="w-4 h-4 text-[#FD481A]" />
                  Configuration du code
                </h4>

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
                    placeholder="EX: USERVIP20"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] transition-all bg-gray-50 focus:bg-white ${
                      errors.code ? "border-red-500" : "border-gray-200"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.code && (
                    <p className="mt-1 text-xs text-red-500">{errors.code}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de réduction <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "PERCENT" })
                      }
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        formData.type === "PERCENT"
                          ? "border-[#FD481A] bg-orange-50 text-[#FD481A] shadow-sm"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <Percent className="w-4 h-4" />%
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "FIXED" })
                      }
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        formData.type === "FIXED"
                          ? "border-[#FD481A] bg-orange-50 text-[#FD481A] shadow-sm"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      XOF
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valeur <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                      placeholder="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] bg-gray-50 focus:bg-white ${
                        errors.value ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      {formData.type === "PERCENT" ? "%" : "XOF"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
                      Début
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startsAt}
                      onChange={(e) =>
                        setFormData({ ...formData, startsAt: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FD481A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
                      Fin
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endsAt}
                      onChange={(e) =>
                        setFormData({ ...formData, endsAt: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FD481A] outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Déjà utilisé ?
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          forbidIfAlreadyUsed: !formData.forbidIfAlreadyUsed,
                        })
                      }
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                        formData.forbidIfAlreadyUsed
                          ? "bg-[#FD481A]"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          formData.forbidIfAlreadyUsed
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    {formData.forbidIfAlreadyUsed
                      ? "Interdire si l'utilisateur a déjà utilisé un code de l'éligibilité."
                      : "Autoriser même si déjà utilisé."}
                  </p>
                </div>
              </div>

              {/* Section 2: Sélection des utilisateurs */}
              <div className="flex flex-col h-full space-y-4">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Sélection des utilisateurs ({selectedUserIds.length})
                </h4>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden flex flex-col bg-gray-50/50">
                  <div className="max-h-[190px] overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => toggleUser(user._id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                            selectedUserIds.includes(user._id)
                              ? "bg-purple-100 text-purple-900 shadow-sm"
                              : "bg-white hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-sm">{user.name}</p>
                            <p className="text-xs opacity-70">
                              {user.phoneNumber}
                            </p>
                          </div>
                          {selectedUserIds.includes(user._id) && (
                            <div className="bg-purple-600 rounded-full p-1">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                        <Users className="w-8 h-8 opacity-20 mb-2" />
                        <p className="text-xs">Aucun utilisateur trouvé</p>
                      </div>
                    )}
                  </div>

                  {selectedUserIds.length > 0 && (
                    <div className="p-3 bg-white border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setSelectedUserIds([])}
                        className="text-[10px] text-red-500 hover:underline font-medium"
                      >
                        Tout désélectionner
                      </button>
                    </div>
                  )}
                </div>
                {errors.users && (
                  <p className="text-xs text-red-500">{errors.users}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="p-6 border-t border-gray-200 shrink-0 bg-gray-50">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-2 px-4 py-3 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-100"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    Traitement...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Créer et assigner ({selectedUserIds.length} utilisateurs)
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
