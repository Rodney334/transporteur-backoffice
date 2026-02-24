"use client";

import { CourierSummaryResponse } from "@/type/report.type";

const escapeCsvField = (field: any): string => {
  if (field === null || field === undefined) return "";
  const stringValue = String(field);
  if (
    stringValue.includes(",") ||
    stringValue.includes(";") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const convertToCSV = (
  data: Record<string, any>[],
  headers: { label: string; key: string }[]
): string => {
  const headerRow = headers.map(h => escapeCsvField(h.label)).join(";");
  const rows = data.map(row =>
    headers.map(h => escapeCsvField(row[h.key] ?? "")).join(";")
  );
  return [headerRow, ...rows].join("\n");
};

export const exportCourierSummaryToCSV = (data: CourierSummaryResponse) => {
  const csvParts: string[] = [];
  
  // 1. Global KPIs
  csvParts.push("# === RÉSUMÉ GLOBAL ===");
  const kpiHeaders = [
    { label: "MÉTRIQUE", key: "metric" },
    { label: "VALEUR", key: "value" }
  ];
  const kpiData = [
    { metric: "Période", value: data.period },
    { metric: "Date", value: data.isoDate },
    { metric: "Total Commandes", value: data.kpis.ordersTotal },
    { metric: "Livrées", value: data.kpis.delivered },
    { metric: "Échouées", value: data.kpis.failed },
    { metric: "Taux de Succès", value: `${data.kpis.successRate}%` },
    { metric: "Chiffre d'Affaire (Livré)", value: `${data.kpis.revenueDelivered} FCFA` },
    { metric: "CA Encaissé", value: `${data.kpis.revenuePaid} FCFA` },
    { metric: "Promos Utilisées", value: data.kpis.promoUsedCount },
    { metric: "Remise Totale", value: `${data.kpis.promoDiscountTotal} FCFA` },
  ];
  csvParts.push(convertToCSV(kpiData, kpiHeaders));
  csvParts.push("\n");

  // 2. Leaderboard
  csvParts.push("# === CLASSEMENT DES LIVREURS ===");
  const leaderboardHeaders = [
    { label: "RANG", key: "rank" },
    { label: "LIVREUR", key: "name" },
    { label: "MONTANT (FCFA)", key: "amount" },
    { label: "COURSES", key: "courses" },
    { label: "SUCCÈS (%)", key: "success" },
    { label: "IMPAYÉS (FCFA)", key: "unpaid" }
  ];
  const leaderboardData = data.leaderboard.couriers.map((c, idx) => ({
    rank: idx + 1,
    name: c.courierName,
    amount: c.current.totalAmount,
    courses: c.current.courses,
    success: c.current.successRate,
    unpaid: c.current.unpaidAmount
  }));
  csvParts.push(convertToCSV(leaderboardData, leaderboardHeaders));
  csvParts.push("\n");

  // 3. Detailed Courses
  csvParts.push("# === DÉTAILS DES COURSES ===");
  const courseHeaders = [
    { label: "DATE", key: "date" },
    { label: "LIVREUR", key: "courier" },
    { label: "N° COMMANDE", key: "orderId" },
    { label: "CLIENT", key: "client" },
    { label: "DE", key: "from" },
    { label: "À", key: "to" },
    { label: "MONTANT", key: "amount" },
    { label: "STATUT", key: "status" },
    { label: "STATUT PAIEMENT", key: "paymentStatus" },
    { label: "PROMO", key: "promo" }
  ];
  
  const allCourses = data.couriers.flatMap(courier => 
    courier.courses.map(course => ({
      date: new Date(course.changedAt).toLocaleString("fr-FR"),
      courier: courier.courierName,
      orderId: course.orderNumber,
      client: course.clientName,
      from: course.fromCity,
      to: course.toCity,
      amount: course.amount,
      status: course.status,
      paymentStatus: course.paymentStatus,
      promo: course.promoUsed ? `-${course.discountAmount} FCFA` : ""
    }))
  );
  
  csvParts.push(convertToCSV(allCourses, courseHeaders));

  // Download Trigger
  const csvContent = "\uFEFF" + csvParts.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `rapport-livreurs-${data.dateKey || "export"}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
