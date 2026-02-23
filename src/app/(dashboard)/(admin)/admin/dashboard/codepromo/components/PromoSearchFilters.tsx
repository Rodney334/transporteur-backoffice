// components/PromoSearchFilters.tsx
import { Search, Filter, Calendar, Tag, Power } from "lucide-react";

interface PromoSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: "all" | "active" | "inactive";
  onActiveFilterChange: (value: "all" | "active" | "inactive") => void;
  dateRangeFilter: { start: string; end: string };
  onDateRangeFilterChange: (range: { start: string; end: string }) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  filteredItems: number;
}

const itemsPerPageOptions = [10, 25, 50, 100];
const activeOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "active", label: "Actifs" },
  { value: "inactive", label: "Inactifs" },
];

export default function PromoSearchFilters({
  searchTerm,
  onSearchChange,
  activeFilter,
  onActiveFilterChange,
  dateRangeFilter,
  onDateRangeFilterChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  filteredItems,
}: PromoSearchFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par code promo..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
        />
      </div>

      {/* Filtres avancés */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par statut actif/inactif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Power className="w-4 h-4 inline mr-1" />
              Statut
            </label>
            <select
              value={activeFilter}
              onChange={(e) =>
                onActiveFilterChange(
                  e.target.value as "all" | "active" | "inactive",
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
            >
              {activeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par plage de dates */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Plage de dates (création)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRangeFilter.start}
                onChange={(e) =>
                  onDateRangeFilterChange({
                    ...dateRangeFilter,
                    start: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
              />
              <input
                type="date"
                value={dateRangeFilter.end}
                onChange={(e) =>
                  onDateRangeFilterChange({
                    ...dateRangeFilter,
                    end: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
              />
            </div>
          </div>
        </div>

        {/* Statistiques des filtres */}
        <div className="lg:w-64">
          <div className="h-full bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total codes</span>
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
                {totalItems - filteredItems} code(s) masqué(s)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
