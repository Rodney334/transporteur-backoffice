// page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ArrowUpRight, RefreshCw, X } from "lucide-react";

import { CommandCard } from "./components/CommandCard";
import { InfoColisSection, InfoSection } from "./components/InfoSection";
import { LoadingSpinner } from "@/components/Loading";

import { Order } from "@/type/order.type";
import { FormattedOrder } from "@/type/command-card.type";
import { GrantedRole, OrderStatus } from "@/type/enum";
import { Negotiation } from "@/type/order.type";

import { orderService } from "@/lib/services/order-service";
import { useAuth } from "@/hooks/use-auth";

// Interface pour le formulaire de prix
interface PriceFormData {
  livreurPrice: string;
}

export interface ContactCourseInterface {
  nom: string;
  telephone: string;
  ville: string;
  quartier: string;
  rue: string;
  pays: string;
}

export interface DetailCourseInterface {
  serviceType: string;
  articleType: string;
  transportMode: string;
  deliveryType: string;
  weight: number;
  status: OrderStatus;
}

// Mapping des statuts
const STATUS_MAPPING: Record<string, OrderStatus[]> = {
  Nouvelles: [OrderStatus.EN_ATTENTE],
  "En cours": [
    OrderStatus.ASSIGNEE,
    OrderStatus.EN_DISCUSSION,
    OrderStatus.PRIX_VALIDE,
    OrderStatus.EN_LIVRAISON,
  ],
  Terminées: [OrderStatus.LIVREE, OrderStatus.ECHEC],
};

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Nouvelles");
  const [selectedCommand, setSelectedCommand] = useState<Order | null>(null);
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [validatingPrice, setValidatingPrice] = useState(false);
  const [loadingNegotiation, setLoadingNegotiation] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PriceFormData>();

  const tabs = ["Nouvelles", "En cours", "Terminées"];

  // Fonction pour charger les commandes
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.getOrder();
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Une erreur est survenue. Veuillez rafraîchir la page.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour charger la négociation
  const fetchNegotiation = useCallback(async (orderId: string) => {
    try {
      setLoadingNegotiation(true);
      const negotiationData = await orderService.getOrderNegociationPrice(
        orderId
      );
      setNegotiation(negotiationData);
    } catch (err) {
      console.error("Error fetching negotiation:", err);
      // On ne montre pas d'erreur toast car c'est optionnel
    } finally {
      setLoadingNegotiation(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset du formulaire et chargement de la négociation quand la commande sélectionnée change
  useEffect(() => {
    if (selectedCommand) {
      reset({ livreurPrice: "" });
      fetchNegotiation(selectedCommand.id);
    } else {
      setNegotiation(null);
    }
  }, [selectedCommand, reset, fetchNegotiation]);

  // Formater les commandes pour l'affichage
  const formatOrderForDisplay = useCallback((order: Order): FormattedOrder => {
    return {
      id: order.id,
      reference: `#${order.id.slice(0, 8).toUpperCase()}`,
      date: new Date(order.createdAt).toLocaleString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      departure: order.pickupAddress.city,
      arrival: order.deliveryAddress.city,
      originalData: order,
    };
  }, []);

  // Fonction pour filtrer les commandes selon le rôle de l'utilisateur
  const filteredOrdersByRole = useMemo(() => {
    if (!user) return [];

    const isAdminOrOperateur =
      user.role === GrantedRole.Admin || user.role === GrantedRole.Operateur;

    const isLivreur = user.role === GrantedRole.Livreur;
    console.log({ isAdminOrOperateur, isLivreur });

    return orders.filter((order) => {
      // Pour admin et opérateur : toutes les commandes
      if (isAdminOrOperateur) {
        return true;
      }

      // Pour livreur : logique spécifique
      if (isLivreur) {
        const statuses = STATUS_MAPPING[activeTab] || [];
        const isInCurrentTab = statuses.includes(order.status as OrderStatus);

        if (!isInCurrentTab) return false;

        // Pour "Nouvelles" : toutes les commandes en attente
        if (activeTab === "Nouvelles") {
          return true;
        }

        // Pour "En cours" et "Terminées" : seulement les commandes assignées à ce livreur
        if (activeTab === "En cours" || activeTab === "Terminées") {
          return order.assignedTo === user._id;
        }
      }

      // Pour les autres rôles (client, user) : pas d'accès par défaut
      return false;
    });
  }, [orders, user, activeTab]);

  // Filtrer et formater les commandes selon l'onglet actif et le rôle
  const filteredAndFormattedOrders = useMemo(() => {
    return filteredOrdersByRole.map(formatOrderForDisplay);
  }, [filteredOrdersByRole, formatOrderForDisplay]);

  // Vérifier si le formulaire doit être affiché
  const shouldShowPriceForm = useMemo(() => {
    if (activeTab !== "En cours") return false;
    if (!negotiation) return true; // Si pas de négociation, on affiche le formulaire
    if (!negotiation.proposedByCourier) return false;
    return negotiation.proposedByCourier !== negotiation.confirmedByClient; // On n'affiche pas le formulaire si proposedByCourier a une valeur
  }, [activeTab, negotiation]);

  // Handler pour la validation du prix
  const handleValidatePrice = useCallback(
    async (data: PriceFormData) => {
      if (!selectedCommand) return;

      try {
        setValidatingPrice(true);

        // Convertir en nombre entier
        const price = parseInt(data.livreurPrice, 10);

        await orderService.validatePrice(selectedCommand.id, price);

        toast.success("Prix validé avec succès !", {
          position: "top-right",
        });

        // Rafraîchir la liste des commandes
        await fetchOrders();
        await fetchNegotiation(selectedCommand.id);

        // Reset du formulaire
        reset();
      } catch (err: any) {
        console.error("Error validating price:", err);
        const errorMessage =
          err.response?.data?.message || "Erreur lors de la validation du prix";
        toast.error(errorMessage, {
          position: "top-right",
        });
      } finally {
        setValidatingPrice(false);
      }
    },
    [selectedCommand, fetchOrders, reset]
  );

  // Handlers avec useCallback pour éviter les re-rendus
  const handleAccept = useCallback(
    async (command: FormattedOrder) => {
      try {
        setProcessingAction(`accept-${command.id}`);

        await orderService.acceptOrder(command.originalData.id);

        toast.success("Commande acceptée avec succès !", {
          position: "top-right",
        });

        // Rafraîchir la liste des commandes
        await fetchOrders();
        setActiveTab("En cours");
      } catch (err: any) {
        console.error("Error accepting order:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Erreur lors de l'acceptation de la commande";
        toast.error(errorMessage, { position: "top-right" });
      } finally {
        setProcessingAction(null);
      }
    },
    [fetchOrders]
  );

  const handleReject = useCallback(
    async (command: FormattedOrder) => {
      try {
        setProcessingAction(`reject-${command.id}`);

        await orderService.rejectOrder(command.originalData.id);

        toast.success("Commande rejetée avec succès !", {
          position: "top-right",
        });

        // Rafraîchir la liste des commandes
        await fetchOrders();
        setActiveTab("Nouvelles");
      } catch (err: any) {
        console.error("Error rejecting order:", err);
        const errorMessage =
          err.response?.data?.message || "Erreur lors du rejet de la commande";
        toast.error(errorMessage, { position: "top-right" });
      } finally {
        setProcessingAction(null);
      }
    },
    [fetchOrders]
  );

  const handleViewDetails = useCallback((command: FormattedOrder) => {
    orderService.getOrderNegociationPrice(command.originalData.id);
    setSelectedCommand(command.originalData);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCommand(null);
  }, []);

  const handleRetry = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Vérifier si une commande est en cours de traitement
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

  const getEmptyMessage = useCallback(() => {
    if (!user) return "Aucune commande disponible";

    const isLivreur = user.role === GrantedRole.Livreur;

    if (activeTab === "En cours" && isLivreur) {
      return "Aucune commande en cours vous étant assignée";
    }

    if (activeTab === "Terminées" && isLivreur) {
      return "Aucune commande terminée vous étant assignée";
    }

    return `Aucune commande ${activeTab.toLowerCase()}`;
  }, [user, activeTab]);

  // État de chargement
  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  // État d'erreur
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
        {/* Colonne unique - Liste des commandes */}
        <div className="lg:col-span-3">
          <div className="bg-gray-50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab} Commandes
                {user?.role === GrantedRole.Livreur &&
                  activeTab !== "Nouvelles" && (
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      (qui vous sont assignées)
                    </span>
                  )}
              </h1>
              <ArrowUpRight className="w-6 h-6 text-[#FD481A]" />
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs font-medium transition-colors relative ${
                    activeTab === tab
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Liste des commandes */}
            <div className="space-y-4">
              {filteredAndFormattedOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {getEmptyMessage()}
                </div>
              ) : (
                filteredAndFormattedOrders.map((command) => (
                  <CommandCard
                    activeTab={activeTab}
                    key={command.id}
                    command={command}
                    onReject={handleReject}
                    onAccept={handleAccept}
                    onViewDetails={handleViewDetails}
                    isProcessingAccept={isCommandProcessing(
                      command.id,
                      "accept"
                    )}
                    isProcessingReject={isCommandProcessing(
                      command.id,
                      "reject"
                    )}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        {/* Modal pour les détails */}
        {isModalOpen && (
          <div
            className={`
      w-96 fixed z-50 bg-white shadow-xl transition-all duration-300 ease-in-out inset-y-4 left-auto h-auto right-4 flex flex-col
    `}
          >
            {/* Header du modal - Fixe en haut */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10 shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de la Commande
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenu du modal - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Détails de la Commande */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-4">
                    Informations{" "}
                    {selectedCommand
                      ? `- ${selectedCommand.pickupAddress.city} → ${selectedCommand.deliveryAddress.city}`
                      : "Lieu de Départ"}
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                    <InfoSection title="Contact Envoyeur" data={contactData} />
                    <InfoColisSection
                      title="Details Colis"
                      data={detailsData}
                    />
                  </div>
                </div>

                {/* Détails du prix */}
                {selectedCommand && (
                  <div className="border-t border-gray-200 pt-2 space-y-2">
                    <div className="flex gap-2 p-2 bg-gray-50 rounded-lg">
                      <h3 className="text-xs font-bold text-gray-900">
                        Estimation du prix :
                      </h3>
                      <p className="text-xs">
                        {selectedCommand.estimatedPrice
                          ? `${selectedCommand.estimatedPrice} FCFA`
                          : "Non estimé"}
                      </p>
                    </div>

                    {/* Prix livreur (proposedByCourier) */}
                    {negotiation?.proposedByCourier && (
                      <div className="flex gap-2 bg-blue-50 rounded-lg p-2">
                        <h3 className="text-xs font-bold text-gray-900">
                          Prix proposé par le livreur :
                        </h3>
                        <p className="text-xs text-blue-700 font-semibold">
                          {negotiation.proposedByCourier} FCFA
                        </p>
                      </div>
                    )}

                    {/* Prix client (confirmedByClient) */}
                    {negotiation?.confirmedByClient && (
                      <div className="flex gap-2 bg-green-50 rounded-lg p-4">
                        <h3 className="text-xs font-bold text-gray-900">
                          Prix confirmé par le client :
                        </h3>
                        <p className="text-xs text-green-700 font-semibold">
                          {negotiation.confirmedByClient} FCFA
                        </p>
                      </div>
                    )}

                    {/* Chargement de la négociation */}
                    {loadingNegotiation && (
                      <div className="flex justify-center py-2">
                        <div className="text-xs text-gray-500">
                          Chargement des prix...
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Formulaire - Fixe en bas */}
            {shouldShowPriceForm && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shrink-0">
                <form
                  onSubmit={handleSubmit(handleValidatePrice)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="livreurPrice"
                      className="text-xs whitespace-nowrap"
                    >
                      Prix Livreur
                    </label>
                    <input
                      type="text"
                      id="livreurPrice"
                      className={`p-1 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
                        errors.livreurPrice
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Entrez un nombre entier"
                      {...register("livreurPrice", {
                        required: "Le prix est requis",
                        validate: {
                          isInteger: (value) => {
                            if (!value) return true; // Laisser required gérer le cas vide
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
                    <button
                      type="submit"
                      disabled={
                        validatingPrice || isSubmitting || loadingNegotiation
                      }
                      className="px-2 py-1 bg-[#FD481A] text-white rounded-lg hover:bg-[#E63F15] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs whitespace-nowrap"
                    >
                      {validatingPrice ? "Validation..." : "Valider"}
                    </button>
                  </div>
                  {errors.livreurPrice && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.livreurPrice.message}
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
