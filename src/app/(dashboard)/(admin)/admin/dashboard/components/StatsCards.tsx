// components/dashboard/StatsCards.tsx
import { DollarSign, Package, TrendingUp, CheckCircle } from "lucide-react";
import { DashboardStats } from "../types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Revenus Totaux",
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      color: "bg-green-100",
      description: "Revenus générés",
      trend: "+12.5%",
      positive: true,
    },
    {
      title: "Commandes Total",
      value: stats.totalOrders.toString(),
      icon: <Package className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100",
      description: "Commandes effectuées",
      trend: "+8.2%",
      positive: true,
    },
    {
      title: "Commandes Actives",
      value: stats.activeOrders.toString(),
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-100",
      description: "En cours de traitement",
      trend: "+5.1%",
      positive: true,
    },
    {
      title: "Taux de Livraison",
      value: `${stats.deliveryRate}%`,
      icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-100",
      description: "Commandes livrées",
      trend: "+2.3%",
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <div className={`p-2 rounded-full ${card.color}`}>{card.icon}</div>
          </div>
          <div className="mb-2">
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <p className="text-sm text-gray-500 mt-1">{card.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                card.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {card.trend}
            </span>
            <span className="text-xs text-gray-500">vs période précédente</span>
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
    maximumFractionDigits: 0,
  }).format(amount);
};
