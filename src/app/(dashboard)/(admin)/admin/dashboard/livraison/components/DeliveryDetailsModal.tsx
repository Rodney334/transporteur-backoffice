// app/(dashboard)/livraison/components/DeliveryDetailsModal.tsx
"use client";

import {
  X,
  Package,
  User,
  MapPin,
  Truck,
  DollarSign,
  Calendar,
  Weight,
  Info,
} from "lucide-react";
import { useDeliveries } from "../hooks/use-deliveries";
import { JSX } from "react";
import { useDeliveriesStore } from "../stores/deliveries-store";

export default function DeliveryDetailsModal() {
  const { selectedDelivery } = useDeliveriesStore();
  const {
    // selectedDelivery,
    closeDetailsModal,
    formatAddress,
    formatPrice,
    formatDate,
  } = useDeliveries();

  console.log("DeliveryDetailsModal - selectedDelivery:", selectedDelivery);

  if (!selectedDelivery) return null;

  // Fonction pour formater un objet en sections lisibles
  const formatObject = (obj: any, depth = 0): JSX.Element => {
    if (!obj || typeof obj !== "object") {
      return <span className="text-gray-700">{String(obj)}</span>;
    }

    return (
      <div className={`${depth > 0 ? "ml-4" : ""} space-y-2`}>
        {Object.entries(obj).map(([key, value]) => (
          <div key={key} className="border-l-2 border-gray-200 pl-3">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-500 min-w-[120px]">
                {key}:
              </span>
              {typeof value === "object" && value !== null ? (
                <div className="flex-1">{formatObject(value, depth + 1)}</div>
              ) : (
                <span className="text-sm text-gray-700 break-all">
                  {String(value)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* En-tête fixe */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Détails de la livraison
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Commande #{selectedDelivery.id?.slice(-8)}
                </p>
              </div>
            </div>
            <button
              onClick={closeDetailsModal}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Section 1: Informations générales */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Informations générales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de création
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(selectedDelivery.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Statut
                  </label>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {selectedDelivery.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Package className="w-4 h-4 inline mr-1" />
                    Type de service
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedDelivery.serviceType}
                  </div>
                </div>
                {selectedDelivery.articleType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Type d'article
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedDelivery.articleType}
                    </div>
                  </div>
                )}
                {selectedDelivery.zone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Zone
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedDelivery.zone}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Weight className="w-4 h-4 inline mr-1" />
                    Poids
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedDelivery.weight} kg
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Informations client et livreur */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations client
                </h4>
                {selectedDelivery.createdBy &&
                typeof selectedDelivery.createdBy === "object" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Nom complet
                      </label>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedDelivery.createdBy.name}
                      </div>
                    </div>
                    {selectedDelivery.createdBy.email && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        <div className="text-sm text-gray-700">
                          {selectedDelivery.createdBy.email}
                        </div>
                      </div>
                    )}
                    {selectedDelivery.createdBy.phoneNumber && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Téléphone
                        </label>
                        <div className="text-sm text-gray-700">
                          {selectedDelivery.createdBy.phoneNumber}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Informations client non disponibles
                  </div>
                )}
              </div>

              {/* Livreur */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Informations livraison
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Mode de transport
                    </label>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {selectedDelivery.transportMode}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Type de livraison
                    </label>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {selectedDelivery.deliveryType}
                    </span>
                  </div>
                  {selectedDelivery.assignedTo && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Assigné à
                      </label>
                      <div className="text-sm text-gray-700">
                        {/* {typeof selectedDelivery.assignedTo === 'object' 
                          ? selectedDelivery.assignedTo.name 
                          : selectedDelivery.assignedTo} */}
                        {selectedDelivery.assignedTo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Adresses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adresse de départ */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Adresse de départ
                </h4>
                {selectedDelivery.pickupAddress ? (
                  <div className="space-y-2">
                    {typeof selectedDelivery.pickupAddress === "object" ? (
                      <>
                        {selectedDelivery.pickupAddress.name && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Contact
                            </label>
                            <div className="text-sm text-gray-900">
                              {selectedDelivery.pickupAddress.name}
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Adresse complète
                          </label>
                          <div className="text-sm text-gray-700">
                            {formatAddress(selectedDelivery.pickupAddress)}
                          </div>
                        </div>
                        {selectedDelivery.pickupAddress.phone && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Téléphone
                            </label>
                            <div className="text-sm text-gray-700">
                              {selectedDelivery.pickupAddress.phone}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-700">
                        {selectedDelivery.pickupAddress}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Adresse de départ non spécifiée
                  </div>
                )}
              </div>

              {/* Adresse d'arrivée */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  Adresse d'arrivée
                </h4>
                {selectedDelivery.deliveryAddress ? (
                  <div className="space-y-2">
                    {typeof selectedDelivery.deliveryAddress === "object" ? (
                      <>
                        {selectedDelivery.deliveryAddress.name && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Contact
                            </label>
                            <div className="text-sm text-gray-900">
                              {selectedDelivery.deliveryAddress.name}
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Adresse complète
                          </label>
                          <div className="text-sm text-gray-700">
                            {formatAddress(selectedDelivery.deliveryAddress)}
                          </div>
                        </div>
                        {selectedDelivery.deliveryAddress.phone && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Téléphone
                            </label>
                            <div className="text-sm text-gray-700">
                              {selectedDelivery.deliveryAddress.phone}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-700">
                        {selectedDelivery.deliveryAddress}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Adresse d'arrivée non spécifiée
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Prix et description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prix */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Informations financières
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Prix estimé
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedDelivery.estimatedPrice
                        ? formatPrice(selectedDelivery.estimatedPrice)
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Prix final
                    </label>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedDelivery.finalPrice
                        ? formatPrice(selectedDelivery.finalPrice)
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedDelivery.description && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Description
                  </h4>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedDelivery.description}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Données complètes (optionnel) */}
            {/* <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Données complètes de la commande
              </h4>
              <div className="text-sm bg-gray-50 p-4 rounded overflow-x-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(selectedDelivery, null, 2)}
                </pre>
              </div>
            </div> */}
          </div>
        </div>

        {/* Pied de page fixe */}
        <div className="p-6 border-t border-gray-200 shrink-0">
          <button
            onClick={closeDetailsModal}
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
