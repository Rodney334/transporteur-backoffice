// components/reports/ReportHeader.tsx
import { BarChart3, Filter, Download } from "lucide-react";

interface ReportHeaderProps {
  selectedPeriod: "all" | "daily" | "weekly" | "monthly";
  onPeriodChange: (period: "all" | "daily" | "weekly" | "monthly") => void;
  isLoading: boolean;
  onExport?: () => void;
}

export const ReportHeader = ({
  selectedPeriod,
  onPeriodChange,
  isLoading,
  onExport,
}: ReportHeaderProps) => {
  const periodOptions = [
    { value: "all", label: "Tout", icon: "📊" },
    { value: "daily", label: "Journalier", icon: "📅" },
    { value: "weekly", label: "Hebdomadaire", icon: "📆" },
    { value: "monthly", label: "Mensuel", icon: "🗓️" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FD481A] rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de Bord des Rapports
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Suivez les performances et les statistiques des livreurs
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value as any)}
              disabled={isLoading}
              className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200 appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {onExport && (
            <button
              onClick={onExport}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Exporter
            </button>
          )}
        </div>
      </div>

      {/* Indicateurs de période */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-3">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onPeriodChange(option.value as any)}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedPeriod === option.value
                  ? "bg-[#FD481A] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span>{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
