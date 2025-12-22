// app/(dashboard)/livraison/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PackageCheck, Filter, Columns, RefreshCw } from "lucide-react";
import { useDeliveries } from "./hooks/use-deliveries";
import DeliverySearchFilters from "./components/DeliverySearchFilters";
import DeliveryTable from "./components/DeliveryTable";
import DeliveriesPagination from "./components/DeliveriesPagination";
import DeliveryDetailsModal from "./components/DeliveryDetailsModal";
import DeliveryColumnVisibilityToggle from "./components/DeliveryColumnVisibilityToggle";

// Définition des colonnes avec leur visibilité par défaut
const defaultVisibleColumns = {
  clientName: true,
  pickupAddress: true,
  deliveryAddress: false,
  deliveryType: false,
  finalPrice: true,
  status: true,
  createdAt: true,
};

export default function LivraisonPage() {
  const {
    deliveries,
    isLoading,
    hasPermission,
    loadDeliveries,
    formatAddress,
    formatPrice,
    formatDate,
  } = useDeliveries();

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>("all");
  const [transportModeFilter, setTransportModeFilter] = useState<string>("all");

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // États pour les colonnes visibles
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  // Charger les livraisons au montage
  useEffect(() => {
    if (hasPermission) {
      loadDeliveries();
    }
  }, [hasPermission, loadDeliveries]);

  // Extraire les options uniques pour les filtres
  const deliveryTypes = Array.from(
    new Set(deliveries.map((d) => d.deliveryType).filter(Boolean))
  );

  const transportModes = Array.from(
    new Set(deliveries.map((d) => d.transportMode).filter(Boolean))
  );

  // Filtrer les livraisons en fonction des critères
  const filteredDeliveries = deliveries.filter((delivery) => {
    // Filtre de recherche
    const matchesSearch =
      searchTerm === "" ||
      (delivery.createdBy?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      formatAddress(delivery.pickupAddress)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      formatAddress(delivery.deliveryAddress)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.deliveryType?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par type de livraison
    const matchesDeliveryType =
      deliveryTypeFilter === "all" ||
      delivery.deliveryType === deliveryTypeFilter;

    // Filtre par mode de transport
    const matchesTransportMode =
      transportModeFilter === "all" ||
      delivery.transportMode === transportModeFilter;

    return matchesSearch && matchesDeliveryType && matchesTransportMode;
  });

  // Calculer la pagination
  const totalItems = filteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  // Réinitialiser à la première page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, deliveryTypeFilter, transportModeFilter]);

  // Gestion du toggle des colonnes
  const handleToggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }));
  };

  // Vérifier l'accès
  if (!hasPermission) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center py-12">
          <PackageCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-500">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Livraisons terminées
          </h1>
          <p className="text-gray-500 mt-2">
            Historique des livraisons complétées avec succès
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadDeliveries}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#FD481A] text-white rounded-lg hover:bg-[#E63F15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Chargement..." : "Actualiser"}
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <PackageCheck className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">
              {deliveries.length}
            </span>
            <span className="text-gray-500">livraisons</span>
          </div>

          <button
            onClick={() => setShowColumnToggle(!showColumnToggle)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Columns className="w-4 h-4" />
            Colonnes
          </button>
        </div>
      </div>

      {/* Toggle des colonnes visibles */}
      {showColumnToggle && (
        <DeliveryColumnVisibilityToggle
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          onReset={() => setVisibleColumns(defaultVisibleColumns)}
        />
      )}

      {/* Barre de recherche et filtres */}
      <DeliverySearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        deliveryTypeFilter={deliveryTypeFilter}
        onDeliveryTypeFilterChange={setDeliveryTypeFilter}
        transportModeFilter={transportModeFilter}
        onTransportModeFilterChange={setTransportModeFilter}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={totalItems}
        filteredItems={filteredDeliveries.length}
        deliveryTypes={deliveryTypes}
        transportModes={transportModes}
      />

      {/* Pagination */}
      {totalItems > 0 && (
        <DeliveriesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          startIndex={startIndex + 1}
          endIndex={Math.min(endIndex, totalItems)}
        />
      )}

      {/* Tableau/Cartes des livraisons */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <DeliveryTable
          deliveries={paginatedDeliveries}
          isLoading={isLoading}
          visibleColumns={visibleColumns}
          formatAddress={formatAddress}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <DeliveriesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          startIndex={startIndex + 1}
          endIndex={Math.min(endIndex, totalItems)}
        />
      )}

      {/* Modal de détails */}
      <DeliveryDetailsModal />
    </div>
  );
}
