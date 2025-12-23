// components/reports/LivreurStatsCard.tsx
import { LivreurSummary, GlobalStats } from "../lib/parsers/report-parser";
import { User, TrendingUp, MapPin, Users, Calendar, Award } from "lucide-react";
import { extractAmountValue } from "../lib/parsers/report-parser";

interface LivreurStatsCardProps {
  summary: LivreurSummary;
  stats: GlobalStats;
  className?: string;
}

export const LivreurStatsCard = ({
  summary,
  stats,
  className = "",
}: LivreurStatsCardProps) => {
  const totalAmount = extractAmountValue(summary.totalAmount);
  const paidAmount = extractAmountValue(summary.paid);
  const pendingAmount = extractAmountValue(summary.pending);
  const paidPercentage =
    totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{summary.name}</h3>
            <p className="text-sm text-gray-500">
              {summary.coursesCount} courses • {summary.totalAmount}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {summary.totalAmount}
          </div>
          <div className="text-sm text-gray-500">Total généré</div>
        </div>
      </div>

      {/* Barre de progression des paiements */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Paiements reçus</span>
          <span>{paidPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full"
            style={{ width: `${paidPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-green-600">✅ {summary.paid}</span>
          <span className="text-xs text-yellow-600">⏳ {summary.pending}</span>
          <span className="text-xs text-red-600">❌ {summary.failed}</span>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Taux de succès
            </span>
          </div>
          <div className="text-xl font-bold text-blue-700">
            {stats.successRate}
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Meilleure ville
            </span>
          </div>
          <div className="text-lg font-semibold text-purple-700">
            {stats.bestCity}
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Meilleur client
            </span>
          </div>
          <div className="text-lg font-semibold text-green-700">
            {stats.bestClient}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              Performance
            </span>
          </div>
          <div className="text-lg font-semibold text-orange-700">
            {stats.bestDay}
          </div>
        </div>
      </div>
    </div>
  );
};
