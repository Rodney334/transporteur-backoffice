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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
            Commande
          </div>
          <div className="text-lg font-black text-[#FD481A] leading-none mb-2">
            #{item.orderNumber}
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
              {item.date}
            </span>
            <span
              className={`capitalize px-2 py-1 rounded-md ${getStatusColorClass(
                item.originalData.status as OrderStatus,
              )}`}
            >
              {getStatusDisplayText(item.originalData.status as OrderStatus)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={() => onViewDetails(item)}
            className="w-full sm:w-auto cursor-pointer text-xs font-black text-white bg-[#FD481A] px-4 py-2.5 rounded-xl hover:bg-[#E63F15] transition-all shadow-sm shadow-orange-50 uppercase tracking-tighter"
          >
            Prix et Détails
          </button>
        </div>
      </div>

      {/* Route */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold leading-none mb-1">Départ</span>
            <span className="text-sm font-medium text-gray-900 leading-none">
              {item.from}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pl-2.5">
          <div className="w-0.5 h-6 bg-red-100"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold leading-none mb-1">Arrivée</span>
            <span className="text-sm font-medium text-gray-900 leading-none">
              {item.to}
            </span>
          </div>
        </div>
      </div>

      {/* Status Stepper */}
      <OrderStatusStepper currentStatus={item.originalData.status} />

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          {activeTab !== "Échouées" && activeTab !== "En conflit" && (
            <>
              {item.originalData.status === OrderStatus.LIVREE && onReview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(item);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-orange-50 text-[#FD481A] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#FD481A] hover:text-white transition-all duration-300 border border-orange-100 shadow-md shadow-orange-50"
                >
                  <Star className="w-4 h-4 fill-current" />
                  Laisser un avis
                </button>
              )}

              {canCancel && onCancel && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(item);
                  }}
                  disabled={isProcessingCancel}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-100 shadow-md disabled:opacity-50"
                >
                  {isProcessingCancel ? "Traitement..." : "Annuler la commande"}
                </button>
              )}
            </>
          )}

          {/* Bouton Masquer spécifique pour les commandes annulées par le client dans l'onglet Échouées */}
          {activeTab === "Échouées" &&
            item.originalData.status === OrderStatus.ANNULEE_PAR_CLIENT &&
            isClient && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHide?.(item);
                }}
                disabled={isProcessingHide}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gray-50 text-gray-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 border border-gray-200 shadow-md disabled:opacity-50"
              >
                {isProcessingHide ? "Traitement..." : "Masquer"}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
