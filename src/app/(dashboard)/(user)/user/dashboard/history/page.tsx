// app/(dashboard)/client/historique/page.tsx - VERSION SIMPLIFIÉE
"use client";

import { OrdersManager } from "@/app/(dashboard)/components/OrdersManager/OrdersManager";
import { DeliveryCard } from "@/app/(dashboard)/components/OrdersManager//DeliveryCard";
import { getClientConfig } from "@/app/(dashboard)/components/OrdersManager/OrdersManager.utils";
import { GrantedRole } from "@/type/enum";

export default function HistoriquePage() {
  const clientConfig = getClientConfig();

  return (
    <OrdersManager
      userRole={GrantedRole.Client} // Ou le rôle approprié pour le client
      tabs={["En cours", "Terminées"]}
      defaultTab="En cours"
      cardComponent={DeliveryCard}
      shouldShowPriceForm={clientConfig.shouldShowPriceForm}
      formatOrder={clientConfig.formatOrder}
      filterOrders={clientConfig.filterOrders}
      getEmptyMessage={clientConfig.getEmptyMessage}
      onValidatePrice={clientConfig.onValidatePrice}
      headerTitle="Mes Commandes"
      showHeaderCounter={true}
    />
  );
}

// // page.tsx - Ajout du formulaire et de la logique de contrôle
// "use client";

// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useForm } from "react-hook-form";
// import { Package, X, ArrowUpRight, RefreshCw } from "lucide-react";
// import { DeliveryCard } from "./components/DeliveryCard";
// import { InfoColisSection, InfoSection } from "@/components/InfoSection";
// import { orderService } from "@/lib/services/order-service";
// import { Order } from "@/type/order.type";
// import { FormattedOrder } from "@/type/command-card.type";
// import { OrderStatus, PAYMENT_METHOD_FLOW, PaymentMethod } from "@/type/enum";
// import { Negotiation } from "@/type/order.type";
// import { LoadingSpinner } from "@/components/Loading";
// import { useAuth } from "@/hooks/use-auth";
// import { toast } from "react-toastify";

// // Interfaces pour le formulaire et les données
// interface PriceFormData {
//   price: string;
//   method: PaymentMethod;
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

// // Mapping des statuts pour l'affichage
// const STATUS_MAPPING: Record<string, OrderStatus[]> = {
//   "En cours": [
//     OrderStatus.EN_ATTENTE,
//     OrderStatus.ASSIGNEE,
//     OrderStatus.EN_DISCUSSION,
//     OrderStatus.PRIX_VALIDE,
//     OrderStatus.EN_LIVRAISON,
//   ],
//   Terminées: [OrderStatus.LIVREE, OrderStatus.ECHEC],
// };

// export default function HistoriquePage() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("En cours");
//   const [selectedCommand, setSelectedCommand] = useState<Order | null>(null);
//   const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [loadingNegotiation, setLoadingNegotiation] = useState(false);
//   const [validatingPrice, setValidatingPrice] = useState<boolean>(false);
//   const [showConfirmationModal, setShowConfirmationModal] =
//     useState<boolean>(false);
//   const [confirmationPrice, setConfirmationPrice] = useState<string>("");
//   const [payementMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.CASH
//   );

//   // React Hook Form
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<PriceFormData>();

//   const tabs = ["En cours", "Terminées"];

//   // Fonction pour charger les commandes de l'utilisateur
//   const fetchUserOrders = useCallback(async () => {
//     if (!user?._id) return;

//     try {
//       setLoading(true);
//       setError(null);
//       const ordersData = await orderService.getUserOrder(user._id);
//       setOrders(ordersData);
//     } catch (err) {
//       console.error("Error fetching user orders:", err);
//       setError("Une erreur est survenue. Veuillez rafraîchir la page.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user?._id]);

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
//     fetchUserOrders();
//   }, [fetchUserOrders]);

//   // Reset du formulaire et chargement de la négociation quand la commande sélectionnée change
//   useEffect(() => {
//     if (selectedCommand) {
//       reset({ price: "" });
//       fetchNegotiation(selectedCommand.id);
//     } else {
//       setNegotiation(null);
//     }
//   }, [selectedCommand, reset, fetchNegotiation]);

//   // Formater les commandes pour l'affichage dans DeliveryCard
//   const formatOrderForDeliveryCard = useCallback((order: Order) => {
//     return {
//       id: `#${order.id.slice(0, 8).toUpperCase()}`,
//       from: order.pickupAddress.city,
//       to: order.deliveryAddress.city,
//       status: getStatusDisplayText(order.status),
//       date: new Date(order.createdAt).toLocaleDateString("fr-FR", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }),
//       originalData: order,
//     };
//   }, []);

//   // Fonction pour convertir le statut technique en texte d'affichage
//   const getStatusDisplayText = useCallback((status: OrderStatus): string => {
//     const statusMap: Record<OrderStatus, string> = {
//       [OrderStatus.EN_ATTENTE]: "En attente",
//       [OrderStatus.ASSIGNEE]: "Assignée",
//       [OrderStatus.EN_DISCUSSION]: "En discussion",
//       [OrderStatus.PRIX_VALIDE]: "Prix validé",
//       [OrderStatus.EN_LIVRAISON]: "En livraison",
//       [OrderStatus.LIVREE]: "Livrée",
//       [OrderStatus.ECHEC]: "Annulée",
//     };
//     return statusMap[status] || status;
//   }, []);

//   const getPaymentMethodDisplayText = useCallback(
//     (method: PaymentMethod): string => {
//       const methodMap: Record<PaymentMethod, string> = {
//         [PaymentMethod.CASH]: "Espèces",
//         [PaymentMethod.MOBILE_MONEY]: "Mobile Money",
//         [PaymentMethod.CARD]: "Carte bancaire",
//       };
//       return methodMap[method] || method;
//     },
//     []
//   );

//   // Filtrer les commandes selon l'onglet actif
//   const filteredOrders = useMemo(() => {
//     const statuses = STATUS_MAPPING[activeTab] || [];
//     return orders
//       .filter((order) => statuses.includes(order.status as OrderStatus))
//       .map(formatOrderForDeliveryCard);
//   }, [orders, activeTab, formatOrderForDeliveryCard]);

//   // Vérifier si le formulaire doit être affiché
//   const shouldShowPriceForm = useMemo(() => {
//     if (activeTab !== "En cours") return false;
//     if (!negotiation) return true; // Si pas de négociation, on affiche le formulaire
//     return !negotiation.confirmedByClient; // On n'affiche pas le formulaire si confirmedByClient a une valeur
//   }, [activeTab, negotiation]);

//   const handleValidatePrice = (data: PriceFormData) => {
//     setConfirmationPrice(data.price);
//     setPaymentMethod(data.method);
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
//         const price = parseInt(data.price, 10);
//         const method = data.method;

//         await orderService.clientValidatePrice(
//           selectedCommand.id,
//           price,
//           method
//         );

//         toast.success("Prix validé avec succès !");

//         // Rafraîchir la liste des commandes et la négociation
//         await fetchUserOrders();
//         await fetchNegotiation(selectedCommand.id);

//         // Reset du formulaire
//         reset();
//       } catch (err: any) {
//         console.error("Error validating price:", err);
//         const errorMessage =
//           err.response?.data?.message || "Erreur lors de la validation du prix";
//         toast.error(errorMessage);
//       } finally {
//         setValidatingPrice(false);
//       }
//     },
//     [selectedCommand, fetchUserOrders, fetchNegotiation, reset]
//   );

//   // Handler pour voir les détails
//   const handleViewDetails = useCallback((item: any) => {
//     setSelectedCommand(item.originalData);
//     setIsModalOpen(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setIsModalOpen(false);
//     setSelectedCommand(null);
//     setNegotiation(null);
//     reset();
//   }, [reset]);

//   const handleRetry = useCallback(() => {
//     fetchUserOrders();
//   }, [fetchUserOrders]);

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

//   // Compter le nombre total de commandes
//   const totalOrdersCount = orders.length;

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
//       <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
//         {/* Colonne gauche - Liste des commandes */}
//         <div className="lg:col-span-4">
//           <div className="bg-gray-50 rounded-2xl p-6">
//             {/* Header avec compteur */}
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-12 h-12 bg-[#FD481A] rounded-full flex items-center justify-center">
//                 <Package className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900">Commandes</h2>
//               <span className="ml-auto text-3xl font-bold text-gray-900">
//                 {totalOrdersCount}
//               </span>
//             </div>

//             {/* En-tête avec tabs et filtre */}
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex gap-6 border-b border-gray-200">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`pb-3 text-xs font-medium transition-colors relative ${
//                       activeTab === tab
//                         ? "text-gray-900"
//                         : "text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     {tab}
//                     {activeTab === tab && (
//                       <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
//                     )}
//                   </button>
//                 ))}
//               </div>

//               {/* <select className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FD481A]">
//                 <option>Ce mois-ci</option>
//                 <option>Ce trimestre</option>
//                 <option>Cette année</option>
//               </select> */}
//             </div>

//             {/* Liste des commandes */}
//             <div className="space-y-3">
//               {filteredOrders.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   Aucune commande {activeTab.toLowerCase()}
//                 </div>
//               ) : (
//                 filteredOrders.map((item, index) => (
//                   <div
//                     key={item.id}
//                     className="cursor-pointer hover:opacity-80 transition-opacity"
//                     onClick={() => handleViewDetails(item)}
//                   >
//                     <DeliveryCard item={item} type="envoye" />
//                   </div>
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
//               <div className="sticky bottom-0 bg-white border-t border-gray-100 p-2 shrink-0">
//                 <div className="bg-linear-to-r from-orange-50 to-red-50 rounded-2xl p-2 border border-orange-200 shadow-sm">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-2">
//                     Proposer un prix
//                   </h3>
//                   <form
//                     onSubmit={handleSubmit(handleValidatePrice)}
//                     className="space-y-4"
//                   >
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                       {/* Champ Prix */}
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="price"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Prix Livreur (FCFA)
//                         </label>
//                         <input
//                           type="text"
//                           id="price"
//                           className={`w-full p-2 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200 ${
//                             errors.price
//                               ? "border-red-300 bg-red-50"
//                               : "border-gray-200 hover:border-gray-300"
//                           }`}
//                           placeholder="Ex: 15000"
//                           {...register("price", {
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
//                         {errors.price && (
//                           <p className="text-xs text-red-500 font-medium">
//                             {errors.price.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* Sélecteur Méthode de Paiement */}
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="paymentMethod"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Méthode de paiement
//                         </label>
//                         <select
//                           id="paymentMethod"
//                           className={`w-full p-2 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200 appearance-none bg-white ${
//                             errors.method
//                               ? "border-red-300 bg-red-50"
//                               : "border-gray-200 hover:border-gray-300"
//                           }`}
//                           {...register("method", {
//                             required: "La méthode de paiement est requise",
//                           })}
//                         >
//                           <option value="">Sélectionnez une méthode</option>
//                           {PAYMENT_METHOD_FLOW.map((method) => (
//                             <option key={method} value={method}>
//                               {getPaymentMethodDisplayText(method)}
//                             </option>
//                           ))}
//                         </select>
//                         {errors.method && (
//                           <p className="text-xs text-red-500 font-medium">
//                             {errors.method.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Bouton de validation */}
//                     <div className="flex justify-end">
//                       <button
//                         type="submit"
//                         disabled={
//                           validatingPrice || isSubmitting || loadingNegotiation
//                         }
//                         className="p-2 bg-linear-to-r from-[#FD481A] to-[#E63F15] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none min-w-32 flex items-center justify-center gap-2"
//                       >
//                         {validatingPrice ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                             <span>Validation</span>
//                           </>
//                         ) : (
//                           "Valider le prix"
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
//                     handleConfirmPrice({
//                       price: confirmationPrice,
//                       method: payementMethod,
//                     })
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

//         {/* Modal pour les détails */}
//         {/* {isModalOpen && (
//           <div
//             className={`
//               w-96 fixed z-50 bg-white shadow-xl transition-all duration-300 ease-in-out inset-y-4 left-auto h-auto right-4 flex flex-col
//             `}
//           >
//             <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10 shrink-0">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Détails de la Commande
//                 </h2>
//                 <button
//                   onClick={handleCloseModal}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               <div className="p-6 space-y-6">
//                 <div>
//                   <h3 className="text-xs font-semibold text-gray-900 mb-4">
//                     Informations{" "}
//                     {selectedCommand
//                       ? `- ${selectedCommand.pickupAddress.city} → ${selectedCommand.deliveryAddress.city}`
//                       : "Lieu de Départ"}
//                   </h3>
//                   <div className="space-y-5">
//                     <InfoSection title="Contact Envoyeur" data={contactData} />
//                     <InfoSection
//                       title="Contact Destinataire"
//                       data={destinataireData}
//                     />
//                     <InfoColisSection
//                       title="Détails du Colis"
//                       data={detailsData}
//                     />
//                   </div>
//                 </div>

//                 {selectedCommand && (
//                   <div className="border-t border-gray-200 pt-3 space-y-2">
//                     <div className="flex gap-2 bg-gray-50 rounded-lg p-2">
//                       <h3 className="text-xs font-bold text-gray-900">
//                         Estimation du prix :
//                       </h3>
//                       <p className="text-xs text-gray-700">
//                         {selectedCommand.estimatedPrice
//                           ? `${selectedCommand.estimatedPrice} FCFA`
//                           : "Non estimé"}
//                       </p>
//                     </div>

//                     {negotiation?.proposedByCourier && (
//                       <div className="flex gap-2 bg-blue-50 rounded-lg p-2">
//                         <h3 className="text-xs font-bold text-gray-900">
//                           Prix proposé par le livreur :
//                         </h3>
//                         <p className="text-xs text-blue-700 font-semibold">
//                           {negotiation.proposedByCourier} FCFA
//                         </p>
//                       </div>
//                     )}

//                     {negotiation?.confirmedByClient && (
//                       <div className="flex gap-2 bg-green-50 rounded-lg p-2">
//                         <h3 className="text-xs font-bold text-gray-900">
//                           Prix confirmé par le client :
//                         </h3>
//                         <p className="text-xs text-green-700 font-semibold">
//                           {negotiation.confirmedByClient} FCFA
//                         </p>
//                       </div>
//                     )}

//                     {loadingNegotiation && (
//                       <div className="flex justify-center py-2">
//                         <div className="text-xs text-gray-500">
//                           Chargement des prix...
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {shouldShowPriceForm && (
//               <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shrink-0">
//                 <form
//                   onSubmit={handleSubmit(handleValidatePrice)}
//                   className="flex flex-col gap-2"
//                 >
//                   <div className="flex gap-2 items-center">
//                     <label
//                       htmlFor="livreurPrice"
//                       className="text-xs whitespace-nowrap"
//                     >
//                       Prix Livreur
//                     </label>
//                     <input
//                       type="text"
//                       id="livreurPrice"
//                       className={`p-1 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] ${
//                         errors.livreurPrice
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                       placeholder="Entrez un nombre entier"
//                       {...register("livreurPrice", {
//                         required: "Le prix est requis",
//                         validate: {
//                           isInteger: (value) => {
//                             if (!value) return true; // Laisser required gérer le cas vide
//                             const numberValue = parseInt(value, 10);
//                             return !isNaN(numberValue) &&
//                               Number.isInteger(numberValue) &&
//                               numberValue > 0
//                               ? true
//                               : "Veuillez entrer un nombre entier positif";
//                           },
//                         },
//                       })}
//                     />
//                   </div>

//                   <div className="flex gap-2 items-center">
//                     <label
//                       htmlFor="paymentMethod"
//                       className="text-xs whitespace-nowrap"
//                     >
//                       Méthode de paiement
//                     </label>
//                     <select
//                       id="paymentMethod"
//                       className="p-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
//                       {...register("method", {
//                         required: "La méthode de paiement est requise",
//                       })}
//                     >
//                       <option value="">Sélectionnez une méthode</option>
//                       {PAYMENT_METHOD_FLOW.map((method) => (
//                         <option key={method} value={method}>
//                           {getPaymentMethodDisplayText(method)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       disabled={
//                         validatingPrice || isSubmitting || loadingNegotiation
//                       }
//                       className="px-3 py-1 bg-[#FD481A] text-white rounded-lg hover:bg-[#E63F15] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs whitespace-nowrap"
//                     >
//                       {validatingPrice ? "Validation..." : "Valider"}
//                     </button>
//                   </div>

//                   {errors.livreurPrice && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {errors.livreurPrice.message}
//                     </p>
//                   )}
//                   {errors.method && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {errors.method.message}
//                     </p>
//                   )}
//                 </form>
//               </div>
//             )}
//           </div>
//         )} */}
//       </div>
//     </>
//   );
// }
