// utils/export/dashboard-pdf-export.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardStats, DashboardFilters } from "./types";

export const exportDashboardToPDF = async (
  stats: DashboardStats,
  filters: DashboardFilters,
  options: {
    includeCharts: boolean;
    includeTopPerformers: boolean;
    includeRecentOrders: boolean;
    includeAdvancedMetrics: boolean;
  },
  lastUpdated: Date | null
): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // En-tête
  doc.setFontSize(24);
  doc.setTextColor(253, 72, 26); // #FD481A
  doc.text("Dashboard Commandes", margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  const periodLabels: Record<string, string> = {
    day: "Aujourd'hui",
    week: "Cette semaine",
    month: "Ce mois",
    year: "Cette année",
    all: "Toute période",
  };

  const periodText = periodLabels[filters.period] || filters.period;
  const updatedText = lastUpdated
    ? `Dernière MAJ: ${format(lastUpdated, "dd/MM/yyyy HH:mm", { locale: fr })}`
    : "";

  doc.text(`${periodText} • ${updatedText}`, margin, yPos);
  yPos += 15;

  // Statistiques principales
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Statistiques Principales", margin, yPos);
  yPos += 10;

  const mainStatsData = [
    ["Revenus Totaux", formatCurrency(stats.totalRevenue)],
    ["Commandes Total", stats.totalOrders.toString()],
    ["Commandes Actives", stats.activeOrders.toString()],
    ["Taux de Livraison", `${stats.deliveryRate}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Métrique", "Valeur"]],
    body: mainStatsData,
    theme: "grid",
    headStyles: { fillColor: [253, 72, 26], textColor: 255 },
    margin: { left: margin, right: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Métriques avancées
  if (options.includeAdvancedMetrics) {
    doc.setFontSize(16);
    doc.text("Métriques Avancées", margin, yPos);
    yPos += 10;

    const advancedMetricsData = [
      ["Valeur Moyenne Commande", formatCurrency(stats.averageOrderValue)],
      ["Ville la Plus Active", stats.mostActiveCity],
      ["Service le Plus Populaire", stats.mostPopularService],
      ["Taux de Conversion", `${stats.conversionRate}%`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Métrique", "Valeur"]],
      body: advancedMetricsData,
      theme: "grid",
      headStyles: { fillColor: [70, 70, 70], textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Top clients (par commandes)
  if (options.includeTopPerformers && stats.topClientsByOrders.length > 0) {
    doc.setFontSize(16);
    doc.text("Top Clients (Commandes)", margin, yPos);
    yPos += 10;

    const clientsData = stats.topClientsByOrders.map((client, index) => [
      `#${index + 1}`,
      client.user.name || `Client ${client.user._id.slice(0, 6)}`,
      client.totalOrders.toString(),
      formatCurrency(client.totalRevenue),
      formatCurrency(client.averageOrderValue),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [
        ["Rang", "Client", "Commandes", "Revenu Total", "Moyenne/Commande"],
      ],
      body: clientsData,
      theme: "grid",
      headStyles: { fillColor: [40, 100, 180], textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Top clients (par revenus)
  if (options.includeTopPerformers && stats.topClientsByRevenue.length > 0) {
    doc.setFontSize(16);
    doc.text("Top Clients (Revenus)", margin, yPos);
    yPos += 10;

    const clientsRevenueData = stats.topClientsByRevenue.map(
      (client, index) => [
        `#${index + 1}`,
        client.user.name || `Client ${client.user._id.slice(0, 6)}`,
        formatCurrency(client.totalRevenue),
        client.totalOrders.toString(),
        formatCurrency(client.averageOrderValue),
      ]
    );

    autoTable(doc, {
      startY: yPos,
      head: [
        ["Rang", "Client", "Revenu Total", "Commandes", "Moyenne/Commande"],
      ],
      body: clientsRevenueData,
      theme: "grid",
      headStyles: { fillColor: [40, 100, 180], textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Top livreurs (par livraisons)
  if (
    options.includeTopPerformers &&
    stats.topCouriersByDeliveries.length > 0
  ) {
    doc.setFontSize(16);
    doc.text("Top Livreurs (Livraisons)", margin, yPos);
    yPos += 10;

    const couriersData = stats.topCouriersByDeliveries.map((courier, index) => [
      `#${index + 1}`,
      courier.user.name || `Livreur ${courier.user._id.slice(0, 6)}`,
      courier.totalDeliveries.toString(),
      `${courier.successRate}%`,
      formatCurrency(courier.totalRevenue),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Rang", "Livreur", "Livraisons", "Taux Succès", "Revenu Généré"]],
      body: couriersData,
      theme: "grid",
      headStyles: { fillColor: [180, 40, 100], textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Top livreurs (par revenus)
  if (options.includeTopPerformers && stats.topCouriersByRevenue.length > 0) {
    doc.setFontSize(16);
    doc.text("Top Livreurs (Revenus)", margin, yPos);
    yPos += 10;

    const couriersRevenueData = stats.topCouriersByRevenue.map(
      (courier, index) => [
        `#${index + 1}`,
        courier.user.name || `Livreur ${courier.user._id.slice(0, 6)}`,
        formatCurrency(courier.totalRevenue),
        courier.totalDeliveries.toString(),
        `${courier.successRate}%`,
      ]
    );

    autoTable(doc, {
      startY: yPos,
      head: [["Rang", "Livreur", "Revenu Généré", "Livraisons", "Taux Succès"]],
      body: couriersRevenueData,
      theme: "grid",
      headStyles: { fillColor: [180, 40, 100], textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Tendance des revenus
  if (options.includeCharts && stats.revenueTrend.length > 0) {
    doc.setFontSize(16);
    doc.text("Tendance des Revenus", margin, yPos);
    yPos += 10;

    const trendData = stats.revenueTrend.map((item) => [
      item.period,
      formatCurrency(item.revenue),
      item.orders.toString(),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Période", "Revenus", "Commandes"]],
      body: trendData,
      theme: "grid",
      headStyles: { fillColor: [100, 180, 40], textColor: 255 },
      margin: { left: margin, right: margin },
      pageBreak: "auto",
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Commandes récentes
  if (options.includeRecentOrders && stats.recentOrders.length > 0) {
    doc.setFontSize(16);
    doc.text("Commandes Récentes", margin, yPos);
    yPos += 10;

    const ordersData = stats.recentOrders.map((order) => [
      order.id.slice(0, 8),
      format(parseISO(order.createdAt), "dd/MM/yy HH:mm", { locale: fr }),
      order.createdBy.name?.split(" ")[0] || "Client",
      order.deliveryAddress.city || "N/A",
      order.finalPrice ? formatCurrency(order.finalPrice) : "À négocier",
      getStatusLabel(order.status),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["ID", "Date", "Client", "Ville", "Montant", "Statut"]],
      body: ordersData,
      theme: "grid",
      headStyles: { fillColor: [120, 70, 200], textColor: 255 },
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      pageBreak: "auto",
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Statistiques par statut
  if (Object.keys(stats.ordersByStatus).length > 0) {
    doc.setFontSize(16);
    doc.text("Répartition par Statut", margin, yPos);
    yPos += 10;

    const statusData = Object.entries(stats.ordersByStatus).map(
      ([status, count]) => [
        getStatusLabel(status),
        count.toString(),
        `${Math.round((count / stats.totalOrders) * 100)}%`,
      ]
    );

    autoTable(doc, {
      startY: yPos,
      head: [["Statut", "Nombre", "Pourcentage"]],
      body: statusData,
      theme: "grid",
      headStyles: { fillColor: [200, 120, 70], textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Statistiques par service
  if (Object.keys(stats.ordersByService).length > 0) {
    doc.setFontSize(16);
    doc.text("Répartition par Service", margin, yPos);
    yPos += 10;

    const serviceData = Object.entries(stats.ordersByService).map(
      ([service, count]) => [
        service,
        count.toString(),
        `${Math.round((count / stats.totalOrders) * 100)}%`,
      ]
    );

    autoTable(doc, {
      startY: yPos,
      head: [["Service", "Nombre", "Pourcentage"]],
      body: serviceData,
      theme: "grid",
      headStyles: { fillColor: [70, 200, 120], textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Résumé
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("Résumé", margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  const summary = [
    `Période analysée: ${periodText}`,
    `Nombre total de commandes: ${stats.totalOrders}`,
    `Revenus totaux: ${formatCurrency(stats.totalRevenue)}`,
    `Taux de livraison: ${stats.deliveryRate}%`,
    `Ville la plus active: ${stats.mostActiveCity}`,
    `Service le plus populaire: ${stats.mostPopularService}`,
  ];

  summary.forEach((line, index) => {
    doc.text(line, margin, yPos + index * 5);
  });

  yPos += summary.length * 5 + 10;

  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
    doc.text(
      `© ${new Date().getFullYear()} - Dashboard Commandes`,
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Sauvegarder le PDF
  doc.save(`dashboard-commandes-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`);
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

// Fonction helper pour parseISO
const parseISO = (dateString: string): Date => {
  return new Date(dateString);
};
