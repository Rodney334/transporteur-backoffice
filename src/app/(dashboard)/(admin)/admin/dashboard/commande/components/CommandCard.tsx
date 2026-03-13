// components/CommandCard.tsx - VERSION MISE À JOUR
import { memo, useState } from "react";
import { CommandCardProps } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager.types";
import { GrantedRole, OrderStatus, PaymentStatus } from "@/type/enum";
import { toast } from "react-toastify";
import { Payment } from "@/type/order.type";
import { paymentService } from "@/lib/services/payment-service";
import { useOrderStore } from "@/lib/stores/order-store";
import { OrderStatusStepper } from "@/components/OrderStatusStepper";
import { getStatusDisplayText, getStatusColorClass } from "./OrdersManager.utils";

export const CommandCard = memo(function CommandCard({
  activeTab,
  item,
  // onReject,
  onAccept,
  onEnd,
  onAssign,
  onCancel,
  onViewDetails,
  isProcessingAccept = false,
  // isProcessingReject = false,
  isProcessingEnd = false,
  isProcessingAssign = false,
  isProcessingCancel = false,
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

  const canCancel =
    ((userRole === GrantedRole.Client || userRole === GrantedRole.Admin) &&
      !item.originalData.assignedTo) ||
    (userRole === GrantedRole.Livreur &&
      item.originalData.status !== OrderStatus.LIVREE);

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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
            Référence
          </div>
          <div className="text-lg font-black text-[#FD481A] leading-none mb-2">
            #{item.reference}
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
              {item.date}
            </span>
            <span
              className={`capitalize px-2 py-1 rounded-md ${getStatusColorClass(
                item.originalData.status as OrderStatus,
              )}`}
            >
              {getStatusDisplayText(item.originalData.status as OrderStatus)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={() => onViewDetails(item)}
            className="w-full sm:w-auto cursor-pointer text-xs font-black text-white bg-[#FD481A] px-4 py-2.5 rounded-xl hover:bg-[#E63F15] transition-all shadow-sm shadow-orange-50 uppercase tracking-tighter"
          >
            Prix et Détails
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
                      : undefined,
                  );
                }}
                className={`${
                  paidLoading && "animate-pulse"
                } w-full sm:w-auto cursor-pointer text-xs font-black text-white bg-[#131313] px-4 py-2.5 rounded-xl hover:bg-black/80 transition-all uppercase tracking-tighter`}
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
      {activeTab !== "Échouées" && activeTab !== "En conflit" && (
        <div className="flex flex-col sm:flex-row gap-3">
        {activeTab === "Nouvelles" && onAccept && (
          <button
            onClick={() => onAccept(item)}
            disabled={isProcessingAccept || isActionLocked}
            className={`flex-1 py-3.5 px-6 bg-[#FD481A] text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-orange-100 ${
              isProcessingAccept || isActionLocked
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#E63F15] hover:shadow-lg active:scale-[0.98]"
            }`}
          >
            {isProcessingAccept
              ? "Chargement..."
              : isActionLocked
                ? "Verrouillé"
                : "Accepter la course"}
          </button>
        )}

        {activeTab === "En cours" &&
          item.originalData.status === OrderStatus.EN_LIVRAISON &&
          onEnd && (
            <button
              onClick={() => onEnd(item)}
              disabled={isProcessingEnd}
              className={`flex-1 py-3.5 px-6 bg-[#FD481A] text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-orange-100 ${
                isProcessingEnd
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#E63F15] hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              {isProcessingEnd ? "Chargement..." : "Terminer la course"}
            </button>
          )}

        {canAssign && isPendingAndAssignable && onAssign && (
          <button
            onClick={() => onAssign(item)}
            disabled={isProcessingAssign || isActionLocked}
            className={`flex-1 py-3.5 px-6 bg-[#131313] text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-black/20 ${
              isProcessingAssign || isActionLocked
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-black hover:shadow-lg active:scale-[0.98]"
            }`}
          >
            {isProcessingAssign
              ? "Chargement..."
              : isActionLocked
                ? "Action verrouillée"
                : "Assigner à un livreur"}
          </button>
        )}

        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(item)}
            disabled={isProcessingCancel}
            className={`flex-1 py-3.5 px-6 bg-red-50 text-red-600 text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-md border border-red-100 ${
              isProcessingCancel
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-600 hover:text-white hover:shadow-lg active:scale-[0.98]"
            }`}
          >
            {isProcessingCancel ? "Traitement..." : "Annuler la course"}
          </button>
        )}
        </div>
      )}
    </div>
  );
});
