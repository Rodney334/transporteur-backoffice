// components/DeliveryCard.tsx - VERSION MISE À JOUR
import { Package, Star } from "lucide-react";
import { DeliveryCardProps } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager.types";
import { GrantedRole, OrderStatus } from "@/type/enum";
import { OrderStatusStepper } from "@/components/OrderStatusStepper";
import {
  getStatusDisplayText,
  getStatusColorClass,
} from "../../(admin)/admin/dashboard/commande/components/OrdersManager.utils";

export const DeliveryCard = ({
  item,
  onViewDetails,
  onReview,
  onCancel,
  onHide,
  isProcessingCancel = false,
  isProcessingHide = false,
  activeTab,
  userRole,
}: DeliveryCardProps) => {
  const isCourier = userRole === GrantedRole.Livreur;
  const isClient = userRole === GrantedRole.Client;

  const canCancel =
    (isClient && !item.originalData.assignedTo) ||
    (isCourier && item.originalData.status !== OrderStatus.LIVREE);

  return (
    <div
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      // onClick={() => onViewDetails(item)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          ID: {item.orderNumber}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(item);
          }}
          className="w-full sm:w-auto text-center text-sm font-bold text-white bg-[#FD481A] px-4 py-2 rounded-xl cursor-pointer hover:bg-[#E63F15] transition-all shadow-sm shadow-orange-100"
        >
          Prix et Détails
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 items-center">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-bold">
            Départ
          </span>
          <span className="text-sm font-bold text-gray-900 truncate">
            {item.from}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-gray-400 uppercase font-bold">
            Arrivée
          </span>
          <span className="text-sm font-bold text-gray-900 truncate">
            {item.to}
          </span>
        </div>
      </div>

      <div className="flex items-center mb-3">
        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
        <div className="flex-1 relative mx-2">
          <div className="border-t-2 border-dashed border-gray-300"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-[#FD481A] rounded-full flex items-center justify-center">
              <Package className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-gray-400 uppercase font-bold">
            Statut
          </div>
          <div className="text-xs font-bold">
            <span
              className={`capitalize px-3 py-1 rounded-full ${getStatusColorClass(
                item.originalData.status as OrderStatus,
              )}`}
            >
              {getStatusDisplayText(item.originalData.status as OrderStatus)}
            </span>
          </div>
        </div>
        <div className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
          {item.date}
        </div>
      </div>

      {activeTab !== "Échouées" && activeTab !== "En conflit" && (
        <>
          {item.originalData.status === OrderStatus.LIVREE && onReview && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReview(item);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-50 text-[#FD481A] text-sm font-bold rounded-xl hover:bg-[#FD481A] hover:text-white transition-all duration-300 border border-orange-100 shadow-sm"
              >
                <Star className="w-4 h-4 fill-current" />
                Laisser un avis
              </button>
            </div>
          )}

          {canCancel && onCancel && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(item);
                }}
                disabled={isProcessingCancel}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-100 shadow-sm disabled:opacity-50"
              >
                {isProcessingCancel ? "Traitement..." : "Annuler la commande"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Bouton Masquer spécifique pour les commandes annulées par le client dans l'onglet Échouées */}
      {activeTab === "Échouées" &&
        item.originalData.status === OrderStatus.ANNULEE_PAR_CLIENT &&
        isClient && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHide?.(item);
              }}
              disabled={isProcessingHide}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 border border-gray-200 shadow-sm disabled:opacity-50"
            >
              {isProcessingHide ? "Traitement..." : "Masquer"}
            </button>
          </div>
        )}
    </div>
  );
};
