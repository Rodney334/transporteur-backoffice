// app/(dashboard)/codepromo/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, RefreshCw, Download, Columns, Users } from "lucide-react";
import Link from "next/link";
import PromoTable from "./components/PromoTable";
import PromoSearchFilters from "./components/PromoSearchFilters";
import PromoPagination from "./components/PromoPagination";
import PromoDetailsModal from "./components/PromoDetailsModal";
import PromoFormModal from "./components/PromoFormModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import PromoColumnVisibilityToggle from "./components/PromoColumnVisibilityToggle";
import ProtectedRoute from "@/components/Protected-route";
import { usePromos } from "./hooks";
import { GrantedRole } from "@/type/enum";
import { PromoCode } from "./types";

// Définition des colonnes avec leur visibilité par défaut
const defaultVisibleColumns = {
  code: true,
  type: true,
  value: true,
  isActive: true,
  usageLimit: true,
  startsAt: false,
  endsAt: false,
};

export default function CodepromoPage() {
  const {
    promos,
    isLoading,
    loadPromos,
    deletePromo,
    exportPromos,
    formatPromoType,
    formatDate,
    getActiveStatusColor,
  } = usePromos();

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: "",
    end: "",
  });

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // États pour les colonnes visibles
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  // États pour les modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);

  // Charger les codes promo au montage
  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  // Filtrer les codes promo
  const filteredPromos = promos.filter((promo) => {
    // Filtre de recherche
    const matchesSearch =
      searchTerm === "" ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par statut actif/inactif
    const matchesActiveFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && promo.isActive) ||
      (activeFilter === "inactive" && !promo.isActive);

    // Filtre par plage de dates
    const matchesDateRange = () => {
      if (!dateRangeFilter.start && !dateRangeFilter.end) return true;

      const promoDate = new Date(promo.createdAt);
      const startDate = dateRangeFilter.start
        ? new Date(dateRangeFilter.start)
        : null;
      const endDate = dateRangeFilter.end
        ? new Date(dateRangeFilter.end)
        : null;

      let matches = true;
      if (startDate) {
        matches = matches && promoDate >= startDate;
      }
      if (endDate) {
        const endDatePlusOne = new Date(endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        matches = matches && promoDate < endDatePlusOne;
      }
      return matches;
    };

    return matchesSearch && matchesActiveFilter && matchesDateRange();
  });

  // Calculer la pagination
  const totalItems = filteredPromos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPromos = filteredPromos.slice(startIndex, endIndex);

  // Réinitialiser à la première page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter, dateRangeFilter]);

  // Gestion du toggle des colonnes
  const handleToggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }));
  };

  // Gestion de la modification
  const handleEditClick = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setIsEditModalOpen(true);
  };

  // Gestion de la suppression
  const handleDeleteClick = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPromo) {
      const success = await deletePromo(selectedPromo.id);
      if (success) {
        setIsDeleteModalOpen(false);
        setSelectedPromo(null);
      }
    }
  };

  // Fermeture des modals
  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPromo(null);
  };

  return (
    <ProtectedRoute allowedRoles={[GrantedRole.Admin]}>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des codes promo
            </h1>
            <p className="text-gray-500 mt-2">
              Créez et gérez vos codes promotionnels
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/dashboard/codepromo/partners"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white text-[#FD481A] border border-[#FD481A] rounded-lg hover:bg-orange-50 transition-colors font-bold"
            >
              <Users className="w-4 h-4" />
              Gestion des partenaires
            </Link>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#FD481A] text-white rounded-lg hover:bg-[#E63F15] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau code
            </button>

            <button
              onClick={loadPromos}
              disabled={isLoading}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#131313] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Chargement..." : "Actualiser"}
            </button>

            <button
              onClick={() => exportPromos("csv")}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Tag className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{promos.length}</span>
              <span className="text-gray-500">codes</span>
            </div>

            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Columns className="w-4 h-4" />
              Colonnes
            </button>
          </div>
        </div>

        {/* Toggle des colonnes visibles */}
        {showColumnToggle && (
          <PromoColumnVisibilityToggle
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
            onReset={() => setVisibleColumns(defaultVisibleColumns)}
          />
        )}

        {/* Barre de recherche et filtres */}
        <PromoSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onActiveFilterChange={setActiveFilter}
          dateRangeFilter={dateRangeFilter}
          onDateRangeFilterChange={setDateRangeFilter}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={promos.length}
          filteredItems={filteredPromos.length}
        />

        {/* Pagination supérieure */}
        {totalItems > 0 && (
          <PromoPagination
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

        {/* Tableau des codes promo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <PromoTable
            promos={paginatedPromos}
            isLoading={isLoading}
            visibleColumns={visibleColumns}
            formatPromoType={formatPromoType}
            formatDate={formatDate}
            getActiveStatusColor={getActiveStatusColor}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>

        {/* Pagination inférieure */}
        {totalItems > 0 && (
          <PromoPagination
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

        {/* Modals */}
        <PromoDetailsModal />

        <PromoFormModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModals}
        />

        <PromoFormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          promoToEdit={selectedPromo}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          promo={selectedPromo}
          onClose={handleCloseModals}
          onConfirm={handleDeleteConfirm}
          isLoading={isLoading}
        />
      </div>
    </ProtectedRoute>
  );
}
