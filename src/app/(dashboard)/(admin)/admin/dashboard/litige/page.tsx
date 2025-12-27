// app/(dashboard)/page.tsx
"use client";

import { useNegotiationManagement } from "./use-negotiation-management";
import { NegotiationFilters } from "./components/NegotiationFilters";
import { NegotiationTable } from "./components/NegotiationTable";
import { NegotiationDetailModal } from "./components/NegotiationDetailModal";
import { ResolveConflictModal } from "./components/ResolveConflictModal";
import { AlertTriangle, RefreshCw } from "lucide-react";
import ProtectedRoute from "@/components/Protected-route";
import { GrantedRole } from "@/type/enum";

export default function LitigePage() {
  const {
    negotiations,
    filteredNegotiations,
    selectedNegotiation,
    stats,
    isLoading,
    error,
    isResolving,
    showDetailModal,
    showResolveModal,
    searchQuery,
    statusFilter,
    currentPage,
    itemsPerPage,
    totalPages,
    canResolve,
    setSearchQuery,
    setStatusFilter,
    setCurrentPage,
    loadNegotiations,
    resolveConflict,
    openDetailModal,
    openResolveModal,
    closeModals,
  } = useNegotiationManagement();

  // Gérer la résolution de conflit
  const handleResolve = async (amount: number) => {
    if (!selectedNegotiation) return false;
    return await resolveConflict(selectedNegotiation.order.id, amount);
  };

  // Écran d'erreur
  if (error && negotiations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Erreur de Chargement
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadNegotiations}
            className="px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[GrantedRole.Admin, GrantedRole.Operateur]}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Filtres et statistiques */}
          <NegotiationFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            stats={stats}
          />

          {/* Tableau */}
          <div className="mt-6">
            <NegotiationTable
              negotiations={negotiations}
              filteredNegotiations={filteredNegotiations}
              isLoading={isLoading}
              canResolve={canResolve}
              onViewDetails={openDetailModal}
              onResolve={openResolveModal}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredNegotiations.length}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Modals */}
          <NegotiationDetailModal
            isOpen={showDetailModal}
            onClose={closeModals}
            negotiation={selectedNegotiation}
          />

          <ResolveConflictModal
            isOpen={showResolveModal}
            onClose={closeModals}
            negotiation={selectedNegotiation}
            isResolving={isResolving}
            onResolve={handleResolve}
          />

          {/* Indicateur de chargement pour les mises à jour */}
          {(isLoading || isResolving) && (
            <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FD481A]"></div>
              <span className="text-sm font-medium text-gray-700">
                {isResolving
                  ? "Résolution du litige..."
                  : "Chargement des données..."}
              </span>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
