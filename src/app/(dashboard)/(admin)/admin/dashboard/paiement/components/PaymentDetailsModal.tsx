"use client";

import {
  X,
  CreditCard,
  User,
  Truck,
  DollarSign,
  Calendar,
  Package,
  MapPin,
} from "lucide-react";
import { usePayments } from "../hooks/use-payments";

export default function PaymentDetailsModal() {
  const {
    selectedPayment,
    deliverers,
    closeDetailsModal,
    formatAddress,
    formatPrice,
    formatDate,
    formatPaymentMethod,
    formatPaymentStatus,
    getStatusColor,
    getMethodColor,
  } = usePayments();

  if (!selectedPayment) return null;

  const deliverer = selectedPayment.order.assignedTo
    ? deliverers[selectedPayment.order.assignedTo]
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* En-tête fixe */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Détails du paiement
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Paiement #{selectedPayment.id?.slice(-8)}
                </p>
              </div>
            </div>
            <button
              onClick={closeDetailsModal}
              className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Section 1: Informations du paiement */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Informations du paiement
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de création
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(selectedPayment.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Statut
                  </label>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      selectedPayment.status
                    )}`}
                  >
                    {formatPaymentStatus(selectedPayment.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Méthode
                  </label>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getMethodColor(
                      selectedPayment.method
                    )}`}
                  >
                    {formatPaymentMethod(selectedPayment.method)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Montant
                  </label>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(selectedPayment.amount)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    ID Paiement
                  </label>
                  <div className="text-xs font-mono text-gray-500 bg-gray-100 p-2 rounded">
                    {selectedPayment.id}
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
                {selectedPayment.client && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Nom complet
                      </label>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedPayment.client.name}
                      </div>
                    </div>
                    {selectedPayment.client.email && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        <div className="text-sm text-gray-700">
                          {selectedPayment.client.email}
                        </div>
                      </div>
                    )}
                    {selectedPayment.client.phoneNumber && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Téléphone
                        </label>
                        <div className="text-sm text-gray-700">
                          {selectedPayment.client.phoneNumber}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Rôle
                      </label>
                      <div className="text-sm text-gray-700">
                        {selectedPayment.client.role}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Livreur */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Informations livreur
                </h4>
                {deliverer ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Nom complet
                      </label>
                      <div className="text-sm font-medium text-gray-900">
                        {deliverer.name}
                      </div>
                    </div>
                    {deliverer.email && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        <div className="text-sm text-gray-700">
                          {deliverer.email}
                        </div>
                      </div>
                    )}
                    {deliverer.phoneNumber && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Téléphone
                        </label>
                        <div className="text-sm text-gray-700">
                          {deliverer.phoneNumber}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Rôle
                      </label>
                      <div className="text-sm text-gray-700">
                        {deliverer.role}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Livreur non assigné ou informations non disponibles
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Informations de la commande */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Informations de la commande
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      ID Commande
                    </label>
                    <div className="text-sm text-gray-900 font-mono">
                      {selectedPayment.order.id}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Statut de la commande
                    </label>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {selectedPayment.order.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Type de service
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPayment.order.serviceType}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Type d'article
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPayment.order.articleType}
                    </div>
                  </div>
                </div>

                {/* Adresses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  {/* Adresse de départ */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      Adresse de départ
                    </h5>
                    {selectedPayment.order.pickupAddress ? (
                      <div className="text-sm text-gray-700">
                        {formatAddress(selectedPayment.order.pickupAddress)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Adresse non spécifiée
                      </div>
                    )}
                  </div>

                  {/* Adresse d'arrivée */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      Adresse d'arrivée
                    </h5>
                    {selectedPayment.order.deliveryAddress ? (
                      <div className="text-sm text-gray-700">
                        {formatAddress(selectedPayment.order.deliveryAddress)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Adresse non spécifiée
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Poids
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPayment.order.weight} kg
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Type de livraison
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPayment.order.deliveryType}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Mode de transport
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPayment.order.transportMode}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Informations financières */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Informations financières
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Prix final de la commande
                      </label>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedPayment.order.finalPrice
                          ? formatPrice(selectedPayment.order.finalPrice)
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Prix estimé
                      </label>
                      <div className="text-sm text-gray-700">
                        {selectedPayment.order.estimatedPrice
                          ? formatPrice(selectedPayment.order.estimatedPrice)
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedPayment.order.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Description de la commande
                    </label>
                    <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                      {selectedPayment.order.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page fixe */}
        <div className="p-6 border-t border-gray-200 shrink-0">
          <button
            onClick={closeDetailsModal}
            className="cursor-pointer w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
