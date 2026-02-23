// components/CommandCard.tsx - VERSION MISE À JOUR
import { memo, useState } from "react";
import { CommandCardProps } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager.types";
import { GrantedRole, OrderStatus, PaymentStatus } from "@/type/enum";
import { toast } from "react-toastify";
import { Payment } from "@/type/order.type";
import { paymentService } from "@/lib/services/payment-service";
import { useOrderStore } from "@/lib/stores/order-store";
import { OrderStatusStepper } from "@/components/OrderStatusStepper";

export const CommandCard = memo(function CommandCard({
  activeTab,
  item,
  // onReject,
  onAccept,
  onEnd,
  onAssign,
  onViewDetails,
  isProcessingAccept = false,
  // isProcessingReject = false,
  isProcessingEnd = false,
  isProcessingAssign = false,
  userRole,
}: CommandCardProps) {
  const { fetchOrders } = useOrderStore();
  // Vérifier si l'utilisateur peut assigner (Admin ou Opérateur)
  const canAssign =
    userRole === GrantedRole.Admin || userRole === GrantedRole.Operateur;

  // Vérifier si la commande est en attente et peut être assignée
  const isPendingAndAssignable =
    activeTab === "Nouvelles" &&
    item.originalData.status === OrderStatus.EN_ATTENTE;

  // Vérifier si l'action est verrouillée pour une course programmée
  const isActionLocked = !!(
    item.originalData.isScheduled &&
    item.originalData.scheduledAt &&
    new Date(item.originalData.scheduledAt) > new Date()
  );

  const [paidLoading, setPaidLoading] = useState(false);
  const handlePaid = async (data?: Payment) => {
    if (!data) {
      alert("Pas de paiement disponible.");
      return;
    }
    setPaidLoading(true);
    const toastId = toast.loading("Chargement");
    try {
      const response = await paymentService.markAsPaid(data.id);
      console.log("response : ", response);
      toast.update(toastId, {
        render: "Paiement avec succès !",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      fetchOrders();
    } catch (error) {
      console.log("error: ", error);
      toast.update(toastId, {
        render: "L'opération a échoué.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } finally {
      setPaidLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-[#FD481A] mb-1">
            Reference no : {item.reference}
          </div>
          <div className="flex gap-2 text-xs text-gray-400">
            <span>{item.date}</span>
            <span>|</span>
            <span
              className={`capitalize bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded-2xl ${item.originalData.status === OrderStatus.LIVREE
                ? "bg-green-500/10 text-green-700"
                : item.originalData.status === OrderStatus.EN_ATTENTE
                  ? "bg-orange-500/10 text-orange-700"
                  : item.originalData.status === OrderStatus.ECHEC
                    ? "bg-red-500/10 text-red-700"
                    : "bg-blue-500/10 text-blue-700"
                }`}
            >
              {item.originalData.status}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onViewDetails(item)}
            className="cursor-pointer text-sm font-medium text-gray-50 bg-[#FD481A] px-2 py-1 rounded hover:opacity-80 transition-colors"
          >
            Prix et Details
          </button>
          {(item.originalData.status === OrderStatus.EN_LIVRAISON ||
            item.originalData.status === OrderStatus.LIVREE) &&
            item.originalData.payments &&
            item.originalData.payments?.length > 0 &&
            item.originalData.payments[item.originalData.payments?.length - 1]
              .status === PaymentStatus.PENDING && (
              <button
                onClick={() => {
                  handlePaid(
                    item.originalData.payments &&
                      item.originalData.payments?.length > 0
                      ? item.originalData.payments[
                      item.originalData.payments?.length - 1
                      ]
                      : undefined
                  );
                }}
                className={`${paidLoading && "animate-pulse"
                  } cursor-pointer text-sm font-medium text-gray-50 bg-[#131313] px-2 py-1 rounded hover:opacity-80 transition-colors`}
                disabled={paidLoading}
              >
                {paidLoading ? "Traitement..." : "Paiement reçu"}
              </button>
            )}
        </div>
      </div>

      {/* Route */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            Depart : {item.departure}
          </span>
        </div>

        <div className="flex items-center gap-3 pl-2.5">
          <div className="w-0.5 h-8 bg-red-300"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            Arrivée : {item.arrival}
          </span>
        </div>
      </div>

      {/* Status Stepper */}
      <OrderStatusStepper currentStatus={item.originalData.status} />

      {/* Actions */}
      <div className="flex gap-3">
        {activeTab === "Nouvelles" && onAccept && (
          <button
            onClick={() => onAccept(item)}
            disabled={isProcessingAccept || isActionLocked}
            className={`cursor-pointer flex-1 py-2.5 px-4 bg-[#FD481A] text-white text-sm font-medium rounded-lg transition-colors ${(isProcessingAccept || isActionLocked)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#E63F15]"
              }`}
          >
            {isProcessingAccept ? "Traitement..." : isActionLocked ? "En attente de l'heure" : "Accepter"}
          </button>
        )}

        {activeTab === "En cours" &&
          item.originalData.status === OrderStatus.EN_LIVRAISON &&
          onEnd && (
            <button
              onClick={() => onEnd(item)}
              disabled={isProcessingEnd}
              className={`cursor-pointer flex-1 py-2.5 px-4 bg-[#FD481A] text-white text-sm font-medium rounded-lg transition-colors ${isProcessingEnd
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#E63F15]"
                }`}
            >
              {isProcessingEnd ? "Traitement..." : "Terminer"}
            </button>
          )}

        {canAssign && isPendingAndAssignable && onAssign && (
          <button
            onClick={() => onAssign(item)}
            disabled={isProcessingAssign || isActionLocked}
            className={`cursor-pointer flex-1 py-2.5 px-4 bg-[#131313] text-white text-sm font-medium rounded-lg transition-colors ${(isProcessingAssign || isActionLocked)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#333333]"
              }`}
          >
            {isProcessingAssign ? "Traitement..." : isActionLocked ? "Action verrouillée" : "Assigner"}
          </button>
        )}
      </div>
    </div>
  );
});
