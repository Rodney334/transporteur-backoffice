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
import ColumnVisibilityToggle from "./components/ColumnVisibilityToggle";
import { GrantedRole } from "@/type/enum";

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
  actions: true,
};

export default function UtilisateurPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === GrantedRole.Admin;

  const { users, isLoadingUsers, loadUsers, getRoleLabel, getGenderLabel } =
    useUsersManagement();

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<GrantedRole | "all">("all");
  const [archivedFilter, setArchivedFilter] = useState<
    "all" | "active" | "archived"
  >("all");

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

    return matchesSearch && matchesRole && matchesArchived;
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
  }, [searchTerm, roleFilter, archivedFilter]);

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
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
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Columns className="w-4 h-4" />
            Colonnes
          </button>
        </div>
      </div>

      {/* Toggle des colonnes visibles */}
      {showColumnToggle && (
        <ColumnVisibilityToggle
          visibleColumns={visibleColumns}
          onToggleColumn={(column) =>
            setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
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

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <UserTable
          users={paginatedUsers}
          isLoading={isLoadingUsers}
          visibleColumns={visibleColumns}
          isAdmin={isAdmin}
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

      {/* Modal de changement de rôle (sera utilisé par UserTable) */}
      <RoleChangeModal />
    </div>
  );
}
