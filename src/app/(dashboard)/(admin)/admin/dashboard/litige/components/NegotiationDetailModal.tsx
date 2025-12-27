// components/negotiations/NegotiationDetailModal.tsx
import { ExtendedNegotiation } from "../use-negotiation-management";
import {
  X,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Phone,
  Mail,
  Award,
} from "lucide-react";
import { NegotiationStatus, PaymentMethod } from "@/type/enum";

interface NegotiationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: ExtendedNegotiation | null;
}

export const NegotiationDetailModal = ({
  isOpen,
  onClose,
  negotiation,
}: NegotiationDetailModalProps) => {
  if (!isOpen || !negotiation) return null;

  const getStatusLabel = (status: NegotiationStatus) => {
    switch (status) {
      case NegotiationStatus.EN_CONFLIT:
        return "En conflit";
      case NegotiationStatus.EN_ATTENTE:
        return "En attente";
      case NegotiationStatus.EN_DISCUSSION:
        return "En discussion";
      case NegotiationStatus.PRIX_VALIDE:
        return "Prix validé";
      case NegotiationStatus.ARBITRE:
        return "Arbitré";
      default:
        return status;
    }
  };

  const getStatusColor = (status: NegotiationStatus) => {
    switch (status) {
      case NegotiationStatus.EN_CONFLIT:
        return "text-red-600 bg-red-50 border-red-200";
      case NegotiationStatus.EN_ATTENTE:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case NegotiationStatus.EN_DISCUSSION:
        return "text-blue-600 bg-blue-50 border-blue-200";
      case NegotiationStatus.PRIX_VALIDE:
        return "text-green-600 bg-green-50 border-green-200";
      case NegotiationStatus.ARBITRE:
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod | null) => {
    if (!method) return "Non spécifié";
    switch (method) {
      case PaymentMethod.CASH:
        return "Espèces";
      case PaymentMethod.MOBILE_MONEY:
        return "Mobile Money";
      case PaymentMethod.CARD:
        return "Carte bancaire";
      default:
        return method;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header fixe */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-[#FD481A]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#131313]">
                  Détails du Litige
                </h2>
                <p className="text-sm text-[#333333] mt-1">
                  Commande #{negotiation.order.id.slice(0, 8)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-[#FD481A]" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Informations générales */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Informations Générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Date création
                    </span>
                  </div>
                  <p className="text-gray-900">
                    {new Date(negotiation.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Statut
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      negotiation.status
                    )}`}
                  >
                    {getStatusLabel(negotiation.status)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Méthode de paiement
                    </span>
                  </div>
                  <p className="text-gray-900">
                    {getPaymentMethodLabel(negotiation.paymentMethod)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Arbitrage admin
                    </span>
                  </div>
                  <p className="text-gray-900">
                    {negotiation.adminOverride ? "Oui" : "Non"}
                  </p>
                </div>
              </div>
            </div>

            {/* Prix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Prix livreur
                    </h4>
                    <p className="text-2xl font-bold text-blue-700">
                      {negotiation.proposedByCourier
                        ? `${negotiation.proposedByCourier} FCFA`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Prix client
                    </h4>
                    <p className="text-2xl font-bold text-green-700">
                      {negotiation.confirmedByClient
                        ? `${negotiation.confirmedByClient} FCFA`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Écart</h4>
                    <p className="text-2xl font-bold text-gray-700">
                      {negotiation.proposedByCourier &&
                      negotiation.confirmedByClient
                        ? `${Math.abs(
                            negotiation.proposedByCourier -
                              negotiation.confirmedByClient
                          )} FCFA`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information livreur */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Information Livreur
              </h3>
              {negotiation.livreur ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-[#FD481A]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {negotiation.livreur.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {negotiation.livreur.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {negotiation.livreur.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {negotiation.livreur.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Aucun livreur assigné à cette commande
                  </p>
                </div>
              )}
            </div>

            {/* Information commande */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Information Commande
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Point de départ
                    </h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {negotiation.order.pickupAddress.city}
                        </p>
                        <p className="text-sm text-gray-500">
                          {negotiation.order.pickupAddress.district}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FD481A]" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {negotiation.order.deliveryAddress.city}
                        </p>
                        <p className="text-sm text-gray-500">
                          {negotiation.order.deliveryAddress.district}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Type service
                    </h4>
                    <p className="text-gray-900">
                      {negotiation.order.serviceType}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Poids
                    </h4>
                    <p className="text-gray-900">
                      {negotiation.order.weight} kg
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Prix estimé
                    </h4>
                    <p className="text-gray-900">
                      {negotiation.order.estimatedPrice
                        ? `${negotiation.order.estimatedPrice} FCFA`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dernière mise à jour */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Dernière Mise à Jour
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {negotiation.updatedBy.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(negotiation.updatedAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer fixe */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 rounded-b-2xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
