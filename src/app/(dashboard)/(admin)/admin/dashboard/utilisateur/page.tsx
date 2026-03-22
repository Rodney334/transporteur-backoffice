// app/(dashboard)/utilisateur/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Users, Filter, Columns } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUsersManagement } from "@/hooks/use-users-management";
import UserSearchFilters from "./components/UserSearchFilters";
import UserTable from "./components/UserTable";
import UsersPagination from "./components/UsersPagination";
import RoleChangeModal from "./components/RoleChangeModal";
import LivreurProfileModal from "./components/LivreurProfileModal"; // IMPORT NOUVEAU
import LivreurReviewsModal from "./components/LivreurReviewsModal"; // IMPORT NOUVEAU
import ColumnVisibilityToggle from "./components/ColumnVisibilityToggle";
import { GrantedRole } from "@/type/enum";
import ProtectedRoute from "@/components/Protected-route";

// Définition des colonnes avec leur visibilité par défaut
const defaultVisibleColumns = {
  name: true,
  email: true,
  phoneNumber: true,
  countryCode: false,
  genderrole: false,
  role: true,
  isArchived: false,
  createdAt: false,
  livreurRequestStatus: false,
  actions: true,
};

export default function UtilisateurPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === GrantedRole.Admin;
  const isOperateur = currentUser?.role === GrantedRole.Operateur;
  const canManageLivreur = isAdmin || isOperateur; // NOUVEAU

  const { users, isLoadingUsers, loadUsers, getRoleLabel, getGenderLabel } =
    useUsersManagement();

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<GrantedRole | "all">("all");
  const [archivedFilter, setArchivedFilter] = useState<
    "all" | "active" | "archived"
  >("all");
  const [view, setView] = useState<"all" | "livreur_requests">("all");

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // États pour les colonnes visibles
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  // Charger les utilisateurs au montage
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filtrer les utilisateurs en fonction des critères
  const filteredUsers = users.filter((user) => {
    // Filtre de recherche
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm) ||
      getRoleLabel(user.role).toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par rôle
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    // Filtre par statut archivé
    const matchesArchived =
      archivedFilter === "all" ||
      (archivedFilter === "active" && !user.isArchived) ||
      (archivedFilter === "archived" && user.isArchived);

    // Filtre par vue (signupIntent)
    const matchesView =
      view === "all"
        ? user.signupIntent !== "livreur" ||
          user.livreurRequestStatus === "approved"
        : user.signupIntent === "livreur" &&
          (user.livreurRequestStatus === "pending" ||
            user.livreurRequestStatus === "rejected");

    return matchesSearch && matchesRole && matchesArchived && matchesView;
  });

  // Calculer la pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Réinitialiser à la première page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, archivedFilter, view]);

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ProtectedRoute
      allowedRoles={[
        GrantedRole.Admin,
        GrantedRole.Operateur,
        GrantedRole.Livreur,
      ]}
    >
      <div className="space-y-6">
        {/* En-tête avec statistiques */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des utilisateurs
            </h1>
            <p className="text-gray-500 mt-2">
              {isAdmin
                ? "Interface d'administration - Vous pouvez modifier les rôles"
                : "Consultez la liste des utilisateurs"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{users.length}</span>
              <span className="text-gray-500">utilisateurs</span>
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

        {/* Sélecteur de vue */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setView("all")}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              view === "all"
                ? "text-[#FD481A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Utilisateurs Standards
            {view === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FD481A]" />
            )}
          </button>
          <button
            onClick={() => setView("livreur_requests")}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              view === "livreur_requests"
                ? "text-[#FD481A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Demandes Livreur
            {view === "livreur_requests" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FD481A]" />
            )}
          </button>
        </div>

        {/* Toggle des colonnes visibles */}
        {showColumnToggle && (
          <ColumnVisibilityToggle
            visibleColumns={visibleColumns}
            onToggleColumn={(column) =>
              setVisibleColumns((prev) => ({
                ...prev,
                [column]: !prev[column],
              }))
            }
            onReset={() => setVisibleColumns(defaultVisibleColumns)}
          />
        )}

        {/* Barre de recherche et filtres */}
        <UserSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          archivedFilter={archivedFilter}
          onArchivedFilterChange={setArchivedFilter}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={totalItems}
          filteredItems={filteredUsers.length}
        />

        {/* Pagination */}
        {totalItems > 0 && (
          <UsersPagination
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

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <UserTable
            users={paginatedUsers}
            isLoading={isLoadingUsers}
            visibleColumns={
              view === "livreur_requests"
                ? { ...visibleColumns, livreurRequestStatus: true }
                : visibleColumns
            }
            isAdmin={isAdmin}
            canManageLivreur={canManageLivreur}
            isLivreurView={view === "livreur_requests"}
            getRoleLabel={getRoleLabel}
            getGenderLabel={getGenderLabel}
            formatDate={formatDate}
          />
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <UsersPagination
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

        {/* Modal de changement de rôle */}
        <RoleChangeModal />

        {/* NOUVEAU : Modal de profil livreur */}
        <LivreurProfileModal />

        {/* NOUVEAU : Modal des avis livreur */}
        <LivreurReviewsModal />
      </div>
    </ProtectedRoute>
  );
}
