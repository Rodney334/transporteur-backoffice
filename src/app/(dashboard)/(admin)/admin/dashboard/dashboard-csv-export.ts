// utils/export/dashboard-csv-export.ts
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardStats, DashboardFilters } from "./types";

export const exportDashboardToCSV = async (
  stats: DashboardStats,
  filters: DashboardFilters,
  options: {
    includeCharts: boolean;
    includeTopPerformers: boolean;
    includeRecentOrders: boolean;
    includeAdvancedMetrics: boolean;
  }
): Promise<void> => {
  const dateStr = format(new Date(), "yyyy-MM-dd-HHmm");
  const csvParts: string[] = [];
  const bom = "\uFEFF"; // BOM pour UTF-8 (Excel)

  // En-tête
  const periodLabels: Record<string, string> = {
    day: "Aujourd'hui",
    week: "Cette semaine",
    month: "Ce mois",
    year: "Cette année",
    all: "Toute période",
  };

  const periodText = periodLabels[filters.period] || filters.period;

  csvParts.push("# DASHBOARD COMMANDES");
  csvParts.push(`# Période: ${periodText}`);
  csvParts.push(
    `# Généré le: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: fr })}`
  );
  csvParts.push("\n");

  // 1. Statistiques principales
  csvParts.push("# === STATISTIQUES PRINCIPALES ===");
  const mainStatsHeaders = ["METRIQUE", "VALEUR"];
  const mainStatsData = [
    ["REVENUS_TOTAUX", formatCurrency(stats.totalRevenue)],
    ["COMMANDES_TOTAL", stats.totalOrders.toString()],
    ["COMMANDES_ACTIVES", stats.activeOrders.toString()],
    ["TAUX_LIVRAISON", `${stats.deliveryRate}%`],
  ];
  csvParts.push(convertToCSV(mainStatsData, mainStatsHeaders));
  csvParts.push("\n");

  // 2. Métriques avancées
  if (options.includeAdvancedMetrics) {
    csvParts.push("# === METRIQUES AVANCEES ===");
    const advancedHeaders = ["METRIQUE", "VALEUR"];
    const advancedData = [
      ["VALEUR_MOYENNE_COMMANDE", formatCurrency(stats.averageOrderValue)],
      ["VILLE_PLUS_ACTIVE", stats.mostActiveCity],
      ["SERVICE_POPULAIRE", stats.mostPopularService],
      ["TAUX_CONVERSION", `${stats.conversionRate}%`],
    ];
    csvParts.push(convertToCSV(advancedData, advancedHeaders));
    csvParts.push("\n");
  }

  // 3. Top clients (par commandes)
  if (options.includeTopPerformers && stats.topClientsByOrders.length > 0) {
    csvParts.push("# === TOP CLIENTS (COMMANDES) ===");
    const clientsHeaders = [
      "RANG",
      "CLIENT",
      "COMMANDES",
      "REVENU_TOTAL",
      "MOYENNE_COMMANDE",
    ];
    const clientsData = stats.topClientsByOrders.map((client, index) => [
      (index + 1).toString(),
      client.user.name || `Client ${client.user._id.slice(0, 6)}`,
      client.totalOrders.toString(),
      formatCurrency(client.totalRevenue),
      formatCurrency(client.averageOrderValue),
    ]);
    csvParts.push(convertToCSV(clientsData, clientsHeaders));
    csvParts.push("\n");
  }

  // 4. Top clients (par revenus)
  if (options.includeTopPerformers && stats.topClientsByRevenue.length > 0) {
    csvParts.push("# === TOP CLIENTS (REVENUS) ===");
    const clientsRevenueHeaders = [
      "RANG",
      "CLIENT",
      "REVENU_TOTAL",
      "COMMANDES",
      "MOYENNE_COMMANDE",
    ];
    const clientsRevenueData = stats.topClientsByRevenue.map(
      (client, index) => [
        (index + 1).toString(),
        client.user.name || `Client ${client.user._id.slice(0, 6)}`,
        formatCurrency(client.totalRevenue),
        client.totalOrders.toString(),
        formatCurrency(client.averageOrderValue),
      ]
    );
    csvParts.push(convertToCSV(clientsRevenueData, clientsRevenueHeaders));
    csvParts.push("\n");
  }

  // 5. Top livreurs (par livraisons)
  if (
    options.includeTopPerformers &&
    stats.topCouriersByDeliveries.length > 0
  ) {
    csvParts.push("# === TOP LIVREURS (LIVRAISONS) ===");
    const couriersHeaders = [
      "RANG",
      "LIVREUR",
      "LIVRAISONS",
      "TAUX_SUCCES",
      "REVENU_GENERE",
    ];
    const couriersData = stats.topCouriersByDeliveries.map((courier, index) => [
      (index + 1).toString(),
      courier.user.name || `Livreur ${courier.user._id.slice(0, 6)}`,
      courier.totalDeliveries.toString(),
      `${courier.successRate}%`,
      formatCurrency(courier.totalRevenue),
    ]);
    csvParts.push(convertToCSV(couriersData, couriersHeaders));
    csvParts.push("\n");
  }

  // 6. Top livreurs (par revenus)
  if (options.includeTopPerformers && stats.topCouriersByRevenue.length > 0) {
    csvParts.push("# === TOP LIVREURS (REVENUS) ===");
    const couriersRevenueHeaders = [
      "RANG",
      "LIVREUR",
      "REVENU_GENERE",
      "LIVRAISONS",
      "TAUX_SUCCES",
    ];
    const couriersRevenueData = stats.topCouriersByRevenue.map(
      (courier, index) => [
        (index + 1).toString(),
        courier.user.name || `Livreur ${courier.user._id.slice(0, 6)}`,
        formatCurrency(courier.totalRevenue),
        courier.totalDeliveries.toString(),
        `${courier.successRate}%`,
      ]
    );
    csvParts.push(convertToCSV(couriersRevenueData, couriersRevenueHeaders));
    csvParts.push("\n");
  }

  // 7. Tendance des revenus
  if (options.includeCharts && stats.revenueTrend.length > 0) {
    csvParts.push("# === TENDANCE DES REVENUS ===");
    const trendHeaders = ["PERIODE", "REVENUS", "COMMANDES"];
    const trendData = stats.revenueTrend.map((item) => [
      item.period,
      formatCurrency(item.revenue),
      item.orders.toString(),
    ]);
    csvParts.push(convertToCSV(trendData, trendHeaders));
    csvParts.push("\n");
  }

  // 8. Commandes récentes
  if (options.includeRecentOrders && stats.recentOrders.length > 0) {
    csvParts.push("# === COMMANDES RECENTES ===");
    const ordersHeaders = [
      "ID",
      "DATE",
      "CLIENT",
      "VILLE",
      "MONTANT",
      "STATUT",
      "SERVICE",
    ];
    const ordersData = stats.recentOrders.map((order) => [
      order.id.slice(0, 8),
      format(new Date(order.createdAt), "dd/MM/yy HH:mm", { locale: fr }),
      order.createdBy.name?.split(" ")[0] || "Client",
      order.deliveryAddress.city || "N/A",
      order.finalPrice ? formatCurrency(order.finalPrice) : "À négocier",
      getStatusLabel(order.status),
      order.serviceType,
    ]);
    csvParts.push(convertToCSV(ordersData, ordersHeaders));
    csvParts.push("\n");
  }

  // 9. Statistiques par statut
  if (Object.keys(stats.ordersByStatus).length > 0) {
    csvParts.push("# === REPARTITION PAR STATUT ===");
    const statusHeaders = ["STATUT", "NOMBRE", "POURCENTAGE"];
    const statusData = Object.entries(stats.ordersByStatus).map(
      ([status, count]) => [
        getStatusLabel(status),
        count.toString(),
        `${Math.round((count / stats.totalOrders) * 100)}%`,
      ]
    );
    csvParts.push(convertToCSV(statusData, statusHeaders));
    csvParts.push("\n");
  }

  // 10. Statistiques par service
  if (Object.keys(stats.ordersByService).length > 0) {
    csvParts.push("# === REPARTITION PAR SERVICE ===");
    const serviceHeaders = ["SERVICE", "NOMBRE", "POURCENTAGE"];
    const serviceData = Object.entries(stats.ordersByService).map(
      ([service, count]) => [
        service,
        count.toString(),
        `${Math.round((count / stats.totalOrders) * 100)}%`,
      ]
    );
    csvParts.push(convertToCSV(serviceData, serviceHeaders));
    csvParts.push("\n");
  }

  // 11. Résumé
  csvParts.push("# === RESUME ===");
  const summaryHeaders = ["CHAMP", "VALEUR"];
  const summaryData = [
    ["PERIODE_ANALYSEE", periodText],
    ["NOMBRE_TOTAL_COMMANDES", stats.totalOrders.toString()],
    ["REVENUS_TOTAUX", formatCurrency(stats.totalRevenue)],
    ["TAUX_LIVRAISON", `${stats.deliveryRate}%`],
    ["VILLE_PLUS_ACTIVE", stats.mostActiveCity],
    ["SERVICE_PLUS_POPULAIRE", stats.mostPopularService],
    ["VALEUR_MOYENNE_COMMANDE", formatCurrency(stats.averageOrderValue)],
    ["TAUX_CONVERSION", `${stats.conversionRate}%`],
  ];
  csvParts.push(convertToCSV(summaryData, summaryHeaders));

  // Créer et télécharger le fichier
  const csvContent = bom + csvParts.join("\n");
  downloadFile(csvContent, `dashboard-commandes-${dateStr}.csv`);
};

// Fonctions utilitaires
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    livree: "Livrée",
    en_attente: "En attente",
    assignee: "Assignée",
    en_discussion_tarifaire: "En discussion",
    prix_valide: "Prix validé",
    en_livraison: "En livraison",
    echec: "Échec",
  };
  return labels[status] || status;
};

const escapeCsvField = (field: any): string => {
  if (field === null || field === undefined) {
    return "";
  }

  const stringValue = String(field);

  if (
    stringValue.includes(";") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const convertToCSV = (data: any[][], headers: string[]): string => {
  const rows = data.map((row) =>
    row.map((field) => escapeCsvField(field)).join(";")
  );

  return [headers.map(escapeCsvField).join(";"), ...rows].join("\n");
};

const downloadFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);

  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
