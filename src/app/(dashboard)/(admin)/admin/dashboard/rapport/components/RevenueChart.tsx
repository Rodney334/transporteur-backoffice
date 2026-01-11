// components/reports/RevenueChart.tsx
"use client";

import { useState } from "react";
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
import { Calendar, TrendingUp } from "lucide-react";
import { formatAmount } from "../utils/report-transformer";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface RevenueChartProps {
  dailyData: Array<{ date: string; total: number; count: number }>;
  weeklyData: Array<{ week: string; total: number; count: number }>;
  monthlyData: Array<{ month: string; total: number; count: number }>;
}

export const RevenueChart = ({
  dailyData,
  weeklyData,
  monthlyData,
}: RevenueChartProps) => {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );

  const getData = () => {
    switch (period) {
      case "daily":
        return dailyData.map((item) => ({
          period: format(parseISO(item.date), "dd MMM", { locale: fr }),
          revenue: item.total,
          courses: item.count,
        }));
      case "weekly":
        return weeklyData.map((item) => ({
          period: `Sem ${item.week.split("-W")[1]}`,
          revenue: item.total,
          courses: item.count,
        }));
      case "monthly":
        return monthlyData.map((item) => ({
          period: format(parseISO(`${item.month}-01`), "MMM yyyy", {
            locale: fr,
          }),
          revenue: item.total,
          courses: item.count,
        }));
    }
  };

  const data = getData();
  const maxRevenue = Math.max(...data.map((item) => item.revenue));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Revenu:{" "}
            <span className="font-bold text-[#FD481A]">
              {formatAmount(payload[0].value)}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Courses:{" "}
            <span className="font-bold text-blue-600">
              {payload[0].payload.courses}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Évolution des Revenus
            </h3>
            <p className="text-sm text-gray-500">
              Analyse des revenus par période
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? "bg-[#FD481A] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p === "daily" && "Journalier"}
              {p === "weekly" && "Hebdomadaire"}
              {p === "monthly" && "Mensuel"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="revenue"
              name="Revenu (FCFA)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.revenue === maxRevenue ? "#FD481A" : "#FD481A"}
                  fillOpacity={entry.revenue === maxRevenue ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            Dernière mise à jour:{" "}
            {format(new Date(), "dd MMMM yyyy", { locale: fr })}
          </span>
        </div>
      </div>
    </div>
  );
};
