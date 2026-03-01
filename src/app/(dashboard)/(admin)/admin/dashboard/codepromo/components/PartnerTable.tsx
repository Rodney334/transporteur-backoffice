"use client";

import { useState } from "react";
import {
  Users,
  Edit,
  Trash2,
  Eye,
  Power,
  PlusCircle,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Partner } from "../types";

interface PartnerTableProps {
  partners: Partner[];
  isLoading: boolean;
  getActiveStatusColor: (isActive: boolean) => string;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onCreateCampaign: (partner: Partner) => void;
  onViewCampaigns: (partner: Partner) => void;
  onGenerateBatch: (partner: Partner) => void;
}

export default function PartnerTable({
  partners,
  isLoading,
  getActiveStatusColor,
  onEdit,
  onDelete,
  onCreateCampaign,
  onViewCampaigns,
  onGenerateBatch,
}: PartnerTableProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (partnerId: string) => {
    setExpandedCard(expandedCard === partnerId ? null : partnerId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A] mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des partenaires...</p>
        </div>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Users className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Aucun partenaire trouvé
        </h3>
        <p className="text-gray-500 mt-1">
          Les partenaires apparaîtront ici après création
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Nom
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Prefix Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  Statut
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {partners.map((partner) => (
              <tr
                key={partner.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {partner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4 font-bold text-gray-900">
                      {partner.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {partner.codePrefix}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getActiveStatusColor(
                      partner.isActive,
                    )}`}
                  >
                    {partner.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewCampaigns(partner)}
                      className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Campagnes & Détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onCreateCampaign(partner)}
                      className="cursor-pointer p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Créer une campagne"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onGenerateBatch(partner)}
                      className="cursor-pointer p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Multiple code"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(partner)}
                      className="cursor-pointer p-2 text-[#FD481A] hover:bg-orange-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(partner)}
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
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCard(partner.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 h-12 w-12 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {partner.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{partner.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getActiveStatusColor(
                          partner.isActive,
                        )}`}
                      >
                        {partner.isActive ? "Actif" : "Inactif"}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {partner.codePrefix}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedCard === partner.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            {expandedCard === partner.id && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onViewCampaigns(partner)}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Détails
                  </button>
                  <button
                    onClick={() => onCreateCampaign(partner)}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Campagne
                  </button>
                  <button
                    onClick={() => onGenerateBatch(partner)}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                    Multiple code
                  </button>
                  <button
                    onClick={() => onEdit(partner)}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(partner)}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
