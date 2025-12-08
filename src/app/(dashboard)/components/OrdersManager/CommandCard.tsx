// components/CommandCard.tsx - VERSION MISE À JOUR
import { memo } from "react";
import { CommandCardProps } from "@/app/(dashboard)/components/OrdersManager/OrdersManager.types";
import { OrderStatus } from "@/type/enum";

export const CommandCard = memo(function CommandCard({
  activeTab,
  item,
  onReject,
  onAccept,
  onEnd,
  onViewDetails,
  isProcessingAccept = false,
  isProcessingReject = false,
  isProcessingEnd = false,
}: CommandCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-[#FD481A] mb-1">
            Reference no : {item.reference}
          </div>
          <div className="flex gap-2 text-xs text-gray-400">
            <span>{item.date}</span>
            <span>|</span>
            <span
              className={`capitalize bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded-2xl ${
                item.originalData.status === OrderStatus.LIVREE
                  ? "bg-green-500/10 text-green-700"
                  : item.originalData.status === OrderStatus.EN_ATTENTE
                  ? "bg-orange-500/10 text-orange-700"
                  : item.originalData.status === OrderStatus.ECHEC
                  ? "bg-red-500/10 text-red-700"
                  : "bg-blue-500/10 text-blue-700"
              }`}
            >
              {item.originalData.status}
            </span>
          </div>
        </div>
        <button
          onClick={() => onViewDetails(item)}
          className="text-sm font-medium text-gray-900 hover:text-[#FD481A] transition-colors"
        >
          Voir Plus de Details
        </button>
      </div>

      {/* Route */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            Depart : {item.departure}
          </span>
        </div>

        <div className="flex items-center gap-3 pl-2.5">
          <div className="w-0.5 h-8 bg-red-300"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            Arrivée : {item.arrival}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {activeTab === "Nouvelles" && onAccept && (
          <button
            onClick={() => onAccept(item)}
            disabled={isProcessingAccept}
            className={`flex-1 py-2.5 px-4 bg-[#FD481A] text-white text-sm font-medium rounded-lg transition-colors ${
              isProcessingAccept
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#E63F15]"
            }`}
          >
            {isProcessingAccept ? "Traitement..." : "Accepter"}
          </button>
        )}

        {activeTab === "En cours" &&
          item.originalData.status === OrderStatus.EN_LIVRAISON &&
          onEnd && (
            <button
              onClick={() => onEnd(item)}
              disabled={isProcessingEnd}
              className={`flex-1 py-2.5 px-4 bg-[#FD481A] text-white text-sm font-medium rounded-lg transition-colors ${
                isProcessingEnd
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#E63F15]"
              }`}
            >
              {isProcessingEnd ? "Traitement..." : "Terminer"}
            </button>
          )}

        {/* {onReject && (
          <button
            onClick={() => onReject(item)}
            disabled={isProcessingReject}
            className={`flex-1 py-2.5 px-4 bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors ${
              isProcessingReject
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
          >
            {isProcessingReject ? "Traitement..." : "Rejeter"}
          </button>
        )} */}
      </div>
    </div>
  );
});
