// components/negotiations/NegotiationTable.tsx
import { NegotiationStatus, GrantedRole } from "@/type/enum";
import { ExtendedNegotiation } from "../use-negotiation-management";
import { User, DollarSign, Calendar, MapPin, AlertCircle } from "lucide-react";

interface NegotiationTableProps {
  negotiations: ExtendedNegotiation[];
  filteredNegotiations: ExtendedNegotiation[];
  isLoading: boolean;
  canResolve: boolean;
  onViewDetails: (negotiation: ExtendedNegotiation) => void;
  onResolve: (negotiation: ExtendedNegotiation) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const NegotiationTable = ({
  negotiations,
  filteredNegotiations,
  isLoading,
  canResolve,
  onViewDetails,
  onResolve,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
}: NegotiationTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A]"></div>
      </div>
    );
  }

  if (negotiations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun litige trouvé
        </h3>
        <p className="text-gray-500">
          Aucune négociation ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: NegotiationStatus) => {
    switch (status) {
      case NegotiationStatus.EN_CONFLIT:
        return "bg-red-100 text-red-800 border-red-200";
      case NegotiationStatus.EN_ATTENTE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case NegotiationStatus.EN_DISCUSSION:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case NegotiationStatus.PRIX_VALIDE:
        return "bg-green-100 text-green-800 border-green-200";
      case NegotiationStatus.ARBITRE:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trajet
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livreur
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix proposé
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {negotiations.map((negotiation) => (
                <tr
                  key={negotiation.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{negotiation.order.id.slice(0, 8)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {negotiation.order.serviceType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {negotiation.order.pickupAddress.city}
                        </div>
                        <div className="text-xs text-gray-500">
                          → {negotiation.order.deliveryAddress.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {negotiation.livreur ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-[#FD481A]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {negotiation.livreur.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {negotiation.livreur.phoneNumber}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {negotiation.proposedByCourier ? (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {negotiation.proposedByCourier} FCFA
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {negotiation.confirmedByClient ? (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {negotiation.confirmedByClient} FCFA
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        negotiation.status
                      )}`}
                    >
                      {getStatusLabel(negotiation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(negotiation.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewDetails(negotiation)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Détails
                      </button>
                      {canResolve &&
                        negotiation.status === NegotiationStatus.EN_CONFLIT && (
                          <button
                            onClick={() => onResolve(negotiation)}
                            className="px-3 py-1.5 bg-[#FD481A] text-white text-xs font-medium rounded-lg hover:bg-[#E63F15] transition-colors"
                          >
                            Résoudre
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-sm text-gray-700">
            Affichage de{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            à{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            sur <span className="font-medium">{totalItems}</span> résultats
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? "bg-[#FD481A] text-white"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </>
  );
};
