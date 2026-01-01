// components/dashboard/AdvancedMetrics.tsx
import { Target, MapPin, Package, TrendingUp } from "lucide-react";
import { DashboardStats } from "../types";

interface AdvancedMetricsProps {
  stats: DashboardStats;
}

export const AdvancedMetrics = ({ stats }: AdvancedMetricsProps) => {
  const metrics = [
    {
      title: "Valeur Moyenne Commande",
      value: formatCurrency(stats.averageOrderValue),
      icon: <Package className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-100",
      description: "Moyenne par commande livrée",
    },
    {
      title: "Ville la Plus Active",
      value: stats.mostActiveCity,
      icon: <MapPin className="w-5 h-5 text-green-600" />,
      color: "bg-green-100",
      description: "Plus de commandes",
    },
    {
      title: "Service Populaire",
      value: capitalizeFirst(stats.mostPopularService),
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-100",
      description: "Type de service",
    },
    {
      title: "Taux de Conversion",
      value: `${stats.conversionRate}%`,
      icon: <Target className="w-5 h-5 text-orange-600" />,
      color: "bg-orange-100",
      description: "Commandes livrées",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              {metric.title}
            </h3>
            <div className={`p-2 rounded-full ${metric.color}`}>
              {metric.icon}
            </div>
          </div>
          <div className="mb-2">
            <div className="text-xl font-bold text-gray-900">
              {metric.value}
            </div>
            <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const capitalizeFirst = (str: string): string => {
  if (!str) return "Aucun";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
