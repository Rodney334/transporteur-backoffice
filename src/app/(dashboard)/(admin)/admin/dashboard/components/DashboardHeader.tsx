// components/dashboard/DashboardHeader.tsx
import { BarChart3, Filter, RefreshCw, Calendar } from "lucide-react";
import { DashboardFilters } from "../types";

interface DashboardHeaderProps {
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DashboardHeader = ({
  filters,
  onFilterChange,
  lastUpdated,
  onRefresh,
  isLoading,
}: DashboardHeaderProps) => {
  const periodOptions = [
    { value: "day", label: "Aujourd'hui", icon: "📅" },
    { value: "week", label: "Cette semaine", icon: "📆" },
    { value: "month", label: "Ce mois", icon: "🗓️" },
    { value: "year", label: "Cette année", icon: "📊" },
    { value: "all", label: "Toutes", icon: "∞" },
  ];

  const handlePeriodChange = (period: DashboardFilters["period"]) => {
    onFilterChange({ ...filters, period });
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Jamais";
    return lastUpdated.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FD481A] rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tableau de Bord Commandes
            </h1>
            <p className="text-gray-600 mt-1">
              Analyse et suivi des performances en temps réel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Dernière MAJ: {formatLastUpdated()}</span>
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="font-medium text-gray-900">Filtres</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePeriodChange(option.value as any)}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                filters.period === option.value
                  ? "bg-[#FD481A] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span>{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Indicateur de période active */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-[#FD481A] rounded-full"></div>
            <span>
              Période active:{" "}
              <span className="font-medium">
                {
                  periodOptions.find((opt) => opt.value === filters.period)
                    ?.label
                }
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
