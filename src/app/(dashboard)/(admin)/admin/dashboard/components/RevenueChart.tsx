// components/dashboard/RevenueChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";
import { RevenueData } from "../types";

interface RevenueChartProps {
  data: RevenueData[];
  period: string;
  totalRevenue: number;
}

export const RevenueChart = ({
  data,
  period,
  totalRevenue,
}: RevenueChartProps) => {
  const maxRevenue =
    data.length > 0 ? Math.max(...data.map((item) => item.revenue)) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Revenu:{" "}
            <span className="font-bold text-[#FD481A]">
              {formatCurrency(payload[0].value)}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Commandes:{" "}
            <span className="font-bold text-blue-600">
              {payload[0].payload.orders}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getChartTitle = () => {
    const titles: Record<string, string> = {
      day: "Revenus par Heure",
      week: "Revenus par Jour",
      month: "Revenus par Jour (30 derniers jours)",
      year: "Revenus par Mois",
      all: "Revenus par Mois (Toute période)",
    };
    return titles[period] || "Évolution des Revenus";
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Évolution des Revenus
            </h3>
            <p className="text-sm text-gray-500">
              Aucune donnée disponible pour cette période
            </p>
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Aucun revenu à afficher</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {getChartTitle()}
            </h3>
            <p className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-bold text-[#FD481A]">
                {formatCurrency(totalRevenue)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FD481A] rounded"></div>
            <span className="text-sm text-gray-600">Revenus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Commandes</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="period"
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value.toString();
              }}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="revenue"
              name="Revenus (FCFA)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.revenue === maxRevenue ? "#FD481A" : "#FD8C6E"}
                  fillOpacity={entry.revenue === maxRevenue ? 1 : 0.7}
                />
              ))}
            </Bar>
            <Bar
              dataKey="orders"
              name="Commandes"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              fill="#3B82F6"
              fillOpacity={0.7}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center md:text-left">
            <div className="text-sm text-gray-500">Période moyenne</div>
            <div className="font-bold text-gray-900">
              {calculateAverageRevenue(data)} FCFA
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Pic de revenus</div>
            <div className="font-bold text-[#FD481A]">
              {formatCurrency(maxRevenue)}
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-sm text-gray-500">Total commandes</div>
            <div className="font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.orders, 0)}
            </div>
          </div>
        </div>
      </div>
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

const calculateAverageRevenue = (data: RevenueData[]): number => {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  return Math.round(total / data.length);
};
