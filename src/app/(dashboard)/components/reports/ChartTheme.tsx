// components/reports/ChartTheme.tsx
import { useTheme } from "next-themes";

export const useChartTheme = () => {
  const { theme } = useTheme();

  const colors = {
    primary: "#FD481A",
    secondary: "#E63F15",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    dark: "#1F2937",
    light: "#F3F4F6",
  };

  const chartColors = {
    bar: [
      colors.primary,
      colors.info,
      colors.success,
      colors.warning,
      colors.danger,
    ],
    line: colors.primary,
    area: colors.primary,
    pie: [
      colors.primary,
      colors.info,
      colors.success,
      colors.warning,
      colors.danger,
    ],
  };

  const chartStyles = {
    fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
    fontSize: 12,
    color: theme === "dark" ? "#D1D5DB" : "#374151",
    gridColor: theme === "dark" ? "#374151" : "#E5E7EB",
  };

  return {
    colors,
    chartColors,
    chartStyles,
    isDark: theme === "dark",
  };
};
