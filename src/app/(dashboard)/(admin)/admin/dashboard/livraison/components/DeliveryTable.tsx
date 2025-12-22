// app/(dashboard)/livraison/components/DeliveryTable.tsx
"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  Package,
  Truck,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react";
import { Order } from "@/type/order.type";
import { useDeliveries } from "../hooks/use-deliveries";

interface DeliveryTableProps {
  deliveries: Order[];
  isLoading: boolean;
  visibleColumns: {
    clientName: boolean;
    pickupAddress: boolean;
    deliveryAddress: boolean;
    deliveryType: boolean;
    finalPrice: boolean;
    status: boolean;
    createdAt: boolean;
  };
  formatAddress: (address: any) => string;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
}

export default function DeliveryTable({
  deliveries,
  isLoading,
  visibleColumns,
  formatAddress,
  formatPrice,
  formatDate,
}: DeliveryTableProps) {
  const { openDetailsModal } = useDeliveries();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (deliveryId: string) => {
    setExpandedCard(expandedCard === deliveryId ? null : deliveryId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A] mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des livraisons...</p>
        </div>
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Aucune livraison terminée
        </h3>
        <p className="text-gray-500 mt-1">
          Les livraisons terminées apparaîtront ici
        </p>
      </div>
    );
  }

  // Fonction pour obtenir une couleur basée sur le mode de transport
  const getTransportColor = (mode: string) => {
    const colors: Record<string, string> = {
      moto: "bg-blue-100 text-blue-800",
      voiture: "bg-green-100 text-green-800",
      camion: "bg-purple-100 text-purple-800",
      vélo: "bg-yellow-100 text-yellow-800",
    };
    return colors[mode?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      livree: "bg-green-100 text-green-800",
      echec: "bg-red-100 text-red-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      {/* Version Tableau pour écrans lg et plus grands */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {visibleColumns.clientName && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Client
                  </div>
                </th>
              )}
              {visibleColumns.pickupAddress && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Départ
                  </div>
                </th>
              )}
              {visibleColumns.deliveryAddress && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Arrivée
                  </div>
                </th>
              )}
              {visibleColumns.deliveryType && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Type
                  </div>
                </th>
              )}
              {visibleColumns.finalPrice && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Prix final
                  </div>
                </th>
              )}
              {visibleColumns.status && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Statut
                  </div>
                </th>
              )}
              {visibleColumns.createdAt && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deliveries.map((delivery) => (
              <tr
                key={delivery.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {visibleColumns.clientName && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {delivery.createdBy?.name?.charAt(0)?.toUpperCase() ||
                            "C"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.createdBy?.name || "Client inconnu"}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {delivery.id?.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                {visibleColumns.pickupAddress && (
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {formatAddress(delivery.pickupAddress)}
                    </div>
                  </td>
                )}
                {visibleColumns.deliveryAddress && (
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {formatAddress(delivery.deliveryAddress)}
                    </div>
                  </td>
                )}
                {visibleColumns.deliveryType && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {delivery.deliveryType || "N/A"}
                    </span>
                  </td>
                )}
                {visibleColumns.finalPrice && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {delivery.finalPrice
                        ? formatPrice(delivery.finalPrice)
                        : "N/A"}
                    </div>
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`capitalize px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        delivery.status
                      )}`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                )}
                {visibleColumns.createdAt && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(delivery.createdAt)}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openDetailsModal(delivery)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Cartes pour écrans md et plus petits */}
      <div className="lg:hidden space-y-4 p-4">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* En-tête de la carte */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCard(delivery.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 h-12 w-12 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {delivery.createdBy?.name?.charAt(0)?.toUpperCase() ||
                        "C"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {delivery.createdBy?.name || "Client inconnu"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`capitalize px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          delivery.status
                        )}`}
                      >
                        {delivery.status}
                      </span>
                      {delivery.finalPrice && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {formatPrice(delivery.finalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedCard === delivery.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Informations basiques toujours visibles */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleColumns.pickupAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Départ</p>
                      <p className="text-sm text-gray-700 truncate">
                        {formatAddress(delivery.pickupAddress)}
                      </p>
                    </div>
                  </div>
                )}
                {visibleColumns.deliveryAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Arrivée</p>
                      <p className="text-sm text-gray-700 truncate">
                        {formatAddress(delivery.deliveryAddress)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contenu dépliable */}
            {expandedCard === delivery.id && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Informations détaillées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleColumns.deliveryType && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <Package className="w-3 h-3 inline mr-1" />
                        Type de livraison
                      </label>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {delivery.deliveryType || "N/A"}
                      </span>
                    </div>
                  )}
                  {visibleColumns.createdAt && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Date de création
                      </label>
                      <div className="text-sm text-gray-600">
                        {formatDate(delivery.createdAt)}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ID de commande
                    </label>
                    <div className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded">
                      {delivery.id}
                    </div>
                  </div>
                </div>

                {/* Bouton d'action */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openDetailsModal(delivery)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Voir tous les détails
                  </button>
                </div>
              </div>
            )}

            {/* Bouton d'action visible même quand la carte n'est pas dépliée */}
            {!expandedCard && (
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => openDetailsModal(delivery)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Détails complets
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
