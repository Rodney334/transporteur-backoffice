// DeliveryCard.tsx
import { Package } from "lucide-react";
import { DeliveryCardInterface } from "../types/type";

export const DeliveryCard = ({ item, type }: DeliveryCardInterface) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
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
        <div className="text-xs font-medium text-gray-700">{item.status}</div>
      </div>
      <div className="text-xs text-gray-500">{item.date}</div>
    </div>
  </div>
);
