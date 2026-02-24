"use client";

import { KPISchema } from "@/type/report.type";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  CheckCircle, 
  XCircle,
  Tag
} from "lucide-react";

interface KPIStatsCardProps {
  kpis: KPISchema;
  className?: string;
}

export const KPIStatsCard = ({ kpis, className = "" }: KPIStatsCardProps) => {
  const stats = [
    {
      label: "Chiffre d'Affaires",
      value: `${kpis.revenuePaid.toLocaleString()} FCFA`,
      subValue: `${kpis.revenueDelivered.toLocaleString()} FCFA (Livré)`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Taux de Succès",
      value: `${kpis.successRate}%`,
      subValue: `${kpis.delivered} / ${kpis.ordersTotal} commandes`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Commandes Livrées",
      value: kpis.delivered.toString(),
      subValue: `${kpis.ordersTotal} au total`,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "Promos Utilisées",
      value: kpis.promoUsedCount.toString(),
      subValue: `-${kpis.promoDiscountTotal.toLocaleString()} FCFA remis`,
      icon: Tag,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-500">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-xs text-gray-400 mt-1">{stat.subValue}</div>
        </div>
      ))}
    </div>
  );
};
