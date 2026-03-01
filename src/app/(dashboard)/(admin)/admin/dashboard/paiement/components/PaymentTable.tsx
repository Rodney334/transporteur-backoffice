"use client";

import { useState } from "react";
import {
  User,
  Truck,
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Package,
} from "lucide-react";
import { Payment } from "../types/payment.type";
import { usePayments } from "../hooks/use-payments";
import { PaymentMethod, PaymentStatus } from "@/type/enum";

interface PaymentTableProps {
  payments: Payment[];
  isLoading: boolean;
  visibleColumns: {
    client: boolean;
    deliverer: boolean;
    amount: boolean;
    method: boolean;
    status: boolean;
    date: boolean;
    orderId: boolean;
  };
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
  formatPaymentMethod: (method: PaymentMethod) => string;
  formatPaymentStatus: (status: PaymentStatus) => string;
  getStatusColor: (status: PaymentStatus) => string;
  getMethodColor: (method: PaymentMethod) => string;
  onMarkAsPaid: (paymentId: string) => void;
  onDelete: (paymentId: string, clientName: string, amount: number) => void;
}

export default function PaymentTable({
  payments,
  isLoading,
  visibleColumns,
  formatPrice,
  formatDate,
  formatPaymentMethod,
  formatPaymentStatus,
  getStatusColor,
  getMethodColor,
  onMarkAsPaid,
  onDelete,
}: PaymentTableProps) {
  const { openDetailsModal, deliverers } = usePayments();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (paymentId: string) => {
    setExpandedCard(expandedCard === paymentId ? null : paymentId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A] mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des paiements...</p>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Aucun paiement trouvé
        </h3>
        <p className="text-gray-500 mt-1">Les paiements apparaîtront ici</p>
      </div>
    );
  }

  return (
    <>
      {/* Version Tableau pour écrans lg et plus grands */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {visibleColumns.client && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Client
                  </div>
                </th>
              )}
              {visibleColumns.deliverer && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Livreur
                  </div>
                </th>
              )}
              {visibleColumns.amount && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">Montant</div>
                </th>
              )}
              {visibleColumns.method && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Méthode
                  </div>
                </th>
              )}
              {visibleColumns.status && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              )}
              {visibleColumns.date && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </th>
              )}
              {visibleColumns.orderId && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Commande
                  </div>
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => {
              const deliverer = payment.order.assignedTo
                ? deliverers[payment.order.assignedTo]
                : null;

              return (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {visibleColumns.client && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-r from-blue-500 to-blue-400 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {payment.client?.name?.charAt(0)?.toUpperCase() ||
                              "C"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.client?.name || "Client inconnu"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.client?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.deliverer && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {deliverer ? (
                        <div className="flex items-center">
                          <div className="shrink-0 h-8 w-8 rounded-full bg-linear-to-r from-green-500 to-green-400 flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-medium">
                              {deliverer.name?.charAt(0)?.toUpperCase() || "L"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-900">
                            {deliverer.name}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Non assigné
                        </span>
                      )}
                    </td>
                  )}
                  {visibleColumns.amount && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(payment.amount)}
                      </div>
                    </td>
                  )}
                  {visibleColumns.method && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getMethodColor(
                          payment.method,
                        )}`}
                      >
                        {formatPaymentMethod(payment.method)}
                      </span>
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          payment.status,
                        )}`}
                      >
                        {formatPaymentStatus(payment.status)}
                      </span>
                    </td>
                  )}
                  {visibleColumns.date && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                  )}
                  {visibleColumns.orderId && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.order.id?.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.order.serviceType}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetailsModal(payment)}
                        className="cursor-pointer px-3 py-1.5 text-xs font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                      >
                        Détails
                      </button>
                      {payment.status === "pending" && (
                        <button
                          onClick={() => onMarkAsPaid(payment.id)}
                          className="cursor-pointer px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                          Marquer payé
                        </button>
                      )}
                      <button
                        onClick={() =>
                          onDelete(
                            payment.id,
                            payment.client?.name || "Client",
                            payment.amount,
                          )
                        }
                        className="cursor-pointer px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Version Cartes pour écrans md et plus petits */}
      <div className="lg:hidden space-y-4 p-4">
        {payments.map((payment) => {
          const deliverer = payment.order.assignedTo
            ? deliverers[payment.order.assignedTo]
            : null;

          return (
            <div
              key={payment.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* En-tête de la carte */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCard(payment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-blue-400 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {payment.client?.name?.charAt(0)?.toUpperCase() || "C"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {payment.client?.name || "Client inconnu"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            payment.status,
                          )}`}
                        >
                          {formatPaymentStatus(payment.status)}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {formatPrice(payment.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedCard === payment.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Informations basiques toujours visibles */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visibleColumns.deliverer && deliverer && (
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Livreur</p>
                        <p className="text-sm text-gray-700">
                          {deliverer.name}
                        </p>
                      </div>
                    </div>
                  )}
                  {visibleColumns.method && (
                    <div className="flex items-start gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Méthode</p>
                        <p className="text-sm text-gray-700">
                          {formatPaymentMethod(payment.method)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contenu dépliable */}
              {expandedCard === payment.id && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  {/* Informations détaillées */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleColumns.date && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Date
                        </label>
                        <div className="text-sm text-gray-600">
                          {formatDate(payment.createdAt)}
                        </div>
                      </div>
                    )}
                    {visibleColumns.orderId && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          <Package className="w-3 h-3 inline mr-1" />
                          Commande
                        </label>
                        <div className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded">
                          {payment.order.id?.slice(-12)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openDetailsModal(payment)}
                      className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Détails complets
                    </button>
                    {payment.status === "pending" && (
                      <button
                        onClick={() => onMarkAsPaid(payment.id)}
                        className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        Marquer payé
                      </button>
                    )}
                    <button
                      onClick={() =>
                        onDelete(
                          payment.id,
                          payment.client?.name || "Client",
                          payment.amount,
                        )
                      }
                      className="cursor-pointer col-span-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      Supprimer le paiement
                    </button>
                  </div>
                </div>
              )}

              {/* Bouton d'action visible même quand la carte n'est pas dépliée */}
              {!expandedCard && (
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openDetailsModal(payment)}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Détails
                    </button>
                    {payment.status === "pending" && (
                      <button
                        onClick={() => onMarkAsPaid(payment.id)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        Marquer payé
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
