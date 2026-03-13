// utils/report-transformer.ts
import { ClientReport, CourseStats, CityStats } from "../types/types";
import { OrderStatus } from "@/type/enum";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

// Formater les montants en FCFA
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Formater les dates
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "dd MMMM yyyy", { locale: fr });
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "HH:mm", { locale: fr });
  } catch {
    return "";
  }
};

export const transformReportData = (report: ClientReport) => {
  // Statistiques des courses
  const successfulCourses = report.courses.filter(
    (c) => c.status === OrderStatus.LIVREE
  ).length;
  const failedCourses = report.courses.filter(
    (c) => c.status === OrderStatus.ECHEC
  ).length;
  const pendingCourses = report.courses.filter((c) =>
    [
      OrderStatus.EN_ATTENTE,
      OrderStatus.ASSIGNEE,
      OrderStatus.EN_DISCUSSION,
      OrderStatus.PRIX_VALIDE,
      OrderStatus.EN_LIVRAISON,
    ].includes(c.status)
  ).length;

  const courseStats: CourseStats = {
    totalCourses: report.totalCourses,
    successfulCourses,
    failedCourses,
    pendingCourses,
    successRate:
      report.totalCourses > 0
        ? Math.round((successfulCourses / report.totalCourses) * 100)
        : 0,
    totalRevenue: report.totalAmount,
    averageRevenuePerCourse:
      report.totalCourses > 0
        ? Math.round(report.totalAmount / report.totalCourses)
        : 0,
  };

  // Statistiques des villes
  const cityFrequency = report.courses.reduce(
    (acc, course) => {
      acc.from[course.fromCity] = (acc.from[course.fromCity] || 0) + 1;
      acc.to[course.toCity] = (acc.to[course.toCity] || 0) + 1;
      return acc;
    },
    { from: {} as Record<string, number>, to: {} as Record<string, number> }
  );

  const allCities = new Set([
    ...report.courses.map((c) => c.fromCity),
    ...report.courses.map((c) => c.toCity),
  ]);

  const cityStats: CityStats = {
    favoriteCity: report.favoriteCity,
    worstCity: report.worstCity,
    favoriteRoute: report.favoriteRoute,
    mostFrequentFromCity:
      Object.entries(cityFrequency.from).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "-",
    mostFrequentToCity:
      Object.entries(cityFrequency.to).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "-",
    totalCities: allCities.size,
  };

  return {
    courseStats,
    cityStats,
  };
};

// Obtenir la couleur du statut
export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.LIVREE]: "bg-green-100 text-green-800",
    [OrderStatus.ECHEC]: "bg-red-100 text-red-800",
    [OrderStatus.EN_LIVRAISON]: "bg-blue-100 text-blue-800",
    [OrderStatus.PRIX_VALIDE]: "bg-yellow-100 text-yellow-800",
    [OrderStatus.EN_DISCUSSION]: "bg-purple-100 text-purple-800",
    [OrderStatus.ASSIGNEE]: "bg-gray-100 text-gray-800",
    [OrderStatus.EN_ATTENTE]: "bg-gray-50 text-gray-600",
    [OrderStatus.CONFLIT]: "bg-purple-100 text-purple-800",
    [OrderStatus.ANNULEE_PAR_CLIENT]: "bg-red-100 text-red-800",
    [OrderStatus.ANNULEE_PAR_LIVREUR]: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Obtenir le libellé du statut
export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.EN_ATTENTE]: "En attente",
    [OrderStatus.ASSIGNEE]: "Assigné",
    [OrderStatus.EN_DISCUSSION]: "En discussion",
    [OrderStatus.PRIX_VALIDE]: "Prix validé",
    [OrderStatus.EN_LIVRAISON]: "En livraison",
    [OrderStatus.LIVREE]: "Livrée",
    [OrderStatus.ECHEC]: "Échec",
    [OrderStatus.CONFLIT]: "En conflit",
    [OrderStatus.ANNULEE_PAR_CLIENT]: "Annulée par le client",
    [OrderStatus.ANNULEE_PAR_LIVREUR]: "Annulée par le livreur",
  };
  return labels[status] || status;
};
