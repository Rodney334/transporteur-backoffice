// components/PromoTable.tsx
"use client";

import { useState } from "react";
import {
  Tag,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  Power,
  Clock,
} from "lucide-react";
import { PromoCode } from "../types";
import { usePromos } from "../hooks";

interface PromoTableProps {
  promos: PromoCode[];
  isLoading: boolean;
  visibleColumns: {
    code: boolean;
    type: boolean;
    value: boolean;
    isActive: boolean;
    usageLimit: boolean;
    startsAt: boolean;
    endsAt: boolean;
  };
  formatPromoType: (type: "PERCENT" | "FIXED", value: number) => string;
  formatDate: (dateString: string | null) => string;
  getActiveStatusColor: (isActive: boolean) => string;
  onEdit: (promo: PromoCode) => void;
  onDelete: (promo: PromoCode) => void;
}

export default function PromoTable({
  promos,
  isLoading,
  visibleColumns,
  formatPromoType,
  formatDate,
  getActiveStatusColor,
  onEdit,
  onDelete,
}: PromoTableProps) {
  const { openDetailsModal } = usePromos();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (promoId: string) => {
    setExpandedCard(expandedCard === promoId ? null : promoId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A] mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des codes promo...</p>
        </div>
      </div>
    );
  }

  if (promos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Tag className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Aucun code promo trouvé
        </h3>
        <p className="text-gray-500 mt-1">
          Les codes promo apparaîtront ici après création
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Version Tableau pour écrans lg et plus grands */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {visibleColumns.code && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Code
                  </div>
                </th>
              )}
              {visibleColumns.type && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              )}
              {visibleColumns.value && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Valeur
                </th>
              )}
              {visibleColumns.isActive && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Power className="w-4 h-4" />
                    Statut
                  </div>
                </th>
              )}
              {visibleColumns.usageLimit && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Limite utilisations
                </th>
              )}
              {visibleColumns.startsAt && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Début
                  </div>
                </th>
              )}
              {visibleColumns.endsAt && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Fin
                  </div>
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {promos.map((promo) => (
              <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                {visibleColumns.code && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {promo.code.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">
                          {promo.code}
                        </div>
                        <div className="text-xs text-gray-500">
                          {promo.channel}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                {visibleColumns.type && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">
                        {promo.type === "PERCENT"
                          ? "Pourcentage"
                          : "Montant fixe"}
                      </span>
                    </div>
                  </td>
                )}
                {visibleColumns.value && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">
                      {formatPromoType(promo.type, promo.value)}
                    </div>
                  </td>
                )}
                {visibleColumns.isActive && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getActiveStatusColor(
                        promo.isActive,
                      )}`}
                    >
                      {promo.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                )}
                {visibleColumns.usageLimit && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {promo.usageLimit?.toLocaleString() || "-"}
                    </div>
                    {promo.usageLimitPerUser && (
                      <div className="text-xs text-gray-500">
                        {promo.usageLimitPerUser} par utilisateur
                      </div>
                    )}
                  </td>
                )}
                {visibleColumns.startsAt && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(promo.startsAt)}
                  </td>
                )}
                {visibleColumns.endsAt && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(promo.endsAt)}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDetailsModal(promo)}
                      className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(promo)}
                      className="cursor-pointer p-2 text-[#FD481A] hover:bg-orange-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(promo)}
                      className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Cartes pour écrans md et plus petits */}
      <div className="lg:hidden space-y-4 p-4">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* En-tête de la carte */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCard(promo.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 h-12 w-12 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {promo.code.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{promo.code}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getActiveStatusColor(
                          promo.isActive,
                        )}`}
                      >
                        {promo.isActive ? "Actif" : "Inactif"}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {formatPromoType(promo.type, promo.value)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedCard === promo.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Contenu dépliable */}
            {expandedCard === promo.id && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-sm text-gray-900">
                      {promo.type === "PERCENT"
                        ? "Pourcentage"
                        : "Montant fixe"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Canal</p>
                    <p className="text-sm text-gray-900">{promo.channel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Début</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(promo.startsAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fin</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(promo.endsAt)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Limite utilisations
                    </p>
                    <p className="text-sm text-gray-900">
                      {promo.usageLimit?.toLocaleString() || "Illimité"}
                      {promo.usageLimitPerUser && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({promo.usageLimitPerUser} par utilisateur)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openDetailsModal(promo)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Détails
                  </button>
                  <button
                    onClick={() => onEdit(promo)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(promo)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
