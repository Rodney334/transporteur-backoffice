
import { Calendar as CalendarIcon, Filter, Download, FileText } from "lucide-react";
import { ReportPeriod, SummaryPeriod } from "@/type/report.type";
import { useState } from "react";
import { reportService } from "@/lib/services/report-service";
import { toast } from "react-toastify";

interface ReportFiltersProps {
    period: ReportPeriod;
    date: string;
    onPeriodChange: (period: ReportPeriod) => void;
    onDateChange: (date: string) => void;
    onRefresh: () => void;
    isLoading: boolean;
}

export const ReportFilters = ({
    period,
    date,
    onPeriodChange,
    onDateChange,
    onRefresh,
    isLoading,
}: ReportFiltersProps) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
            const blob = await reportService.downloadPDF(period, date);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rapport-livreurs-${period}-${date}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Rapport PDF téléchargé avec succès");
        } catch (error) {
            console.error("Erreur lors du téléchargement PDF:", error);
            toast.error("Échec du téléchargement du rapport PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    const periodOptions: { value: ReportPeriod; label: string }[] = [
        { value: SummaryPeriod.DAY, label: "Jour" },
        { value: SummaryPeriod.WEEK, label: "Semaine" },
        { value: SummaryPeriod.MONTH, label: "Mois" },
    ];

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    {periodOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => onPeriodChange(option.value)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === option.value
                                ? "bg-white text-[#FD481A] shadow-sm border border-gray-100"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => onDateChange(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FD481A] focus:border-transparent outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isLoading || isDownloading}
                    className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                    {isDownloading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    ) : (
                        <FileText className="w-4 h-4 text-red-500" />
                    )}
                    PDF
                </button>

                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="flex-1 md:flex-none px-4 py-2 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors disabled:opacity-70 text-sm flex items-center justify-center gap-2"
                >
                    <Filter className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    Actualiser
                </button>
            </div>
        </div>
    );
};
