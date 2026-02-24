// components/reports/LivreurStatsCard.tsx
import { CourierSummaryItem } from "@/type/report.type";
import { User, TrendingUp, MapPin, Users, Calendar, Award, CheckCircle, Clock, XCircle, Tag } from "lucide-react";

interface LivreurStatsCardProps {
  summary: CourierSummaryItem;
  className?: string;
}

export const LivreurStatsCard = ({
  summary,
  className = "",
}: LivreurStatsCardProps) => {
  const totalAmount = summary.totals.totalAmount;
  const paidAmount = summary.totals.paid;
  const paidPercentage =
    totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  // Trouver les meilleures villes et clients à partir des courses
  const getTopStats = () => {
    const cities: Record<string, number> = {};
    const clients: Record<string, number> = {};
    
    summary.courses.forEach(c => {
      if (c.toCity) cities[c.toCity] = (cities[c.toCity] || 0) + 1;
      if (c.clientName) clients[c.clientName] = (clients[c.clientName] || 0) + 1;
    });

    const bestCity = Object.entries(cities).sort((a,b) => b[1] - a[1])[0]?.[0] || "N/A";
    const bestClient = Object.entries(clients).sort((a,b) => b[1] - a[1])[0]?.[0] || "N/A";

    return { bestCity, bestClient };
  };

  const { bestCity, bestClient } = getTopStats();

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
            <h3 className="text-lg font-bold text-gray-900">{summary.courierName}</h3>
            <p className="text-sm text-gray-500">
              {summary.totals.courses} courses • {summary.totals.successRate}% succès
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {summary.totals.totalAmount.toLocaleString()} FCFA
          </div>
          <div className="text-sm text-gray-500">Total généré</div>
        </div>
      </div>

      {/* Barre de progression des paiements */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Paiements encaissés</span>
          <span>{paidPercentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${paidPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-3 text-xs">
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>{summary.totals.paid.toLocaleString()} FCFA</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600 font-medium">
            <Clock className="w-3 h-3" />
            <span>{summary.totals.pending.toLocaleString()} FCFA</span>
          </div>
          {summary.totals.failedPayments > 0 && (
            <div className="flex items-center gap-1 text-red-600 font-medium">
              <XCircle className="w-3 h-3" />
              <span>{summary.totals.failedPayments.toLocaleString()} FCFA</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques clés */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
              Succès
            </span>
          </div>
          <div className="text-base font-bold text-blue-700">
            {summary.totals.successRate}%
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
              Top Ville
            </span>
          </div>
          <div className="text-sm font-bold text-purple-700 truncate">
            {bestCity}
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Top Client
            </span>
          </div>
          <div className="text-sm font-bold text-emerald-700 truncate">
            {bestClient}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
              Promos
            </span>
          </div>
          <div className="text-base font-bold text-orange-700">
            {summary.totals.promoCount}
          </div>
        </div>
      </div>
    </div>
  );
};

