// components/reports/SummaryCards.tsx
import {
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { formatAmount } from "../utils/report-transformer";

interface SummaryCardsProps {
  stats: {
    totalCourses: number;
    successfulCourses: number;
    failedCourses: number;
    pendingCourses: number;
    totalRevenue: number;
    successRate: number;
    averageRevenuePerCourse: number;
  };
  isLoading?: boolean;
}

export const SummaryCards = ({ stats, isLoading }: SummaryCardsProps) => {
  const cards = [
    {
      title: "Total des Courses",
      value: stats.totalCourses.toString(),
      icon: <Package className="w-6 h-6 text-[#FD481A]" />,
      color: "bg-[#FD481A]/10",
      description: "Courses effectuées",
    },
    {
      title: "Taux de Réussite",
      value: `${stats.successRate}%`,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: "bg-green-100",
      description: `${stats.successfulCourses} livraisons réussies`,
    },
    {
      title: "Total",
      value: formatAmount(stats.totalRevenue),
      icon: <DollarSign className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100",
      description: "Montant total généré",
    },
    {
      title: "Moyenne par Course",
      value: formatAmount(stats.averageRevenuePerCourse),
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-100",
      description: "Revenu moyen",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

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
        </div>
      ))}
    </div>
  );
};
