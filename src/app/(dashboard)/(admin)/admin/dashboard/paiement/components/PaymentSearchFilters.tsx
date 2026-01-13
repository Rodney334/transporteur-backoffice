import { Search, Filter, Calendar, CreditCard } from "lucide-react";
import { PaymentStatus, PaymentMethod } from "@/type/enum";

interface PaymentSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: PaymentStatus | "all";
  onStatusFilterChange: (value: PaymentStatus | "all") => void;
  methodFilter: PaymentMethod | "all";
  onMethodFilterChange: (value: PaymentMethod | "all") => void;
  dateRangeFilter: { start: string; end: string };
  onDateRangeFilterChange: (range: { start: string; end: string }) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  filteredItems: number;
}

const itemsPerPageOptions = [10, 25, 50, 100];
const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: PaymentStatus.PENDING, label: "En attente" },
  { value: PaymentStatus.PAID, label: "Payé" },
  { value: PaymentStatus.FAILED, label: "Échoué" },
];

const methodOptions = [
  { value: "all", label: "Toutes les méthodes" },
  { value: PaymentMethod.CASH, label: "Espèces" },
  { value: PaymentMethod.MOBILE_MONEY, label: "Mobile Money" },
  { value: PaymentMethod.CARD, label: "Carte" },
];

export default function PaymentSearchFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  methodFilter,
  onMethodFilterChange,
  dateRangeFilter,
  onDateRangeFilterChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  filteredItems,
}: PaymentSearchFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par client, ID de commande..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
        />
      </div>

      {/* Filtres avancés */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtre par statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Statut du paiement
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as PaymentStatus | "all")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par méthode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Méthode de paiement
            </label>
            <select
              value={methodFilter}
              onChange={(e) =>
                onMethodFilterChange(e.target.value as PaymentMethod | "all")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
            >
              {methodOptions.map((option) => (
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
              Plage de dates
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
              <span className="text-sm text-gray-500">Total paiements</span>
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
                {totalItems - filteredItems} paiement(s) masqué(s)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
