// components/reports/PaymentSummaryCard.tsx
import { PaymentSummary } from "../lib/parsers/report-parser";
import { Wallet, CheckCircle, Clock, XCircle } from "lucide-react";

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
  className?: string;
}

export const PaymentSummaryCard = ({
  summary,
  className = "",
}: PaymentSummaryCardProps) => {
  const getAmountColor = (type: "paid" | "pending" | "failed") => {
    switch (type) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getIcon = (type: "paid" | "pending" | "failed") => {
    switch (type) {
      case "paid":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "failed":
        return <XCircle className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
          <Wallet className="w-6 h-6 text-[#FD481A]" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Résumé des Paiements
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-green-600">{getIcon("paid")}</div>
            <span className="text-sm font-medium text-gray-700">Payés</span>
          </div>
          <div className={`text-xl font-bold ${getAmountColor("paid")}`}>
            {summary.paid}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-yellow-600">{getIcon("pending")}</div>
            <span className="text-sm font-medium text-gray-700">
              En attente
            </span>
          </div>
          <div className={`text-xl font-bold ${getAmountColor("pending")}`}>
            {summary.pending}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-red-600">{getIcon("failed")}</div>
            <span className="text-sm font-medium text-gray-700">Échoués</span>
          </div>
          <div className={`text-xl font-bold ${getAmountColor("failed")}`}>
            {summary.failed}
          </div>
        </div>
      </div>
    </div>
  );
};
