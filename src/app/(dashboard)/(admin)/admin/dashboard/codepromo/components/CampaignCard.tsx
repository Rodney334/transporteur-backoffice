"use client";

import { useState } from "react";
import {
  Calendar,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Campaign } from "../types";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  formatDate: (dateString: string | null) => string;
}

export default function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  formatDate,
}: CampaignCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${campaign.isActive ? "bg-green-50" : "bg-red-50"}`}>
            {campaign.isActive ? (
              <ShieldCheck className="w-5 h-5 text-green-600" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{campaign.name}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(campaign.startsAt)} - {formatDate(campaign.endsAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
          <div className="py-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-1">
                Date de début
              </p>
              <p className="text-sm font-medium text-gray-700">{formatDate(campaign.startsAt)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-1">
                Date de fin
              </p>
              <p className="text-sm font-medium text-gray-700">{formatDate(campaign.endsAt)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-1">
                Créée le
              </p>
              <p className="text-sm font-medium text-gray-700">{formatDate(campaign.createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-1">
                Dernière mise à jour
              </p>
              <p className="text-sm font-medium text-gray-700">{formatDate(campaign.updatedAt)}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => onEdit(campaign)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Modifier
            </button>
            <button
              onClick={() => onDelete(campaign)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
