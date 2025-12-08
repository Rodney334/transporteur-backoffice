// app/(dashboard)/admin/dashboard/page.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { OrdersManager } from "@/app/(dashboard)/components/OrdersManager/OrdersManager";
import { CommandCard } from "@/app/(dashboard)/components/OrdersManager/CommandCard";
import { getAdminConfig } from "@/app/(dashboard)/components/OrdersManager/OrdersManager.utils";
import { GrantedRole } from "@/type/enum";

export default function AdminPage() {
  const { user } = useAuth();
  const adminConfig = getAdminConfig();

  return (
    <OrdersManager
      userRole={user?.role || GrantedRole.Admin}
      tabs={["Nouvelles", "En cours", "Terminées"]}
      defaultTab="Nouvelles"
      cardComponent={CommandCard}
      shouldShowPriceForm={adminConfig.shouldShowPriceForm}
      formatOrder={adminConfig.formatOrder}
      filterOrders={adminConfig.filterOrders}
      getEmptyMessage={adminConfig.getEmptyMessage}
      onAcceptOrder={adminConfig.onAcceptOrder}
      onRejectOrder={adminConfig.onRejectOrder}
      onEndOrder={adminConfig.onEndOrder}
      onValidatePrice={adminConfig.onValidatePrice}
      headerTitle="Gestion des Commandes"
      showHeaderCounter={false}
      customHeader={
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Commandes
            {user?.role === GrantedRole.Livreur && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                (qui vous sont assignées)
              </span>
            )}
          </h1>
        </div>
      }
    />
  );
}

// // page.tsx
// "use client";

// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { ArrowUpRight, RefreshCw, X } from "lucide-react";

// import { CommandCard } from "./components/CommandCard";
// import {
//   InfoColisSection,
//   InfoSection,
// } from "../../../../../components/InfoSection";
// import { LoadingSpinner } from "@/components/Loading";

// import { Order } from "@/type/order.type";
// import { FormattedOrder } from "@/type/command-card.type";
// import { GrantedRole, OrderStatus } from "@/type/enum";
// import { Negotiation } from "@/type/order.type";

// import { orderService } from "@/lib/services/order-service";
// import { useAuth } from "@/hooks/use-auth";

// // Interface pour le formulaire de prix
// interface PriceFormData {
//   livreurPrice: string;
// }

// export interface ContactCourseInterface {
//   nom: string;
//   telephone: string;
//   ville: string;
//   quartier: string;
//   rue: string;
//   pays: string;
// }

// export interface DetailCourseInterface {
//   serviceType: string;
//   articleType: string;
//   transportMode: string;
//   deliveryType: string;
//   weight: number;
//   status: OrderStatus;
// }

// // Mapping des statuts
// const STATUS_MAPPING: Record<string, OrderStatus[]> = {
//   Nouvelles: [OrderStatus.EN_ATTENTE],
//   "En cours": [
//     OrderStatus.ASSIGNEE,
//     OrderStatus.EN_DISCUSSION,
//     OrderStatus.PRIX_VALIDE,
//     OrderStatus.EN_LIVRAISON,
//   ],
//   Terminées: [OrderStatus.LIVREE, OrderStatus.ECHEC],
// };

// export default function AdminPage() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("Nouvelles");
//   const [selectedCommand, setSelectedCommand] = useState<Order | null>(null);
//   const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [processingAction, setProcessingAction] = useState<string | null>(null);
//   const [validatingPrice, setValidatingPrice] = useState(false);
//   const [loadingNegotiation, setLoadingNegotiation] = useState(false);
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
//   const [confirmationPrice, setConfirmationPrice] = useState("");

//   // React Hook Form
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<PriceFormData>();

//   const tabs = ["Nouvelles", "En cours", "Terminées"];

//   // Fonction pour charger les commandes
//   const fetchOrders = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const ordersData = await orderService.getOrder();
//       setOrders(ordersData);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError("Une erreur est survenue. Veuillez rafraîchir la page.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fonction pour charger la négociation
//   const fetchNegotiation = useCallback(async (orderId: string) => {
//     try {
//       setLoadingNegotiation(true);
//       const negotiationData = await orderService.getOrderNegociationPrice(
//         orderId
//       );
//       setNegotiation(negotiationData);
//     } catch (err) {
//       console.error("Error fetching negotiation:", err);
//       // On ne montre pas d'erreur toast car c'est optionnel
//     } finally {
//       setLoadingNegotiation(false);
//     }
//   }, []);

//   // Chargement initial
//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   // Reset du formulaire et chargement de la négociation quand la commande sélectionnée change
//   useEffect(() => {
//     if (selectedCommand) {
//       reset({ livreurPrice: "" });
//       fetchNegotiation(selectedCommand.id);
//     } else {
//       setNegotiation(null);
//     }
//   }, [selectedCommand, reset, fetchNegotiation]);

//   // Formater les commandes pour l'affichage
//   const formatOrderForDisplay = useCallback((order: Order): FormattedOrder => {
//     return {
//       id: order.id,
//       reference: `#${order.id.slice(0, 8).toUpperCase()}`,
//       date: new Date(order.createdAt).toLocaleString("fr-FR", {
//         hour: "2-digit",
//         minute: "2-digit",
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }),
//       departure: order.pickupAddress.city,
//       arrival: order.deliveryAddress.city,
//       originalData: order,
//     };
//   }, []);

//   // Fonction pour filtrer les commandes selon le rôle de l'utilisateur
//   const filteredOrdersByRole = useMemo(() => {
//     if (!user) return [];

//     const isAdminOrOperateur =
//       user.role === GrantedRole.Admin || user.role === GrantedRole.Operateur;

//     const isLivreur = user.role === GrantedRole.Livreur;
//     console.log({ isAdminOrOperateur, isLivreur });

//     return orders.filter((order) => {
//       // Pour admin et opérateur : toutes les commandes
//       if (isAdminOrOperateur) {
//         return true;
//       }

//       // Pour livreur : logique spécifique
//       if (isLivreur) {
//         const statuses = STATUS_MAPPING[activeTab] || [];
//         const isInCurrentTab = statuses.includes(order.status as OrderStatus);

//         if (!isInCurrentTab) return false;

//         // Pour "Nouvelles" : toutes les commandes en attente
//         if (activeTab === "Nouvelles") {
//           return true;
//         }

//         // Pour "En cours" et "Terminées" : seulement les commandes assignées à ce livreur
//         if (activeTab === "En cours" || activeTab === "Terminées") {
//           return order.assignedTo === user._id;
//         }
//       }

//       // Pour les autres rôles (client, user) : pas d'accès par défaut
//       return false;
//     });
//   }, [orders, user, activeTab]);

//   // Filtrer et formater les commandes selon l'onglet actif et le rôle
//   const filteredAndFormattedOrders = useMemo(() => {
//     return filteredOrdersByRole.map(formatOrderForDisplay);
//   }, [filteredOrdersByRole, formatOrderForDisplay]);

//   // Vérifier si le formulaire doit être affiché
//   const shouldShowPriceForm = useMemo(() => {
//     if (activeTab !== "En cours") return false;
//     if (!negotiation) return true; // Si pas de négociation, on affiche le formulaire
//     return !negotiation.proposedByCourier; // On n'affiche pas le formulaire si proposedByCourier a une valeur
//   }, [activeTab, negotiation]);

//   const handleValidatePrice = (data: { livreurPrice: string }) => {
//     setConfirmationPrice(data.livreurPrice);
//     setShowConfirmationModal(true);
//   };

//   // Handler pour la validation du prix
//   const handleConfirmPrice = useCallback(
//     async (data: PriceFormData) => {
//       if (!selectedCommand) return;

//       try {
//         setShowConfirmationModal(false);
//         setValidatingPrice(true);

//         // Convertir en nombre entier
//         const price = parseInt(data.livreurPrice, 10);

//         await orderService.validatePrice(selectedCommand.id, price);

//         toast.success("Prix validé avec succès !", {
//           position: "top-right",
//         });

//         // Rafraîchir la liste des commandes
//         await fetchOrders();
//         await fetchNegotiation(selectedCommand.id);

//         // Reset du formulaire
//         reset();
//       } catch (err: any) {
//         console.error("Error validating price:", err);
//         const errorMessage =
//           err.response?.data?.message || "Erreur lors de la validation du prix";
//         toast.error(errorMessage, {
//           position: "top-right",
//         });
//       } finally {
//         setValidatingPrice(false);
//       }
//     },
//     [selectedCommand, fetchOrders, reset]
//   );

//   // Handlers avec useCallback pour éviter les re-rendus
//   const handleAccept = useCallback(
//     async (command: FormattedOrder) => {
//       try {
//         setProcessingAction(`accept-${command.id}`);

//         await orderService.acceptOrder(command.originalData.id);

//         toast.success("Commande acceptée avec succès !", {
//           position: "top-right",
//         });

//         // Rafraîchir la liste des commandes
//         await fetchOrders();
//         setActiveTab("En cours");
//       } catch (err: any) {
//         console.error("Error accepting order:", err);
//         const errorMessage =
//           err.response?.data?.message ||
//           "Erreur lors de l'acceptation de la commande";
//         toast.error(errorMessage, { position: "top-right" });
//       } finally {
//         setProcessingAction(null);
//       }
//     },
//     [fetchOrders]
//   );

//   const handleReject = useCallback(
//     async (command: FormattedOrder) => {
//       try {
//         setProcessingAction(`reject-${command.id}`);

//         await orderService.rejectOrder(command.originalData.id);

//         toast.success("Commande rejetée avec succès !", {
//           position: "top-right",
//         });

//         // Rafraîchir la liste des commandes
//         await fetchOrders();
//         setActiveTab("Nouvelles");
//       } catch (err: any) {
//         console.error("Error rejecting order:", err);
//         const errorMessage =
//           err.response?.data?.message || "Erreur lors du rejet de la commande";
//         toast.error(errorMessage, { position: "top-right" });
//       } finally {
//         setProcessingAction(null);
//       }
//     },
//     [fetchOrders]
//   );

//   const handleEnd = useCallback(
//     async (command: FormattedOrder) => {
//       try {
//         setProcessingAction(`end-${command.id}`);

//         await orderService.endOrder(command.originalData.id);

//         toast.success("Commande terminée avec succès !", {
//           position: "top-right",
//         });

//         // Rafraîchir la liste des commandes
//         await fetchOrders();
//         setActiveTab("Terminées");
//       } catch (err: any) {
//         console.error("Error ending order:", err);
//         const errorMessage =
//           err.response?.data?.message ||
//           "Erreur lors de la finalisation de la commande";
//         toast.error(errorMessage, { position: "top-right" });
//       } finally {
//         setProcessingAction(null);
//       }
//     },
//     [fetchOrders]
//   );

//   const handleViewDetails = useCallback((command: FormattedOrder) => {
//     orderService.getOrderNegociationPrice(command.originalData.id);
//     setSelectedCommand(command.originalData);
//     setIsModalOpen(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setIsModalOpen(false);
//     setSelectedCommand(null);
//   }, []);

//   const handleRetry = useCallback(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   // Vérifier si une commande est en cours de traitement
//   const isCommandProcessing = useCallback(
//     (commandId: string, action: string) => {
//       return processingAction === `${action}-${commandId}`;
//     },
//     [processingAction]
//   );

//   // Données pour les sections d'information
//   const contactData: ContactCourseInterface | null = useMemo(() => {
//     if (!selectedCommand) return null;

//     return {
//       nom: selectedCommand.pickupAddress.name,
//       telephone: selectedCommand.pickupAddress.phone,
//       ville: selectedCommand.pickupAddress.city,
//       quartier: selectedCommand.pickupAddress.district,
//       rue: selectedCommand.pickupAddress.street,
//       pays: selectedCommand.pickupAddress.country,
//     };
//   }, [selectedCommand]);

//   // Données pour les sections d'information
//   const destinataireData: ContactCourseInterface | null = useMemo(() => {
//     if (!selectedCommand) return null;

//     return {
//       nom: selectedCommand.deliveryAddress.name,
//       telephone: selectedCommand.deliveryAddress.phone,
//       ville: selectedCommand.deliveryAddress.city,
//       quartier: selectedCommand.deliveryAddress.district,
//       rue: selectedCommand.deliveryAddress.street,
//       pays: selectedCommand.deliveryAddress.country,
//     };
//   }, [selectedCommand]);

//   const detailsData: DetailCourseInterface | null = useMemo(() => {
//     if (!selectedCommand) return null;

//     return {
//       serviceType: selectedCommand.serviceType,
//       articleType: selectedCommand.articleType,
//       transportMode: selectedCommand.transportMode,
//       deliveryType: selectedCommand.deliveryType,
//       weight: selectedCommand.weight,
//       status: selectedCommand.status,
//     };
//   }, [selectedCommand]);

//   const getEmptyMessage = useCallback(() => {
//     if (!user) return "Aucune commande disponible";

//     const isLivreur = user.role === GrantedRole.Livreur;

//     if (activeTab === "En cours" && isLivreur) {
//       return "Aucune commande en cours vous étant assignée";
//     }

//     if (activeTab === "Terminées" && isLivreur) {
//       return "Aucune commande terminée vous étant assignée";
//     }

//     return `Aucune commande ${activeTab.toLowerCase()}`;
//   }, [user, activeTab]);

//   // État de chargement
//   if (loading && orders.length === 0) {
//     return <LoadingSpinner />;
//   }

//   // État d'erreur
//   if (error && orders.length === 0) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-64 space-y-4">
//         <div className="text-red-500 text-lg text-center">{error}</div>
//         <button
//           onClick={handleRetry}
//           className="flex items-center gap-2 px-4 py-2 bg-[#FD481A] text-white rounded-lg hover:bg-[#E63F15] transition-colors"
//         >
//           <RefreshCw className="w-4 h-4" />
//           Rafraîchir la page
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//         {/* Colonne unique - Liste des commandes */}
//         <div className="lg:col-span-3">
//           <div className="bg-gray-50 rounded-2xl p-6">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {activeTab} Commandes
//                 {user?.role === GrantedRole.Livreur &&
//                   activeTab !== "Nouvelles" && (
//                     <span className="text-sm font-normal text-gray-500 ml-2">
//                       (qui vous sont assignées)
//                     </span>
//                   )}
//               </h1>
//               <ArrowUpRight className="w-6 h-6 text-[#FD481A]" />
//             </div>

//             {/* Tabs */}
//             <div className="flex gap-6 border-b border-gray-200 mb-6">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`pb-3 text-sm font-medium transition-colors relative ${
//                     activeTab === tab
//                       ? "text-gray-900"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   {tab}
//                   {activeTab === tab && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* Liste des commandes */}
//             <div className="space-y-4">
//               {filteredAndFormattedOrders.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   {getEmptyMessage()}
//                 </div>
//               ) : (
//                 filteredAndFormattedOrders.map((command) => (
//                   <CommandCard
//                     activeTab={activeTab}
//                     key={command.id}
//                     command={command}
//                     // onReject={handleReject}
//                     onEnd={handleEnd}
//                     // onReject={handleReject}
//                     onAccept={handleAccept}
//                     onViewDetails={handleViewDetails}
//                     isProcessingAccept={isCommandProcessing(
//                       command.id,
//                       "accept"
//                     )}
//                     // isProcessingReject={isCommandProcessing(
//                     //   command.id,
//                     //   "reject"
//                     // )}
//                     isProcessingEnd={isCommandProcessing(command.id, "end")}
//                   />
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Modal pour les détails */}
//         {isModalOpen && (
//           <div className="w-96 fixed z-50 bg-white shadow-2xl rounded-2xl transition-all duration-300 ease-in-out inset-y-4 left-auto h-[95vh] right-4 flex flex-col border border-gray-100">
//             {/* Header du modal - Fixe en haut */}
//             <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl z-10 shrink-0">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">
//                     Détails de la Commande
//                   </h2>
//                   {selectedCommand && (
//                     <p className="text-sm text-gray-500 mt-1">
//                       {selectedCommand.pickupAddress.city} →{" "}
//                       {selectedCommand.deliveryAddress.city}
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleCloseModal}
//                   className="p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200"
//                 >
//                   <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
//                 </button>
//               </div>
//             </div>

//             {/* Contenu du modal - Scrollable */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="p-6 space-y-6">
//                 {/* Section Prix */}
//                 {selectedCommand && (
//                   <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                       Prix & Estimation
//                     </h3>

//                     <div className="space-y-3">
//                       {/* Prix estimé */}
//                       <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200">
//                         <span className="text-sm font-medium text-gray-600">
//                           Estimation du prix :
//                         </span>
//                         <span className="text-sm font-semibold text-gray-900">
//                           {selectedCommand.estimatedPrice
//                             ? `${selectedCommand.estimatedPrice} FCFA`
//                             : "Non estimé"}
//                         </span>
//                       </div>

//                       {/* Prix livreur */}
//                       {negotiation?.proposedByCourier && (
//                         <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-xl border border-blue-200">
//                           <span className="text-sm font-medium text-blue-700">
//                             Prix proposé :
//                           </span>
//                           <span className="text-sm font-bold text-blue-800">
//                             {negotiation.proposedByCourier} FCFA
//                           </span>
//                         </div>
//                       )}

//                       {/* Prix client confirmé */}
//                       {negotiation?.confirmedByClient && (
//                         <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-xl border border-green-200">
//                           <span className="text-sm font-medium text-green-700">
//                             Prix confirmé :
//                           </span>
//                           <span className="text-sm font-bold text-green-800">
//                             {negotiation.confirmedByClient} FCFA
//                           </span>
//                         </div>
//                       )}

//                       {/* Chargement */}
//                       {loadingNegotiation && (
//                         <div className="flex justify-center items-center py-4">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FD481A]"></div>
//                           <span className="text-sm text-gray-500 ml-3">
//                             Chargement des prix...
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Sections Informations */}
//                 <div className="space-y-5">
//                   <InfoSection title="Contact Envoyeur" data={contactData} />
//                   <InfoSection
//                     title="Contact Destinataire"
//                     data={destinataireData}
//                   />
//                   <InfoColisSection
//                     title="Détails du Colis"
//                     data={detailsData}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Formulaire - Fixe en bas */}
//             {shouldShowPriceForm && (
//               <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 shrink-0">
//                 <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-3">
//                     Proposer un prix
//                   </h3>
//                   <form
//                     onSubmit={handleSubmit(handleValidatePrice)}
//                     className="space-y-3"
//                   >
//                     <div className="flex items-end gap-3">
//                       <div className="flex-1">
//                         <label
//                           htmlFor="livreurPrice"
//                           className="block text-xs font-medium text-gray-600 mb-2"
//                         >
//                           Prix Livreur (FCFA)
//                         </label>
//                         <input
//                           type="text"
//                           id="livreurPrice"
//                           className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200 ${
//                             errors.livreurPrice
//                               ? "border-red-300 bg-red-50"
//                               : "border-gray-200 hover:border-gray-300"
//                           }`}
//                           placeholder="Ex: 15000"
//                           {...register("livreurPrice", {
//                             required: "Le prix est requis",
//                             validate: {
//                               isInteger: (value) => {
//                                 if (!value) return true;
//                                 const numberValue = parseInt(value, 10);
//                                 return !isNaN(numberValue) &&
//                                   Number.isInteger(numberValue) &&
//                                   numberValue > 0
//                                   ? true
//                                   : "Veuillez entrer un nombre entier positif";
//                               },
//                             },
//                           })}
//                         />
//                         {errors.livreurPrice && (
//                           <p className="text-xs text-red-500 mt-2 font-medium">
//                             {errors.livreurPrice.message}
//                           </p>
//                         )}
//                       </div>
//                       <button
//                         type="submit"
//                         disabled={
//                           validatingPrice || isSubmitting || loadingNegotiation
//                         }
//                         className="px-6 py-3 bg-linear-to-br from-[#FD481A] to-[#E63F15] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none min-w-28"
//                       >
//                         {validatingPrice ? (
//                           <div className="flex items-center justify-center gap-2">
//                             <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                             <span>Validation</span>
//                           </div>
//                         ) : (
//                           "Valider"
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//         {/* Modal de Confirmation */}
//         {showConfirmationModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 scale-100">
//               {/* Header */}
//               <div className="p-6 border-b border-gray-100">
//                 <div className="flex items-center gap-3">
//                   <div className="shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 text-orange-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900">
//                       Confirmer le prix
//                     </h3>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Cette action est irréversible
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Contenu */}
//               <div className="p-6">
//                 <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
//                   <p className="text-sm text-red-800 font-medium text-center">
//                     Êtes-vous sûr de vouloir proposer le prix de <br />
//                     <span className="text-lg font-bold">
//                       {confirmationPrice} FCFA
//                     </span>{" "}
//                     ?
//                   </p>
//                 </div>
//                 <p className="text-sm text-gray-600 text-center">
//                   Une fois validé, vous ne pourrez plus modifier ce prix.
//                 </p>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-3 p-6 border-t border-gray-100">
//                 <button
//                   onClick={() => setShowConfirmationModal(false)}
//                   className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={() =>
//                     handleConfirmPrice({ livreurPrice: confirmationPrice })
//                   }
//                   disabled={validatingPrice}
//                   className="flex-1 px-4 py-3 bg-linear-to-r from-[#FD481A] to-[#E63F15] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
//                 >
//                   {validatingPrice ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                       <span>Validation</span>
//                     </div>
//                   ) : (
//                     "Confirmer"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
