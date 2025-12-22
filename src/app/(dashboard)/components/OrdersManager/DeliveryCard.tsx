// components/DeliveryCard.tsx - VERSION MISE À JOUR
import { Package } from "lucide-react";
import { DeliveryCardProps } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager.types";
import { OrderStatus } from "@/type/enum";

export const DeliveryCard = ({ item, onViewDetails }: DeliveryCardProps) => (
  <div
    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
    onClick={() => onViewDetails(item)}
  >
    <div className="text-xs font-semibold text-gray-600 mb-3">{item.id}</div>

    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-900">{item.from}</span>
      <span className="text-sm font-medium text-gray-900">{item.to}</span>
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

    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500 mb-1">Statut</div>
        <div className="text-xs font-medium text-gray-700">
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
            {item.originalData.status === OrderStatus.LIVREE
              ? "Livrée"
              : item.originalData.status === OrderStatus.EN_ATTENTE
              ? "En attente"
              : item.originalData.status === OrderStatus.ECHEC
              ? "Echouée"
              : "En cours"}
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-500">{item.date}</div>
    </div>
  </div>
);
