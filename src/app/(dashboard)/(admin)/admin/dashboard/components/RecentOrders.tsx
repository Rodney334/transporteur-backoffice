// components/dashboard/RecentOrders.tsx
import { Package, MapPin, DollarSign, Clock, User } from "lucide-react";
import { Order } from "@/type/order.type";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface RecentOrdersProps {
  orders: Order[];
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      livree: "bg-green-100 text-green-800",
      en_attente: "bg-gray-100 text-gray-800",
      assignee: "bg-blue-100 text-blue-800",
      en_discussion_tarifaire: "bg-yellow-100 text-yellow-800",
      prix_valide: "bg-orange-100 text-orange-800",
      en_livraison: "bg-purple-100 text-purple-800",
      echec: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      livree: "Livrée",
      en_attente: "En attente",
      assignee: "Assignée",
      en_discussion_tarifaire: "En discussion",
      prix_valide: "Prix validé",
      en_livraison: "En livraison",
      echec: "Échec",
    };
    return labels[status] || status;
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Dernières Commandes
            </h3>
            <p className="text-sm text-gray-500">Aucune commande récente</p>
          </div>
        </div>
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Aucune commande à afficher</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Dernières Commandes
            </h3>
            <p className="text-sm text-gray-500">
              {orders.length} commande{orders.length > 1 ? "s" : ""} récente
              {orders.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button className="text-sm text-[#FD481A] hover:text-[#E63F15] font-medium">
          Voir tout →
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#FD481A]/30 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Commande #{order.id.slice(0, 8)}
                  </h4>
                  <p className="text-sm text-gray-500 capitalize">
                    {order.serviceType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {format(parseISO(order.createdAt), "dd MMM HH:mm", {
                    locale: fr,
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.createdBy.name?.split(" ")[0] || "Client"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FD481A]" />
                <div>
                  <p className="text-xs text-gray-500">Destination</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.deliveryAddress.city || "Non spécifié"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Montant</p>
                  <p className="text-sm font-bold text-green-700">
                    {order.finalPrice
                      ? `${Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XOF",
                          minimumFractionDigits: 0,
                        }).format(order.finalPrice)} FCFA`
                      : "À négocier"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Poids: {order.weight}kg
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  Zone: {order.zone}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
