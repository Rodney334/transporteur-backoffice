// components/dashboard/TopClients.tsx
import { User, TrendingUp, DollarSign, Package } from "lucide-react";
import { TopClient } from "../types";

interface TopClientsProps {
  clients: TopClient[];
  title: string;
  metric: "orders" | "revenue";
}

export const TopClients = ({ clients, title, metric }: TopClientsProps) => {
  const getMetricIcon = () => {
    return metric === "orders" ? (
      <Package className="w-4 h-4 text-blue-600" />
    ) : (
      <DollarSign className="w-4 h-4 text-green-600" />
    );
  };

  const getMetricValue = (client: TopClient) => {
    return metric === "orders"
      ? `${client.totalOrders} commande${client.totalOrders > 1 ? "s" : ""}`
      : formatCurrency(client.totalRevenue);
  };

  const getSubtitle = (client: TopClient) => {
    return metric === "orders"
      ? `Revenu: ${formatCurrency(client.totalRevenue)}`
      : `${client.totalOrders} commande${client.totalOrders > 1 ? "s" : ""}`;
  };

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Aucune donnée disponible</p>
          </div>
        </div>
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Aucun client à afficher</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-[#FD481A]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">
            {metric === "orders"
              ? "Par nombre de commandes"
              : "Par revenus générés"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {clients.map((client, index) => (
          <div
            key={client.user._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-linear-to-br from-[#FD481A]/20 to-[#FD481A]/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-[#FD481A]">
                    {client.user.name?.charAt(0).toUpperCase() || "C"}
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
                  {client.user.name || `Client ${client.user._id.slice(0, 6)}`}
                </h4>
                <p className="text-sm text-gray-500">{getSubtitle(client)}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                {getMetricIcon()}
                <span className="font-bold text-gray-900">
                  {getMetricValue(client)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Moyenne: {formatCurrency(client.averageOrderValue)}
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
              Top {clients.length} client{clients.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-gray-500">
            {metric === "orders" ? "Commandes livrées" : "Revenus totaux"}
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
