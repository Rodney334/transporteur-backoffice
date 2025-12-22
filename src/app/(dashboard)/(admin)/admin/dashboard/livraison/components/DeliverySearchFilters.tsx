// app/(dashboard)/livraison/components/DeliverySearchFilters.tsx
import { Search, Filter, PackageCheck } from "lucide-react";

interface DeliverySearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  deliveryTypeFilter: string;
  onDeliveryTypeFilterChange: (value: string) => void;
  transportModeFilter: string;
  onTransportModeFilterChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  filteredItems: number;
  deliveryTypes: string[];
  transportModes: string[];
}

const itemsPerPageOptions = [10, 25, 50, 100];

export default function DeliverySearchFilters({
  searchTerm,
  onSearchChange,
  deliveryTypeFilter,
  onDeliveryTypeFilterChange,
  transportModeFilter,
  onTransportModeFilterChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  filteredItems,
  deliveryTypes,
  transportModes,
}: DeliverySearchFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par client, adresse de départ ou d'arrivée..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
        />
      </div>

      {/* Filtres avancés */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par type de livraison */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Type de livraison
            </label>
            <select
              value={deliveryTypeFilter}
              onChange={(e) => onDeliveryTypeFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
            >
              <option value="all">Tous les types</option>
              {deliveryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par mode de transport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de transport
            </label>
            <select
              value={transportModeFilter}
              onChange={(e) => onTransportModeFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
            >
              <option value="all">Tous les modes</option>
              {transportModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
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
              <span className="text-sm text-gray-500">Total livraisons</span>
              <span className="font-medium text-gray-900">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Filtrées</span>
              <span className="font-medium text-[#FD481A]">
                {filteredItems}
              </span>
            </div>
            {filteredItems < totalItems && (
              <div className="mt-2 text-xs text-gray-400">
                {totalItems - filteredItems} livraison(s) masquée(s)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
