"use client";

import { useState, useEffect } from "react";
import { CreditCard, Filter, Columns, RefreshCw, Download } from "lucide-react";
import { usePayments } from "./hooks/use-payments";
import PaymentSearchFilters from "./components/PaymentSearchFilters";
import PaymentTable from "./components/PaymentTable";
import DeliveriesPagination from "./components/DeliveriesPagination";
import PaymentDetailsModal from "./components/PaymentDetailsModal";
import PaymentColumnVisibilityToggle from "./components/PaymentColumnVisibilityToggle";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import ProtectedRoute from "@/components/Protected-route";
import { GrantedRole } from "@/type/enum";
import { PaymentStatus, PaymentMethod } from "@/type/enum";

// Définition des colonnes avec leur visibilité par défaut
const defaultVisibleColumns = {
  client: true,
  deliverer: true,
  amount: true,
  method: true,
  status: true,
  date: true,
  orderId: false,
};

export default function PaiementPage() {
  const {
    payments,
    isLoading,
    loadPayments,
    formatPrice,
    formatDate,
    formatPaymentMethod,
    formatPaymentStatus,
    getStatusColor,
    getMethodColor,
    markAsPaid,
    deletePayment,
    exportPayments,
  } = usePayments();

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all"
  );
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">(
    "all"
  );
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

  // États pour la suppression
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<{
    id: string;
    clientName: string;
    amount: number;
  } | null>(null);

  // Charger les paiements au montage
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Filtrer les paiements en fonction des critères
  const filteredPayments = payments.filter((payment) => {
    // Filtre de recherche
    const matchesSearch =
      searchTerm === "" ||
      (payment.client?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      payment.order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par statut
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    // Filtre par méthode
    const matchesMethod =
      methodFilter === "all" || payment.method === methodFilter;

    // Filtre par plage de dates
    const matchesDateRange = () => {
      if (!dateRangeFilter.start && !dateRangeFilter.end) return true;

      const paymentDate = new Date(payment.createdAt);
      const startDate = dateRangeFilter.start
        ? new Date(dateRangeFilter.start)
        : null;
      const endDate = dateRangeFilter.end
        ? new Date(dateRangeFilter.end)
        : null;

      let matches = true;
      if (startDate) {
        matches = matches && paymentDate >= startDate;
      }
      if (endDate) {
        const endDatePlusOne = new Date(endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        matches = matches && paymentDate < endDatePlusOne;
      }
      return matches;
    };

    return (
      matchesSearch && matchesStatus && matchesMethod && matchesDateRange()
    );
  });

  // Calculer la pagination
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  // Réinitialiser à la première page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, methodFilter, dateRangeFilter]);

  // Gestion du toggle des colonnes
  const handleToggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }));
  };

  // Gestion de la suppression
  const handleDeleteClick = (
    paymentId: string,
    clientName: string,
    amount: number
  ) => {
    setPaymentToDelete({ id: paymentId, clientName, amount });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (paymentToDelete) {
      await deletePayment(paymentToDelete.id);
      setDeleteModalOpen(false);
      setPaymentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPaymentToDelete(null);
  };

  // Gestion du marquage comme payé
  const handleMarkAsPaid = async (paymentId: string) => {
    await markAsPaid(paymentId);
  };

  // Gestion de l'export
  const handleExport = (format: "csv" | "pdf") => {
    exportPayments(format);
  };

  return (
    <ProtectedRoute allowedRoles={[GrantedRole.Admin, GrantedRole.Operateur]}>
      <div className="space-y-6">
        {/* En-tête avec statistiques */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des paiements
            </h1>
            <p className="text-gray-500 mt-2">
              Suivi et gestion des paiements des livraisons
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadPayments}
              disabled={isLoading}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#FD481A] text-white rounded-lg hover:bg-[#E63F15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Chargement..." : "Actualiser"}
            </button>

            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport("csv")}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => handleExport("pdf")}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div> */}

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                {payments.length}
              </span>
              <span className="text-gray-500">paiements</span>
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
          <PaymentColumnVisibilityToggle
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
            onReset={() => setVisibleColumns(defaultVisibleColumns)}
          />
        )}

        {/* Barre de recherche et filtres */}
        <PaymentSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          methodFilter={methodFilter}
          onMethodFilterChange={setMethodFilter}
          dateRangeFilter={dateRangeFilter}
          onDateRangeFilterChange={setDateRangeFilter}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={totalItems}
          filteredItems={filteredPayments.length}
        />

        {/* Pagination supérieure */}
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

        {/* Tableau/Cartes des paiements */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <PaymentTable
            payments={paginatedPayments}
            isLoading={isLoading}
            visibleColumns={visibleColumns}
            formatPrice={formatPrice}
            formatDate={formatDate}
            formatPaymentMethod={formatPaymentMethod}
            formatPaymentStatus={formatPaymentStatus}
            getStatusColor={getStatusColor}
            getMethodColor={getMethodColor}
            onMarkAsPaid={handleMarkAsPaid}
            onDelete={handleDeleteClick}
          />
        </div>

        {/* Pagination inférieure */}
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
        <PaymentDetailsModal />

        {/* Modal de confirmation de suppression */}
        {paymentToDelete && (
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            paymentId={paymentToDelete.id}
            clientName={paymentToDelete.clientName}
            amount={paymentToDelete.amount}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            isLoading={isLoading}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
