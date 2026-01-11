// utils/pdf-export.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { formatAmount } from "./report-transformer";
import { ClientReport } from "../types/types";

export const exportToPDF = async (
  report: ClientReport,
  stats: any,
  options: {
    includeCourses: boolean;
    includeCharts: boolean;
    includeStats: boolean;
  }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // En-tête
  doc.setFontSize(24);
  doc.setTextColor(253, 72, 26); // #FD481A
  doc.text("Rapport Client", margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Généré le ${format(new Date(), "dd MMMM yyyy", { locale: fr })}`,
    margin,
    yPos
  );
  yPos += 15;

  // Statistiques principales
  if (options.includeStats) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Statistiques Principales", margin, yPos);
    yPos += 10;

    const statsData = [
      ["Total des Courses", report.totalCourses.toString()],
      ["Total", formatAmount(report.totalAmount)],
      ["Taux de Réussite", `${stats.successRate}%`],
      ["Ville Favorite", report.favoriteCity],
      ["Route Préférée", report.favoriteRoute],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Métrique", "Valeur"]],
      body: statsData,
      theme: "grid",
      headStyles: { fillColor: [253, 72, 26], textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Tableau des courses
  if (options.includeCourses && report.courses.length > 0) {
    doc.setFontSize(16);
    doc.text("Historique des Courses", margin, yPos);
    yPos += 10;

    const coursesData = report.courses.map((course) => [
      format(parseISO(course.date), "dd/MM/yyyy", { locale: fr }),
      course.fromCity,
      course.toCity,
      formatAmount(course.amount),
      getStatusLabel(course.status),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Date", "De", "À", "Montant", "Statut"]],
      body: coursesData,
      theme: "grid",
      headStyles: { fillColor: [253, 72, 26], textColor: 255 },
      margin: { left: margin, right: margin },
      pageBreak: "auto",
      styles: { fontSize: 8 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Données périodiques
  if (options.includeStats) {
    // Par jour
    if (report.perDay.length > 0) {
      doc.setFontSize(14);
      doc.text("Revenus par Jour", margin, yPos);
      yPos += 10;

      const dailyData = report.perDay.map((item) => [
        item.date || "",
        formatAmount(item.total),
        item.count.toString(),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Date", "Revenu", "Nombre de Courses"]],
        body: dailyData,
        theme: "grid",
        headStyles: { fillColor: [70, 70, 70], textColor: 255 },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Par semaine
    if (report.perWeek.length > 0) {
      doc.setFontSize(14);
      doc.text("Revenus par Semaine", margin, yPos);
      yPos += 10;

      const weeklyData = report.perWeek.map((item) => [
        item.week || "",
        formatAmount(item.total),
        item.count.toString(),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Semaine", "Revenu", "Nombre de Courses"]],
        body: weeklyData,
        theme: "grid",
        headStyles: { fillColor: [70, 70, 70], textColor: 255 },
        margin: { left: margin, right: margin },
      });
    }
  }

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
      "© " + new Date().getFullYear() + " - Dashboard Client",
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Sauvegarder le PDF
  doc.save(`rapport-client-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    livree: "Livrée",
    en_livraison: "En livraison",
    prix_valide: "Prix validé",
    assignee: "Assignée",
    echec: "Échec",
    en_attente: "En attente",
    en_discussion_tarifaire: "En discussion",
  };
  return labels[status] || status;
};
