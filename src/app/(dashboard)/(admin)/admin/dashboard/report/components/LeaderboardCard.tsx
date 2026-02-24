"use client";

import { Award, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface LeaderboardCardProps {
  leaderboard: any;
  className?: string;
}

export const LeaderboardCard = ({ leaderboard, className = "" }: LeaderboardCardProps) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Classement des Livreurs</h3>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Total: {leaderboard.totals.current.toLocaleString()} FCFA
        </div>
      </div>

      <div className="space-y-4">
        {leaderboard.couriers.map((item: any, index: number) => {
          const deltaAmount = item.delta.totalAmount;
          const deltaPct = item.delta.totalAmountPct;

          return (
            <div 
              key={item.courierId}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? "bg-yellow-400 text-white" : 
                  index === 1 ? "bg-gray-300 text-gray-700" : 
                  index === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{item.courierName}</div>
                  <div className="text-xs text-gray-500">{item.current.courses} courses • {item.current.successRate}% succès</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {item.current.totalAmount.toLocaleString()} FCFA
                </div>
                <div className={`flex items-center justify-end gap-1 text-xs font-medium ${
                  deltaAmount > 0 ? "text-green-600" : deltaAmount < 0 ? "text-red-600" : "text-gray-400"
                }`}>
                  {deltaAmount > 0 ? <TrendingUp className="w-3 h-3" /> : deltaAmount < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {deltaPct !== null ? `${Math.abs(deltaPct)}%` : `${Math.abs(deltaAmount).toLocaleString()} FCFA`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
