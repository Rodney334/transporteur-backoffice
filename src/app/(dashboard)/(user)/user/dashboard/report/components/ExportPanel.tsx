// components/reports/ExportPanel.tsx
"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { exportToPDF } from "../utils/pdf-export";
import { exportToCSV } from "../utils/csv-export";
import { ClientReport } from "../types/types";

interface ExportPanelProps {
  report: ClientReport;
  stats: any;
  onExportComplete?: () => void;
}

export const ExportPanel = ({
  report,
  stats,
  onExportComplete,
}: ExportPanelProps) => {
  const [isExporting, setIsExporting] = useState<"pdf" | "csv" | null>(null);
  const [exportOptions, setExportOptions] = useState({
    includeCourses: true,
    includeCharts: false, // Les graphiques ne sont pas dans le CSV
    includeStats: true,
  });

  const handleExport = async (format: "pdf" | "csv") => {
    if (!report || !report.courses || report.courses.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    setIsExporting(format);
    const toastId = toast.loading(
      format === "pdf"
        ? "Génération du PDF en cours..."
        : "Génération du CSV en cours...",
      { position: "top-center" }
    );

    try {
      if (format === "pdf") {
        await exportToPDF(report, stats, {
          includeCourses: exportOptions.includeCourses,
          includeCharts: exportOptions.includeCharts,
          includeStats: exportOptions.includeStats,
        });
      } else {
        await exportToCSV(report, {
          includeCourses: exportOptions.includeCourses,
          includeCharts: false, // CSV ne supporte pas les graphiques
          includeStats: exportOptions.includeStats,
        });
      }

      toast.update(toastId, {
        render: `Export ${format.toUpperCase()} réussi !`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
      });

      onExportComplete?.();
    } catch (error: any) {
      console.error(`Erreur lors de l'export ${format}:`, error);

      let errorMessage = `Erreur lors de l'export ${format.toUpperCase()}`;
      if (error.message?.includes("Failed to execute 'createObjectURL'")) {
        errorMessage =
          "Erreur de création du fichier. Vérifiez les permissions de votre navigateur.";
      } else if (error.message?.includes("writeFile")) {
        errorMessage =
          "Impossible d'écrire le fichier. Essayez avec un autre navigateur.";
      }

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        hideProgressBar: false,
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
            Exporter le Rapport
          </h3>
          <p className="text-sm text-gray-500">
            Téléchargez votre rapport au format PDF ou CSV
          </p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {report.courses.length}
          </div>
          <div className="text-xs text-gray-500">Courses</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            {new Intl.DateTimeFormat("fr-FR").format(
              new Date(report.courses[0]?.date || Date.now())
            )}
          </div>
          <div className="text-xs text-gray-500">Dernière</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat("fr-FR").format(report.totalAmount)} FCFA
          </div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">
            {stats?.successRate || 0}%
          </div>
          <div className="text-xs text-gray-500">Réussite</div>
        </div>
      </div>

      {/* Options d'export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Options d'export</h4>

          <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={exportOptions.includeCourses}
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  includeCourses: e.target.checked,
                }))
              }
              className="mt-1 rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Liste des courses</div>
              <div className="text-sm text-gray-500 mt-1">
                {report.courses.length} course
                {report.courses.length > 1 ? "s" : ""}
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={exportOptions.includeStats}
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  includeStats: e.target.checked,
                }))
              }
              className="mt-1 rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Statistiques</div>
              <div className="text-sm text-gray-500 mt-1">
                Principales et périodiques
              </div>
            </div>
          </label>

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
              disabled={true}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Graphiques</div>
              <div className="text-sm text-gray-500 mt-1">
                Uniquement en PDF
              </div>
            </div>
          </label>
        </div>

        {/* Format d'export */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Format</h4>

          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting !== null}
            className="w-full flex items-center justify-between p-4 bg-linear-to-r from-[#FD481A]/10 to-[#FD481A]/5 border-2 border-[#FD481A]/20 rounded-xl hover:border-[#FD481A]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FD481A] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">PDF</div>
                <div className="text-sm text-gray-500">Avec mise en page</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Taille estimée</div>
              <div className="font-medium">~500KB</div>
            </div>
          </button>

          <button
            onClick={() => handleExport("csv")}
            disabled={isExporting !== null}
            className="w-full flex items-center justify-between p-4 bg-linear-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">CSV/Excel</div>
                <div className="text-sm text-gray-500">Données brutes</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Taille estimée</div>
              <div className="font-medium">~50KB</div>
            </div>
          </button>
        </div>

        {/* Informations */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">
                Conseils d'export
              </h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>PDF</strong> : Pour impression et partage
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
                  <span>Les données sont exportées en UTF-8</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Format français (point-virgule)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de progression */}
      {isExporting && (
        <div className="mb-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-[#FD481A] border-t-transparent rounded-full animate-spin"></div>
            <span>
              Génération du {isExporting.toUpperCase()}...
              {isExporting === "pdf" ? " (peut prendre quelques secondes)" : ""}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-[#FD481A] h-1.5 rounded-full animate-pulse"
              style={{ width: isExporting === "pdf" ? "70%" : "40%" }}
            ></div>
          </div>
        </div>
      )}

      {/* Note de bas de page */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Généré automatiquement</span>
          </div>
          <div className="text-gray-500">
            Compatible Excel, Numbers, Google Sheets
          </div>
        </div>
      </div>
    </div>
  );
};

// // components/reports/ExportPanel.tsx
// "use client";

// import { useState } from "react";
// import {
//   Download,
//   FileText,
//   FileSpreadsheet,
//   Calendar,
//   Check,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import { exportToPDF } from "../utils/pdf-export";
// import { exportToCSV } from "../utils/csv-export";
// import { ClientReport } from "../types/types";

// interface ExportPanelProps {
//   report: ClientReport;
//   stats: any;
//   onExportComplete?: () => void;
// }

// export const ExportPanel = ({
//   report,
//   stats,
//   onExportComplete,
// }: ExportPanelProps) => {
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportOptions, setExportOptions] = useState({
//     includeCourses: true,
//     includeCharts: true,
//     includeStats: true,
//   });

//   const handleExport = async (format: "pdf" | "csv") => {
//     setIsExporting(true);
//     const toastId = toast.loading(`Exportation en ${format.toUpperCase()}...`);

//     try {
//       if (format === "pdf") {
//         await exportToPDF(report, stats, exportOptions);
//       } else {
//         await exportToCSV(report, exportOptions);
//       }

//       toast.update(toastId, {
//         render: `Export ${format.toUpperCase()} réussi`,
//         type: "success",
//         isLoading: false,
//         autoClose: 3000,
//       });

//       onExportComplete?.();
//     } catch (error) {
//       console.error("Erreur lors de l'export:", error);
//       toast.update(toastId, {
//         render: "Erreur lors de l'export",
//         type: "error",
//         isLoading: false,
//         autoClose: 5000,
//       });
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
//           <Download className="w-5 h-5 text-[#FD481A]" />
//         </div>
//         <div>
//           <h3 className="text-lg font-bold text-gray-900">
//             Exporter le Rapport
//           </h3>
//           <p className="text-sm text-gray-500">
//             Téléchargez votre rapport au format PDF ou CSV
//           </p>
//         </div>
//       </div>

//       {/* Options d'export */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="space-y-3">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={exportOptions.includeCourses}
//               onChange={(e) =>
//                 setExportOptions((prev) => ({
//                   ...prev,
//                   includeCourses: e.target.checked,
//                 }))
//               }
//               className="rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
//             />
//             <span className="text-sm text-gray-700">Inclure les courses</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={exportOptions.includeStats}
//               onChange={(e) =>
//                 setExportOptions((prev) => ({
//                   ...prev,
//                   includeStats: e.target.checked,
//                 }))
//               }
//               className="rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
//             />
//             <span className="text-sm text-gray-700">
//               Inclure les statistiques
//             </span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={exportOptions.includeCharts}
//               onChange={(e) =>
//                 setExportOptions((prev) => ({
//                   ...prev,
//                   includeCharts: e.target.checked,
//                 }))
//               }
//               className="rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
//             />
//             <span className="text-sm text-gray-700">
//               Inclure les graphiques
//             </span>
//           </label>
//         </div>

//         {/* Info de rapport */}
//         <div className="bg-gray-50 rounded-lg p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <Calendar className="w-4 h-4 text-gray-400" />
//             <span className="text-sm font-medium text-gray-700">
//               Détails du rapport
//             </span>
//           </div>
//           <div className="text-sm text-gray-600 space-y-1">
//             <div>Courses: {report.courses.length}</div>
//             <div>Période: {new Date().getFullYear()}</div>
//             <div>Format disponible: PDF/CSV</div>
//           </div>
//         </div>

//         {/* Boutons d'export */}
//         <div className="flex flex-col gap-3">
//           <button
//             onClick={() => handleExport("pdf")}
//             disabled={isExporting}
//             className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <FileText className="w-5 h-5" />
//             Exporter en PDF
//           </button>
//           <button
//             onClick={() => handleExport("csv")}
//             disabled={isExporting}
//             className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <FileSpreadsheet className="w-5 h-5" />
//             Exporter en CSV
//           </button>
//         </div>
//       </div>

//       {/* Note */}
//       <div className="pt-4 border-t border-gray-100">
//         <div className="flex items-start gap-2">
//           <Check className="w-4 h-4 text-green-600 mt-0.5" />
//           <p className="text-sm text-gray-500">
//             Les données sont exportées avec les dernières informations
//             disponibles. Les PDF incluent des graphiques vectoriels de haute
//             qualité.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
