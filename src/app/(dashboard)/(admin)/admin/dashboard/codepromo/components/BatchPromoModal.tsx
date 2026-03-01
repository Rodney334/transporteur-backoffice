"use client";

import { useState, useEffect } from "react";
import { X, Layers, Percent, Target } from "lucide-react";
import { Partner, BatchPromoDto } from "../types";
import { usePartners } from "../hooks/use-partners";
import { useCampaigns } from "../hooks/use-campaigns";

interface BatchPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
}

export default function BatchPromoModal({
  isOpen,
  onClose,
  partner,
}: BatchPromoModalProps) {
  const { generateBatch, isLoading: isGenerating } = usePartners();
  const {
    campaigns,
    loadCampaigns,
    isLoading: isLoadingCampaigns,
  } = useCampaigns();

  const [formData, setFormData] = useState<BatchPromoDto>({
    campaignId: "",
    count: 50,
    type: "PERCENT",
    value: 15,
    maxDiscount: 5000,
    minOrderAmount: 20000,
    usageLimit: 1,
    usageLimitPerUser: 1,
    startsAt: "",
    endsAt: "",
    channel: "PARTNER",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && partner) {
      loadCampaigns(partner.id);
    }
  }, [isOpen, partner, loadCampaigns]);

  if (!isOpen || !partner) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.campaignId) newErrors.campaignId = "La campagne est requise";
    if (formData.count <= 0)
      newErrors.count = "Le nombre doit être supérieur à 0";
    if (formData.value <= 0)
      newErrors.value = "La valeur doit être supérieure à 0";
    if (!formData.startsAt) newErrors.startsAt = "Date de début requise";
    if (!formData.endsAt) newErrors.endsAt = "Date de fin requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await generateBatch(partner.id, {
      ...formData,
      startsAt: new Date(formData.startsAt).toISOString(),
      endsAt: new Date(formData.endsAt).toISOString(),
    });

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 lg:left-64 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Générer multiple code promo
                </h3>
                <p className="text-xs text-gray-500">
                  Pour le partenaire:{" "}
                  <span className="font-bold text-gray-700">
                    {partner.name}
                  </span>
                </p>
              </div>
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
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campagne */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choisir une campagne
              </label>
              <select
                value={formData.campaignId}
                onChange={(e) =>
                  setFormData({ ...formData, campaignId: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white ${
                  errors.campaignId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoadingCampaigns || isGenerating}
              >
                <option value="">Sélectionner une campagne...</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.campaignId && (
                <p className="mt-1 text-sm text-red-500">{errors.campaignId}</p>
              )}
            </div>

            {/* Nombre et Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de codes
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        count: Number(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de réduction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: "PERCENT" })
                    }
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-xs transition-colors ${
                      formData.type === "PERCENT"
                        ? "border-purple-600 bg-purple-50 text-purple-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Pourcentage %
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "FIXED" })}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-xs transition-colors ${
                      formData.type === "FIXED"
                        ? "border-purple-600 bg-purple-50 text-purple-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Fixe (XOF)
                  </button>
                </div>
              </div>
            </div>

            {/* Valeur et Max Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valeur
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    setFormData({
                      ...formData,
                      maxDiscount: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant minimum (XOF)
              </label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrderAmount: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            {/* Min Order & Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'utilisation total
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'utilisation par utilisateur
                </label>
                <input
                  type="number"
                  value={formData.usageLimitPerUser}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimitPerUser: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Période */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Début
                </label>
                <input
                  type="date"
                  value={formData.startsAt}
                  onChange={(e) =>
                    setFormData({ ...formData, startsAt: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.startsAt ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fin
                </label>
                <input
                  type="date"
                  value={formData.endsAt}
                  onChange={(e) =>
                    setFormData({ ...formData, endsAt: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.endsAt ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 shrink-0 bg-gray-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            disabled={isGenerating}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-2 px-4 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            disabled={isGenerating || isLoadingCampaigns}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Layers className="w-5 h-5" />
                Générer les codes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
