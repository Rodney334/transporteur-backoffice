
import { useState } from "react";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { CoursesSchema, CoursesFilters } from "@/type/report.type";
import { CourseItem } from "@/type/report.type";

interface CoursesTableProps {
    courses: CoursesSchema;
    filters: CoursesFilters;
    onFilterChange: (filters: CoursesFilters) => void;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export const CoursesTable = ({
    courses,
    filters,
    onFilterChange,
    page,
    limit,
    onPageChange,
}: CoursesTableProps) => {
    const [showFilters, setShowFilters] = useState(false);

    const StatusBadge = ({ status }: { status: string }) => {
        let color = "bg-gray-100 text-gray-800";
        if (status === "LIVREE") color = "bg-green-100 text-green-800";
        else if (status === "ECHEC") color = "bg-red-100 text-red-800";
        else if (status === "EN_LIVRAISON") color = "bg-blue-100 text-blue-800";

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
                {status}
            </span>
        );
    };

    const PaymentBadge = ({ status }: { status: string }) => {
        let color = "bg-gray-100 text-gray-800";
        if (status === "PAID") color = "bg-green-100 text-green-800";
        else if (status === "FAILED") color = "bg-red-100 text-red-800";
        else if (status === "PENDING") color = "bg-orange-100 text-orange-800";

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-gray-900">Courses ({courses.pagination.total})</h3>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-lg border ${showFilters ? 'bg-gray-100 border-gray-300' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Filter className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            value={filters.status || ""}
                            onChange={(e) => onFilterChange({ ...filters, status: e.target.value || null })}
                            className="w-full text-sm border-gray-300 rounded-lg p-2"
                        >
                            <option value="">Tous</option>
                            <option value="LIVREE">LIVREE</option>
                            <option value="ECHEC">ECHEC</option>
                            <option value="EN_LIVRAISON">EN_LIVRAISON</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Paiement</label>
                        <select
                            value={filters.paymentStatus || ""}
                            onChange={(e) => onFilterChange({ ...filters, paymentStatus: e.target.value || null })}
                            className="w-full text-sm border-gray-300 rounded-lg p-2"
                        >
                            <option value="">Tous</option>
                            <option value="PAID">PAYÉ</option>
                            <option value="PENDING">EN ATTENTE</option>
                            <option value="FAILED">ÉCHOUÉ</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Livreur</th>
                            <th className="px-4 py-3 text-left">Trajet</th>
                            <th className="px-4 py-3 text-left">Montant</th>
                            <th className="px-4 py-3 text-left">Statut</th>
                            <th className="px-4 py-3 text-left">Paiement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.items.map((item) => (
                            <tr key={item.orderId} className="hover:bg-gray-50/50">
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {new Date(item.changedAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {item.courierName}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate" title={`${item.fromCity} → ${item.toCity}`}>
                                    {item.fromCity} → {item.toCity}
                                </td>
                                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                    {item.amount.toLocaleString()} FCFA
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <PaymentBadge status={item.paymentStatus} />
                                </td>
                            </tr>
                        ))}
                        {courses.items.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    Aucune course trouvée pour ces critères.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {courses.pagination.pages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Page {courses.pagination.page} sur {courses.pagination.pages} ({courses.pagination.total} résultats)
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="p-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= courses.pagination.pages}
                            className="p-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
