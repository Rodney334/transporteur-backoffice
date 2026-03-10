// components/DeliveryCard.tsx - VERSION MISE À JOUR
import { Package, Star } from "lucide-react";
import { DeliveryCardProps } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager.types";
import { OrderStatus } from "@/type/enum";
import { OrderStatusStepper } from "@/components/OrderStatusStepper";

export const DeliveryCard = ({
  item,
  onViewDetails,
  onReview,
}: DeliveryCardProps) => (
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
            className={`capitalize px-3 py-1 rounded-full ${
              item.originalData.status === OrderStatus.LIVREE
                ? "bg-green-100 text-green-700"
                : item.originalData.status === OrderStatus.EN_ATTENTE
                  ? "bg-orange-100 text-orange-700"
                  : item.originalData.status === OrderStatus.ECHEC
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
            }`}
          >
            {item.originalData.status === OrderStatus.LIVREE
              ? "Livrée"
              : item.originalData.status === OrderStatus.EN_ATTENTE
                ? "Attente"
                : item.originalData.status === OrderStatus.ECHEC
                  ? "Echouée"
                  : item.originalData.status === OrderStatus.EN_LIVRAISON
                    ? "Livraison"
                    : item.originalData.status === OrderStatus.EN_DISCUSSION
                      ? "Discussion"
                      : item.originalData.status === OrderStatus.PRIX_VALIDE
                        ? "Prix validé"
                        : item.originalData.status === OrderStatus.ASSIGNEE
                          ? "Acceptée"
                          : "En cours"}
          </span>
        </div>
      </div>
      <div className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
        {item.date}
      </div>
    </div>

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

    {/* Status Stepper */}
    <OrderStatusStepper currentStatus={item.originalData.status} />
  </div>
);
