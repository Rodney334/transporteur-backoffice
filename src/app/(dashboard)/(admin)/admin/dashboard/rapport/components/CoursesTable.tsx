// components/reports/CoursesTable.tsx
import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import {
  formatAmount,
  formatDate,
  formatTime,
  getStatusColor,
  getStatusLabel,
} from "../utils/report-transformer";
import { OrderStatus } from "@/type/enum";

interface CoursesTableProps {
  courses: Array<{
    orderId: string;
    date: string;
    fromCity: string;
    toCity: string;
    amount: number;
    status: OrderStatus;
    courierId: string;
    isSuccess: boolean;
    isFailed: boolean;
  }>;
  activeFilter: OrderStatus | "all";
  onFilterChange: (filter: OrderStatus | "all") => void;
  onExport?: () => void;
}

export const CoursesTable = ({
  courses,
  activeFilter,
  onFilterChange,
  onExport,
}: CoursesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filtrage et tri
  const filteredCourses = courses
    .filter((course) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          course.fromCity.toLowerCase().includes(term) ||
          course.toCity.toLowerCase().includes(term) ||
          course.orderId.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortColumn === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortColumn === "amount") {
        comparison = a.amount - b.amount;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const statusFilters: Array<{ value: OrderStatus | "all"; label: string }> = [
    { value: "all", label: "Toutes" },
    { value: OrderStatus.LIVREE, label: "Livrées" },
    { value: OrderStatus.EN_LIVRAISON, label: "En livraison" },
    { value: OrderStatus.PRIX_VALIDE, label: "Prix validé" },
    { value: OrderStatus.ASSIGNEE, label: "Assignées" },
    { value: OrderStatus.ECHEC, label: "Échecs" },
  ];

  const SortIcon = ({ column }: { column: "date" | "amount" }) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* En-tête du tableau */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Historique des Courses
          </h3>
          <p className="text-sm text-gray-500">
            {filteredCourses.length} course
            {filteredCourses.length > 1 ? "s" : ""} trouvée
            {filteredCourses.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une ville ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Bouton d'export */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          )}
        </div>
      </div>

      {/* Filtres de statut */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? "bg-[#FD481A] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Date
                <button
                  onClick={() => {
                    setSortColumn("date");
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  }}
                  className="ml-2 inline-flex items-center"
                >
                  <SortIcon column="date" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Trajet
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Montant
                <button
                  onClick={() => {
                    setSortColumn("amount");
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  }}
                  className="ml-2 inline-flex items-center"
                >
                  <SortIcon column="amount" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Statut
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <React.Fragment key={`fragment-${course.orderId}`}>
                <tr
                  key={course.orderId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(course.date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(course.date)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {course.fromCity} → {course.toCity}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {course.orderId.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900">
                        {formatAmount(course.amount)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        course.status
                      )}`}
                    >
                      {getStatusLabel(course.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() =>
                        setExpandedRow(
                          expandedRow === course.orderId ? null : course.orderId
                        )
                      }
                      className="text-[#FD481A] hover:text-[#E63F15] text-sm font-medium"
                    >
                      {expandedRow === course.orderId ? "Masquer" : "Détails"}
                    </button>
                  </td>
                </tr>
                {expandedRow === course.orderId && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="py-4 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Informations
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">
                                ID Commande:
                              </span>
                              <span className="font-medium">
                                {course.orderId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">ID Livreur:</span>
                              <span className="font-medium">
                                {course.courierId.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Statut
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  course.isSuccess
                                    ? "bg-green-500"
                                    : course.isFailed
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                              />
                              <span>
                                {course.isSuccess
                                  ? "Succès"
                                  : course.isFailed
                                  ? "Échec"
                                  : "En cours"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Actions
                          </h4>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                              Voir détails
                            </button>
                            <button className="px-3 py-1 bg-[#FD481A] text-white text-sm rounded-lg hover:bg-[#E63F15]">
                              Suivre
                            </button>
                          </div>
                        </div> */}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">Aucune course trouvée</div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-[#FD481A] hover:text-[#E63F15] text-sm"
            >
              Réinitialiser la recherche
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Affichage de 1 à {Math.min(filteredCourses.length, 10)} sur{" "}
            {filteredCourses.length} courses
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Précédent
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
