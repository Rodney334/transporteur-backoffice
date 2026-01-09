// components/dashboard/ExportPanel.tsx
"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { exportDashboardToPDF } from "../dashboard-pdf-export";
import { exportDashboardToCSV } from "../dashboard-csv-export";
import { DashboardStats, DashboardFilters } from "../types";
interface ExportPanelProps {
  stats: DashboardStats;
  filters: DashboardFilters;
  lastUpdated: Date | null;
}

export const ExportPanel = ({
  stats,
  filters,
  lastUpdated,
}: ExportPanelProps) => {
  const [isExporting, setIsExporting] = useState<"pdf" | "csv" | null>(null);
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeTopPerformers: true,
    includeRecentOrders: true,
    includeAdvancedMetrics: true,
  });

  const handleExport = async (format: "pdf" | "csv") => {
    setIsExporting(format);
    const toastId = toast.loading(`Exportation en ${format.toUpperCase()}...`, {
      position: "top-center",
    });

    try {
      if (format === "pdf") {
        await exportDashboardToPDF(stats, filters, exportOptions, lastUpdated);
      } else {
        await exportDashboardToCSV(stats, filters, exportOptions);
      }

      toast.update(toastId, {
        render: `Export ${format.toUpperCase()} réussi !`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      console.log(`Erreur lors de l'export ${format}:`, error);

      toast.update(toastId, {
        render: "Erreur lors de l'export",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
          <Download className="w-5 h-5 text-[#FD481A]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Exporter le Dashboard
          </h3>
          <p className="text-sm text-gray-500">
            Téléchargez les statistiques au format PDF ou CSV
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Options d'export */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-3">Contenu à inclure</h4>

          <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={exportOptions.includeCharts}
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  includeCharts: e.target.checked,
                }))
              }
              className="mt-1 rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Graphiques</div>
              <div className="text-sm text-gray-500 mt-1">
                Graphiques des revenus et tendances
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={exportOptions.includeTopPerformers}
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  includeTopPerformers: e.target.checked,
                }))
              }
              className="mt-1 rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Top Performers</div>
              <div className="text-sm text-gray-500 mt-1">
                Clients et livreurs
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={exportOptions.includeRecentOrders}
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  includeRecentOrders: e.target.checked,
                }))
              }
              className="mt-1 rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                Commandes récentes
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Dernières commandes
              </div>
            </div>
          </label>
        </div>

        {/* Boutons d'export */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-3">Format d'export</h4>

          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-linear-to-r from-[#FD481A] to-[#E63F15] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-5 h-5" />
            Exporter en PDF
          </button>

          <button
            onClick={() => handleExport("csv")}
            disabled={isExporting !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Exporter en CSV
          </button>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Période</span>
            </div>
            <div className="text-sm text-gray-600">
              {getPeriodLabel(filters.period)}
            </div>
          </div>
        </div>

        {/* Conseils */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 mb-3">Conseils d'export</h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>PDF</strong> : Pour impression et présentation
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>CSV</strong> : Pour analyse dans Excel
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Les PDF incluent des graphiques vectoriels</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Les CSV sont compatibles Excel/Sheets</span>
            </li>
          </ul>
        </div>
      </div>

      {isExporting && (
        <div className="mt-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-[#FD481A] border-t-transparent rounded-full animate-spin"></div>
            <span>Génération du {isExporting.toUpperCase()}...</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-[#FD481A] h-1.5 rounded-full animate-pulse"
              style={{ width: isExporting === "pdf" ? "70%" : "40%" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

const getPeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    day: "Aujourd'hui",
    week: "Cette semaine",
    month: "Ce mois",
    year: "Cette année",
    all: "Toute période",
  };
  return labels[period] || period;
};
