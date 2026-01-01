// components/dashboard/TopCouriers.tsx
import { UserCheck, TrendingUp, DollarSign, Package } from "lucide-react";
import { TopCourier } from "../types";

interface TopCouriersProps {
  couriers: TopCourier[];
  title: string;
  metric: "deliveries" | "revenue";
}

export const TopCouriers = ({ couriers, title, metric }: TopCouriersProps) => {
  const getMetricIcon = () => {
    return metric === "deliveries" ? (
      <Package className="w-4 h-4 text-blue-600" />
    ) : (
      <DollarSign className="w-4 h-4 text-green-600" />
    );
  };

  const getMetricValue = (courier: TopCourier) => {
    return metric === "deliveries"
      ? `${courier.totalDeliveries} livraison${
          courier.totalDeliveries > 1 ? "s" : ""
        }`
      : formatCurrency(courier.totalRevenue);
  };

  const getSubtitle = (courier: TopCourier) => {
    return metric === "deliveries"
      ? `Revenu: ${formatCurrency(courier.totalRevenue)}`
      : `${courier.totalDeliveries} livraison${
          courier.totalDeliveries > 1 ? "s" : ""
        }`;
  };

  if (couriers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Aucune donnée disponible</p>
          </div>
        </div>
        <div className="text-center py-8">
          <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Aucun livreur à afficher</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-[#FD481A]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">
            {metric === "deliveries"
              ? "Par nombre de livraisons"
              : "Par revenus générés"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {couriers.map((courier, index) => (
          <div
            key={courier.user._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">
                    {courier.user.name?.charAt(0).toUpperCase() || "L"}
                  </span>
                </div>
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FD481A] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {courier.user.name ||
                    `Livreur ${courier.user._id.slice(0, 6)}`}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        courier.successRate >= 90
                          ? "bg-green-500"
                          : courier.successRate >= 75
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {courier.successRate}% succès
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                {getMetricIcon()}
                <span className="font-bold text-gray-900">
                  {getMetricValue(courier)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getSubtitle(courier)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>
              Top {couriers.length} livreur{couriers.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-gray-500">
            {metric === "deliveries"
              ? "Livraisons réussies"
              : "Revenus générés"}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};
