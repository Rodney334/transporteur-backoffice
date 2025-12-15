// app/(dashboard)/utilisateur/components/UserSearchFilters.tsx
import { Search, Filter, Users } from "lucide-react";
import { GrantedRole } from "@/type/enum";

interface UserSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: GrantedRole | "all";
  onRoleFilterChange: (value: GrantedRole | "all") => void;
  archivedFilter: "all" | "active" | "archived";
  onArchivedFilterChange: (value: "all" | "active" | "archived") => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  filteredItems: number;
}

const roleOptions = [
  { value: "all", label: "Tous les rôles" },
  { value: GrantedRole.Admin, label: "Administrateur" },
  { value: GrantedRole.Livreur, label: "Livreur" },
  { value: GrantedRole.Operateur, label: "Opérateur" },
  { value: GrantedRole.Client, label: "Client" },
  { value: GrantedRole.User, label: "Utilisateur" },
];

const itemsPerPageOptions = [10, 25, 50, 100];

export default function UserSearchFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  archivedFilter,
  onArchivedFilterChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  filteredItems,
}: UserSearchFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par nom, email, téléphone ou rôle..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
        />
      </div>

      {/* Filtres avancés */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Rôle
            </label>
            <select
              value={roleFilter}
              onChange={(e) =>
                onRoleFilterChange(e.target.value as GrantedRole | "all")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par statut archivé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={archivedFilter}
              onChange={(e) =>
                onArchivedFilterChange(
                  e.target.value as "all" | "active" | "archived"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="archived">Archivés</option>
            </select>
          </div>

          {/* Nombre d'éléments par page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Éléments par page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistiques des filtres */}
        <div className="lg:w-64">
          <div className="h-full bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total</span>
              <span className="font-medium text-gray-900">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Filtrés</span>
              <span className="font-medium text-[#FD481A]">
                {filteredItems}
              </span>
            </div>
            {filteredItems < totalItems && (
              <div className="mt-2 text-xs text-gray-400">
                {totalItems - filteredItems} utilisateur(s) masqué(s)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
