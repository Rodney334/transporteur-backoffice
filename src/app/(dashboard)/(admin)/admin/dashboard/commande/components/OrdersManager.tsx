// components/OrdersManager/OrdersManager.tsx - VERSION AVEC ZUSTAND
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Package, X, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import { Order } from "@/type/order.type";
import { Negotiation } from "@/type/order.type";
import { GrantedRole, OrderStatus, PaymentMethod } from "@/type/enum";

import { orderService } from "@/lib/services/order-service";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/Loading";
import { InfoSection, InfoColisSection } from "@/components/InfoSection";
import { useOrderStore, useOrderActions } from "@/lib/stores/order-store";

import {
  OrdersManagerProps,
  PriceFormData,
  ContactCourseInterface,
  DetailCourseInterface,
  FormattedCommandCard,
  FormattedDeliveryCard,
} from "./OrdersManager.types";
import { useOrderAssignment } from "@/hooks/use-order-assignment";
import { AssignOrderModal } from "./AssignOrderModal";

export const OrdersManager = ({
  userRole,
  tabs,
  defaultTab,
  cardComponent: CardComponent,
  shouldShowPriceForm,
  formatOrder,
  filterOrders,
  getEmptyMessage,
  headerTitle = "Commandes",
  showHeaderCounter = true,
  customHeader,
}: OrdersManagerProps) => {
  const { user } = useAuth();

  // Utilisation du store Zustand
  const { orders, loading, error, fetchOrders, getOrdersByTab, getStats } =
    useOrderStore();

  const { acceptOrder, rejectOrder, endOrder, validatePrice } =
    useOrderActions();

  // NOUVEAUX HOOKS
  const {
    livreurs,
    isAssigning,
    selectedOrder,
    openAssignmentModal,
    closeAssignmentModal,
    assignOrder,
    isLoadingLivreurs, // Nouvelle valeur
  } = useOrderAssignment();

  // États locaux
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedCommand, setSelectedCommand] = useState<Order | null>(null);
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [validatingPrice, setValidatingPrice] = useState(false);
  const [loadingNegotiation, setLoadingNegotiation] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [confirmationPrice, setConfirmationPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCommandForAssignment, setSelectedCommandForAssignment] =
    useState<FormattedCommandCard | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PriceFormData>();

  // Charger les commandes au montage
  useEffect(() => {
    if (user) {
      fetchOrders(user._id, userRole);
    }
  }, [user, userRole, fetchOrders]);

  const handleAssign = useCallback(
    async (command: FormattedCommandCard) => {
      setSelectedCommandForAssignment(command);
      openAssignmentModal(command.originalData.id);
      setIsAssignModalOpen(true);
    },
    [openAssignmentModal]
  );

  const executeAssignment = useCallback(
    async (livreurId: string, auto: boolean = true) => {
      if (!selectedOrder) return false;

      const success = await assignOrder(livreurId, auto);

      if (success) {
        // Rafraîchir les commandes
        if (user) {
          fetchOrders(user._id, userRole);
        }
        // Naviguer vers l'onglet "En cours"
        setActiveTab("En cours");
        setIsAssignModalOpen(false);
        setSelectedCommandForAssignment(null);
      }

      return success;
    },
    [selectedOrder, assignOrder, user, userRole, fetchOrders]
  );

  // Charger la négociation
  const fetchNegotiation = useCallback(async (orderId: string) => {
    try {
      setLoadingNegotiation(true);
      const negotiationData = await orderService.getOrderNegociationPrice(
        orderId
      );
      setNegotiation(negotiationData);
    } catch (err) {
      console.log("Error fetching negotiation:", err);
    } finally {
      setLoadingNegotiation(false);
    }
  }, []);

  // Effet pour la négociation
  useEffect(() => {
    if (selectedCommand) {
      setShowPriceForm(false);
      reset({ price: "" });
      fetchNegotiation(selectedCommand.id);
    } else {
      setNegotiation(null);
    }
  }, [selectedCommand, reset, fetchNegotiation]);

  // Commandes filtrées et formatées
  const filteredAndFormattedOrders = useMemo(() => {
    // Utilisation du sélecteur du store
    const filteredOrders = getOrdersByTab(activeTab, userRole, user?._id);
    return filteredOrders.map(formatOrder);
  }, [orders, activeTab, userRole, user?._id, getOrdersByTab, formatOrder]);

  // Handlers d'actions utilisant le store
  const handleAccept = useCallback(
    async (command: FormattedCommandCard | FormattedDeliveryCard) => {
      try {
        setProcessingAction(`accept-${command.id}`);
        await acceptOrder(command.originalData.id);
        toast.success("Commande acceptée avec succès !");
        setActiveTab("En cours");
      } catch (err: any) {
        console.log("Error accepting order:", err);
        toast.error(
          err.response?.data?.message || "Erreur lors de l'acceptation"
        );
      } finally {
        setProcessingAction(null);
      }
    },
    [acceptOrder]
  );

  const handleReject = useCallback(
    async (command: FormattedCommandCard | FormattedDeliveryCard) => {
      try {
        setProcessingAction(`reject-${command.id}`);
        await rejectOrder(command.originalData.id);
        toast.success("Commande rejetée avec succès !");
      } catch (err: any) {
        console.log("Error rejecting order:", err);
        toast.error(err.response?.data?.message || "Erreur lors du rejet");
      } finally {
        setProcessingAction(null);
      }
    },
    [rejectOrder]
  );

  const handleEnd = useCallback(
    async (command: FormattedCommandCard | FormattedDeliveryCard) => {
      try {
        setProcessingAction(`end-${command.id}`);
        await endOrder(command.originalData.id);
        toast.success("Commande terminée avec succès !");
        setActiveTab("Terminées");
      } catch (err: any) {
        console.log("Error ending order:", err);
        toast.error(
          err.response?.data?.message || "Erreur lors de la finalisation"
        );
      } finally {
        setProcessingAction(null);
      }
    },
    [endOrder]
  );

  const handleViewDetails = useCallback((command: any) => {
    setSelectedCommand(command.originalData);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCommand(null);
    reset();
  }, [reset]);

  const handlePriceValidation = (data: PriceFormData) => {
    setConfirmationPrice(data.price);
    setPaymentMethod(data.method || PaymentMethod.CASH);
    setShowConfirmationModal(true);
  };

  const handleConfirmPrice = useCallback(async () => {
    if (!selectedCommand) return;

    try {
      setShowConfirmationModal(false);
      setValidatingPrice(true);

      const price = parseInt(confirmationPrice, 10);

      if (userRole === "client") {
        await validatePrice(selectedCommand.id, price, paymentMethod);
      } else {
        await validatePrice(selectedCommand.id, price);
      }

      toast.success("Prix validé avec succès !");
      await fetchNegotiation(selectedCommand.id);
      reset();
    } catch (err: any) {
      console.log("Error validating price:", err);
      toast.error(
        err.response?.data?.message || "Erreur lors de la validation"
      );
    } finally {
      setValidatingPrice(false);
    }
  }, [
    selectedCommand,
    userRole,
    confirmationPrice,
    paymentMethod,
    validatePrice,
    fetchNegotiation,
    reset,
  ]);

  // Vérifier si une action est en cours
  const isCommandProcessing = useCallback(
    (commandId: string, action: string) => {
      return processingAction === `${action}-${commandId}`;
    },
    [processingAction]
  );

  // Données pour les sections d'information
  const contactData: ContactCourseInterface | null = useMemo(() => {
    if (!selectedCommand) return null;

    return {
      nom: selectedCommand.pickupAddress.name,
      telephone: selectedCommand.pickupAddress.phone,
      ville: selectedCommand.pickupAddress.city,
      quartier: selectedCommand.pickupAddress.district,
      rue: selectedCommand.pickupAddress.street,
      pays: selectedCommand.pickupAddress.country,
    };
  }, [selectedCommand]);

  const destinataireData: ContactCourseInterface | null = useMemo(() => {
    if (!selectedCommand) return null;

    return {
      nom: selectedCommand.deliveryAddress.name,
      telephone: selectedCommand.deliveryAddress.phone,
      ville: selectedCommand.deliveryAddress.city,
      quartier: selectedCommand.deliveryAddress.district,
      rue: selectedCommand.deliveryAddress.street,
      pays: selectedCommand.deliveryAddress.country,
    };
  }, [selectedCommand]);

  const detailsData: DetailCourseInterface | null = useMemo(() => {
    if (!selectedCommand) return null;

    return {
      serviceType: selectedCommand.serviceType,
      articleType: selectedCommand.articleType,
      transportMode: selectedCommand.transportMode,
      deliveryType: selectedCommand.deliveryType,
      weight: selectedCommand.weight,
      status: selectedCommand.status,
    };
  }, [selectedCommand]);

  const handleRetry = useCallback(() => {
    if (user) {
      fetchOrders(user._id, userRole);
    }
  }, [user, userRole, fetchOrders]);

  // Statistiques
  const stats = getStats();

  // États de chargement et d'erreur
  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 space-y-4">
        <div className="text-red-500 text-lg text-center">{error}</div>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-[#FD481A] text-white rounded-lg hover:bg-[#E63F15] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Rafraîchir la page
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-2xl p-6">
            {/* Header */}
            {customHeader || (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#FD481A] rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {headerTitle}
                </h2>
                {showHeaderCounter && (
                  <span className="ml-auto text-3xl font-bold text-gray-900">
                    {stats.total}
                  </span>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-6 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {`${tab} ${
                      activeTab === tab
                        ? `(${filteredAndFormattedOrders.length})`
                        : ""
                    }`}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste des commandes */}
            <div className="space-y-3">
              {filteredAndFormattedOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {getEmptyMessage(activeTab, user)}
                </div>
              ) : (
                filteredAndFormattedOrders.map(
                  (command: FormattedCommandCard) => (
                    <div key={command.id}>
                      {userRole === "client" ? (
                        // Version client - DeliveryCard simple
                        <CardComponent
                          item={command}
                          onViewDetails={() => handleViewDetails(command)}
                        />
                      ) : (
                        // Version admin/livreur - CommandCard avec actions
                        <CardComponent
                          item={command}
                          activeTab={activeTab}
                          userRole={userRole}
                          onAccept={() => handleAccept(command)}
                          onReject={() => handleReject(command)}
                          onEnd={() => handleEnd(command)}
                          onAssign={
                            userRole === GrantedRole.Admin ||
                            userRole === GrantedRole.Operateur
                              ? () => handleAssign(command)
                              : undefined
                          }
                          onViewDetails={() => handleViewDetails(command)}
                          isProcessingAccept={isCommandProcessing(
                            command.id,
                            "accept"
                          )}
                          isProcessingReject={isCommandProcessing(
                            command.id,
                            "reject"
                          )}
                          isProcessingEnd={isCommandProcessing(
                            command.id,
                            "end"
                          )}
                          isProcessingAssign={isCommandProcessing(
                            command.id,
                            "assign"
                          )}
                        />
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>

        {/* Modal pour les détails */}
        {isModalOpen && (
          <div className="w-96 fixed z-50 bg-white shadow-2xl rounded-2xl transition-all duration-300 ease-in-out inset-y-4 left-auto h-[95vh] right-4 flex flex-col border border-gray-100">
            {/* Header du modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl z-10 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Détails de la Commande
                  </h2>
                  {selectedCommand && (
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCommand.pickupAddress.city} →{" "}
                      {selectedCommand.deliveryAddress.city}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Section Prix */}
                {selectedCommand && (
                  <div className="bg-linear-to-r from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Prix & Estimation
                    </h3>
                    <div className="space-y-3">
                      {/* Prix estimé */}
                      <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">
                          Estimation du prix :
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {selectedCommand.estimatedPrice
                            ? `${selectedCommand.estimatedPrice} FCFA`
                            : "Non estimé"}
                        </span>
                      </div>

                      {/* Prix livreur */}
                      {negotiation?.proposedByCourier && (
                        <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-xl border border-blue-200">
                          <span className="text-sm font-medium text-blue-700">
                            Prix livreur :
                          </span>
                          <span className="text-sm font-bold text-blue-800">
                            {negotiation.proposedByCourier} FCFA
                          </span>
                        </div>
                      )}

                      {/* Prix client confirmé */}
                      {negotiation?.confirmedByClient && (
                        <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-xl border border-green-200">
                          <span className="text-sm font-medium text-green-700">
                            Prix client :
                          </span>
                          <span className="text-sm font-bold text-green-800">
                            {negotiation.confirmedByClient} FCFA
                          </span>
                        </div>
                      )}

                      {/* Chargement */}
                      {loadingNegotiation && (
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FD481A]"></div>
                          <span className="text-sm text-gray-500 ml-3">
                            Chargement des prix...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sections Informations */}
                <div className="space-y-5">
                  <InfoSection title="Contact Envoyeur" data={contactData} />
                  <InfoSection
                    title="Contact Destinataire"
                    data={destinataireData}
                  />
                  <InfoColisSection
                    title="Détails du Colis"
                    data={detailsData}
                  />
                </div>
              </div>
            </div>

            {/* Formulaire de prix */}
            {loadingNegotiation ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FD481A]"></div>
                <span className="text-sm text-gray-500 ml-3">
                  Chargement des prix...
                </span>
              </div>
            ) : (
              shouldShowPriceForm(negotiation, activeTab) && (
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 shrink-0">
                  {!showPriceForm ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowPriceForm(true)}
                        className="px-3 py-2 bg-linear-to-r from-[#FD481A] to-[#E63F15] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        {userRole === "client" ? "Prix client" : "Prix livreur"}
                      </button>
                    </div>
                  ) : (
                    <div className="relative bg-linear-to-r from-orange-50 to-red-50 rounded-2xl p-5 pt-2 border border-orange-200 shadow-sm">
                      {/* <div className="flex items-center justify-between">
                       </div> */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Proposer un prix
                      </h3>
                      <X
                        className={`w-8 h-8 font-bold text-[#131313] hover:rotate-180 duration-500 absolute top-1 right-1`}
                        onClick={() => setShowPriceForm(false)}
                      />
                      <form
                        onSubmit={handleSubmit(handlePriceValidation)}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Champ Prix */}
                          <div className="space-y-2">
                            <label
                              htmlFor="price"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Prix (
                              {userRole === "client" ? "client" : "livreur"})
                              (FCFA)
                            </label>
                            <input
                              type="text"
                              id="price"
                              className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200 ${
                                errors.price
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              placeholder="Ex: 15000"
                              {...register("price", {
                                required: "Le prix est requis",
                                validate: {
                                  isInteger: (value) => {
                                    if (!value) return true;
                                    const numberValue = parseInt(value, 10);
                                    return !isNaN(numberValue) &&
                                      Number.isInteger(numberValue) &&
                                      numberValue > 0
                                      ? true
                                      : "Veuillez entrer un nombre entier positif";
                                  },
                                },
                              })}
                            />
                            {errors.price && (
                              <p className="text-xs text-red-500 font-medium">
                                {errors.price.message}
                              </p>
                            )}
                          </div>

                          {/* Sélecteur Méthode de Paiement (seulement pour les clients) */}
                          {userRole === "client" && (
                            <div className="space-y-2">
                              <label
                                htmlFor="paymentMethod"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Méthode de paiement
                              </label>
                              <select
                                id="paymentMethod"
                                className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200 appearance-none bg-white ${
                                  errors.method
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                {...register("method", {
                                  required:
                                    "La méthode de paiement est requise",
                                })}
                              >
                                <option value="">
                                  Sélectionnez une méthode
                                </option>
                                <option value={PaymentMethod.CASH}>
                                  Espèces
                                </option>
                                <option value={PaymentMethod.MOBILE_MONEY}>
                                  Mobile Money
                                </option>
                                <option value={PaymentMethod.CARD}>
                                  Carte bancaire
                                </option>
                              </select>
                              {errors.method && (
                                <p className="text-xs text-red-500 font-medium">
                                  {errors.method.message}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Bouton de validation */}
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={
                              validatingPrice ||
                              isSubmitting ||
                              loadingNegotiation
                            }
                            className="px-8 py-3 bg-linear-to-r from-[#FD481A] to-[#E63F15] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none min-w-32 flex items-center justify-center gap-2"
                          >
                            {validatingPrice ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Validation</span>
                              </>
                            ) : (
                              `Valider le prix`
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Modal de Confirmation */}
        {showConfirmationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Confirmer le prix
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Cette action est irréversible
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-red-800 font-medium text-center">
                    Êtes-vous sûr de vouloir{" "}
                    {userRole === "client" ? "accepter" : "proposer"} le prix de{" "}
                    <br />
                    <span className="text-lg font-bold">
                      {confirmationPrice} FCFA
                    </span>{" "}
                    ?
                  </p>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Une fois validé, vous ne pourrez plus modifier ce prix.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmPrice}
                  disabled={validatingPrice}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-[#FD481A] to-[#E63F15] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                >
                  {validatingPrice ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Validation</span>
                    </div>
                  ) : (
                    "Confirmer"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {(userRole === GrantedRole.Admin ||
          userRole === GrantedRole.Operateur) && (
          <>
            <AssignOrderModal
              isOpen={isAssignModalOpen}
              onClose={() => {
                setIsAssignModalOpen(false);
                closeAssignmentModal();
                setSelectedCommandForAssignment(null);
              }}
              onAssign={executeAssignment}
              livreurs={livreurs}
              isAssigning={isAssigning}
              isLoadingLivreurs={isLoadingLivreurs} // Passer l'état de chargement
              orderReference={selectedCommandForAssignment?.reference}
            />
          </>
        )}
      </div>
    </>
  );
};
