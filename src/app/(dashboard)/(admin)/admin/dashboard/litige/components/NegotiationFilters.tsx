// components/negotiations/NegotiationFilters.tsx
import { NegotiationStatus } from "@/type/enum";
import { Search, Filter, AlertTriangle } from "lucide-react";

interface NegotiationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: NegotiationStatus | "all";
  onStatusFilterChange: (status: NegotiationStatus | "all") => void;
  stats: {
    total: number;
    inConflict: number;
    pending: number;
    resolved: number;
  };
}

export const NegotiationFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stats,
}: NegotiationFiltersProps) => {
  const statusOptions = [
    { value: "all", label: "Tous les statuts", color: "bg-gray-500" },
    {
      value: NegotiationStatus.EN_CONFLIT,
      label: "En conflit",
      color: "bg-red-500",
    },
    {
      value: NegotiationStatus.EN_ATTENTE,
      label: "En attente",
      color: "bg-yellow-500",
    },
    {
      value: NegotiationStatus.EN_DISCUSSION,
      label: "En discussion",
      color: "bg-blue-500",
    },
    {
      value: NegotiationStatus.PRIX_VALIDE,
      label: "Prix validé",
      color: "bg-green-500",
    },
    {
      value: NegotiationStatus.ARBITRE,
      label: "Arbitré",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#FD481A] rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Litiges
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les conflits de négociation entre livreurs et clients
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Total litiges</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-sm text-red-600 mb-1">En conflit</div>
            <div className="text-2xl font-bold text-red-700">
              {stats.inConflict}
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="text-sm text-yellow-600 mb-1">En attente</div>
            <div className="text-2xl font-bold text-yellow-700">
              {stats.pending}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-sm text-green-600 mb-1">Validés</div>
            <div className="text-2xl font-bold text-green-700">
              {stats.resolved}
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher par référence, ville, livreur, client ou montant..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Filtre par statut */}
          <div className="w-full md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="mt-4 flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusFilterChange(option.value as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                statusFilter === option.value
                  ? "bg-[#FD481A] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
