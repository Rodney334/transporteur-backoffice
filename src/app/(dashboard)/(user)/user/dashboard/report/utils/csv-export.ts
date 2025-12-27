// utils/csv-export.ts
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { formatAmount, getStatusLabel } from "./report-transformer";
import { ClientReport } from "../types/types";
import { OrderStatus } from "@/type/enum";

// Déclarer les types pour les APIs navigateur non standard
declare global {
  interface Navigator {
    msSaveBlob?: (blob: Blob, defaultName?: string) => boolean;
  }

  interface Window {
    showSaveFilePicker?: (options?: any) => Promise<FileSystemFileHandle>;
  }
}

// Fonction utilitaire pour échapper les caractères CSV
const escapeCsvField = (field: any): string => {
  if (field === null || field === undefined) {
    return "";
  }

  const stringValue = String(field);

  // Si le champ contient des virgules, guillemets ou sauts de ligne, l'échapper
  if (
    stringValue.includes(",") ||
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
  headers: string[]
): string => {
  const rows = data.map((row) =>
    headers.map((header) => escapeCsvField(row[header] || "")).join(";")
  );

  return [headers.map(escapeCsvField).join(";"), ...rows].join("\n");
};

export const exportToCSV = async (
  report: ClientReport,
  options: {
    includeCourses: boolean;
    includeStats: boolean;
    includeCharts: boolean;
  }
): Promise<void> => {
  const dateStr = format(new Date(), "yyyy-MM-dd-HHmm");
  const csvParts: string[] = [];

  // 1. Exporter les courses
  if (options.includeCourses && report.courses.length > 0) {
    const coursesHeaders = [
      "DATE",
      "HEURE",
      "ID_COMMANDE",
      "VILLE_DEPART",
      "VILLE_ARRIVEE",
      "MONTANT_FCFA",
      "STATUT",
      "ID_LIVREUR",
      "SUCCES",
      "ECHEC",
    ];

    const coursesData = report.courses.map((course) => {
      const date = parseISO(course.date);
      return {
        DATE: format(date, "dd/MM/yyyy", { locale: fr }),
        HEURE: format(date, "HH:mm", { locale: fr }),
        ID_COMMANDE: course.orderId,
        VILLE_DEPART: course.fromCity,
        VILLE_ARRIVEE: course.toCity,
        MONTANT_FCFA: course.amount,
        STATUT: getStatusLabel(course.status),
        ID_LIVREUR: course.courierId,
        SUCCES: course.isSuccess ? "OUI" : "NON",
        ECHEC: course.isFailed ? "OUI" : "NON",
      };
    });

    csvParts.push("# === COURSES ===");
    csvParts.push(convertToCSV(coursesData, coursesHeaders));
    csvParts.push("\n");
  }

  // 2. Exporter les statistiques principales
  if (options.includeStats) {
    const successfulCourses = report.courses.filter(
      (c) => c.status === OrderStatus.LIVREE
    ).length;
    const failedCourses = report.courses.filter(
      (c) => c.status === OrderStatus.ECHEC
    ).length;
    const successRate =
      report.totalCourses > 0
        ? Math.round((successfulCourses / report.totalCourses) * 100)
        : 0;

    const statsHeaders = ["METRIQUE", "VALEUR"];
    const statsData = [
      { METRIQUE: "TOTAL_COURSES", VALEUR: report.totalCourses },
      { METRIQUE: "COURSES_REUSSIES", VALEUR: successfulCourses },
      { METRIQUE: "COURSES_ECHOUEES", VALEUR: failedCourses },
      { METRIQUE: "TAUX_REUSSITE", VALEUR: `${successRate}%` },
      { METRIQUE: "REVENU_TOTAL", VALEUR: formatAmount(report.totalAmount) },
      {
        METRIQUE: "MOYENNE_PAR_COURSE",
        VALEUR: formatAmount(
          report.totalCourses > 0
            ? Math.round(report.totalAmount / report.totalCourses)
            : 0
        ),
      },
      { METRIQUE: "VILLE_FAVORITE", VALEUR: report.favoriteCity || "N/A" },
      { METRIQUE: "VILLE_A_AMELIORER", VALEUR: report.worstCity || "N/A" },
      { METRIQUE: "ROUTE_PREFEREE", VALEUR: report.favoriteRoute || "N/A" },
    ];

    csvParts.push("# === STATISTIQUES PRINCIPALES ===");
    csvParts.push(convertToCSV(statsData, statsHeaders));
    csvParts.push("\n");

    // 3. Exporter les données périodiques
    if (report.perDay.length > 0) {
      const dailyHeaders = ["DATE", "REVENU_JOUR", "NOMBRE_COURSES"];
      const dailyData = report.perDay
        .filter((item) => item.date)
        .map((item) => ({
          DATE: item.date || "",
          REVENU_JOUR: formatAmount(item.total),
          NOMBRE_COURSES: item.count,
        }));

      if (dailyData.length > 0) {
        csvParts.push("# === REVENUS PAR JOUR ===");
        csvParts.push(convertToCSV(dailyData, dailyHeaders));
        csvParts.push("\n");
      }
    }

    if (report.perWeek.length > 0) {
      const weeklyHeaders = ["SEMAINE", "REVENU_SEMAINE", "NOMBRE_COURSES"];
      const weeklyData = report.perWeek
        .filter((item) => item.week)
        .map((item) => ({
          SEMAINE: item.week?.replace("W", " Semaine ") || "",
          REVENU_SEMAINE: formatAmount(item.total),
          NOMBRE_COURSES: item.count,
        }));

      if (weeklyData.length > 0) {
        csvParts.push("# === REVENUS PAR SEMAINE ===");
        csvParts.push(convertToCSV(weeklyData, weeklyHeaders));
        csvParts.push("\n");
      }
    }

    if (report.perMonth.length > 0) {
      const monthlyHeaders = ["MOIS", "REVENU_MOIS", "NOMBRE_COURSES"];
      const monthlyData = report.perMonth
        .filter((item) => item.month)
        .map((item) => {
          const [year, month] = (item.month || "").split("-");
          const monthName = month
            ? format(parseISO(`${item.month}-01`), "MMMM", { locale: fr })
            : "";
          return {
            MOIS: monthName ? `${monthName} ${year}` : "",
            REVENU_MOIS: formatAmount(item.total),
            NOMBRE_COURSES: item.count,
          };
        });

      if (monthlyData.length > 0) {
        csvParts.push("# === REVENUS PAR MOIS ===");
        csvParts.push(convertToCSV(monthlyData, monthlyHeaders));
        csvParts.push("\n");
      }
    }

    // 4. Statistiques par ville - CORRECTION ICI
    const cityStats: Record<string, number> = report.courses.reduce(
      (acc: Record<string, number>, course) => {
        const city = course.fromCity;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const cityHeaders = ["VILLE", "NOMBRE_DEPARTS"];
    const cityData = Object.entries(cityStats)
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => ({
        VILLE: city,
        NOMBRE_DEPARTS: count,
      }));

    if (cityData.length > 0) {
      csvParts.push("# === STATISTIQUES PAR VILLE ===");
      csvParts.push(convertToCSV(cityData, cityHeaders));
      csvParts.push("\n");
    }
  }

  // 5. Métadonnées
  const metaHeaders = ["CHAMP", "VALEUR"];
  const metaData = [
    {
      CHAMP: "DATE_GENERATION",
      VALEUR: format(new Date(), "dd/MM/yyyy HH:mm", { locale: fr }),
    },
    {
      CHAMP: "NOMBRE_TOTAL_LIGNES",
      VALEUR:
        csvParts
          .filter((p) => !p.startsWith("#"))
          .join("")
          .split("\n").length - 1,
    },
    { CHAMP: "FORMAT", VALEUR: "CSV (UTF-8, séparateur: point-virgule)" },
  ];

  csvParts.push("# === METADONNEES ===");
  csvParts.push(convertToCSV(metaData, metaHeaders));

  // 6. Créer et télécharger le fichier
  const csvContent = csvParts.join("\n");
  const bom = "\uFEFF"; // BOM pour UTF-8 (Excel)
  const fullContent = bom + csvContent;

  // Créer un blob et le télécharger
  const blob = new Blob([fullContent], {
    type: "text/csv;charset=utf-8;",
  });

  const downloadFile = () => {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `rapport-client-${dateStr}.csv`);
    link.setAttribute("data-testid", "csv-download-link");

    // Masquer le lien
    link.style.position = "absolute";
    link.style.left = "-9999px";

    document.body.appendChild(link);
    link.click();

    // Nettoyer
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Gérer les différents navigateurs avec vérifications de type
  const nav = navigator as any;
  const win = window as any;

  if (nav.msSaveBlob) {
    // Pour Internet Explorer
    nav.msSaveBlob(blob, `rapport-client-${dateStr}.csv`);
  } else if (win.showSaveFilePicker) {
    // Pour les navigateurs modernes avec File System Access API
    try {
      const handle = await win.showSaveFilePicker({
        suggestedName: `rapport-client-${dateStr}.csv`,
        types: [
          {
            description: "Fichiers CSV",
            accept: { "text/csv": [".csv"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err: any) {
      // L'utilisateur a annulé ou erreur, on utilise la méthode classique
      if (err.name !== "AbortError") {
        console.warn(
          "File System Access API failed, falling back to classic download:",
          err
        );
      }
      downloadFile();
    }
  } else {
    // Pour les autres navigateurs
    downloadFile();
  }
};

// // utils/csv-export.ts
// import { createObjectCsvWriter } from "csv-writer";
// import { format, parseISO } from "date-fns";
// import { fr } from "date-fns/locale";
// import { formatAmount } from "./report-transformer";
// import { ClientReport } from "../types/types";

// export const exportToCSV = async (
//   report: ClientReport,
//   options: {
//     includeCourses: boolean;
//     includeStats: boolean;
//     includeCharts: boolean;
//   }
// ) => {
//   const dateStr = format(new Date(), "yyyy-MM-dd");

//   if (options.includeCourses) {
//     // Export des courses
//     const coursesWriter = createObjectCsvWriter({
//       path: `courses-${dateStr}.csv`,
//       header: [
//         { id: "date", title: "DATE" },
//         { id: "orderId", title: "ID_COMMANDE" },
//         { id: "fromCity", title: "VILLE_DEPART" },
//         { id: "toCity", title: "VILLE_ARRIVEE" },
//         { id: "amount", title: "MONTANT_FCFA" },
//         { id: "status", title: "STATUT" },
//         { id: "courierId", title: "ID_LIVREUR" },
//         { id: "isSuccess", title: "SUCCES" },
//         { id: "isFailed", title: "ECHEC" },
//       ],
//       fieldDelimiter: ";",
//       encoding: "utf8",
//     });

//     const coursesData = report.courses.map((course) => ({
//       date: format(parseISO(course.date), "dd/MM/yyyy HH:mm", { locale: fr }),
//       orderId: course.orderId,
//       fromCity: course.fromCity,
//       toCity: course.toCity,
//       amount: course.amount,
//       status: getStatusLabel(course.status),
//       courierId: course.courierId,
//       isSuccess: course.isSuccess ? "OUI" : "NON",
//       isFailed: course.isFailed ? "OUI" : "NON",
//     }));

//     await coursesWriter.writeRecords(coursesData);
//   }

//   if (options.includeStats) {
//     // Export des statistiques
//     const statsWriter = createObjectCsvWriter({
//       path: `statistiques-${dateStr}.csv`,
//       header: [
//         { id: "metric", title: "METRIQUE" },
//         { id: "value", title: "VALEUR" },
//       ],
//       fieldDelimiter: ";",
//       encoding: "utf8",
//     });

//     const statsData = [
//       { metric: "TOTAL_COURSES", value: report.totalCourses.toString() },
//       { metric: "TOTAL_REVENU", value: formatAmount(report.totalAmount) },
//       { metric: "VILLE_FAVORITE", value: report.favoriteCity },
//       { metric: "VILLE_A_AMELIORER", value: report.worstCity },
//       { metric: "ROUTE_PREFEREE", value: report.favoriteRoute },
//     ];

//     // Ajouter les données périodiques
//     report.perDay.forEach((item, index) => {
//       statsData.push({
//         metric: `REVENU_JOUR_${item.date}`,
//         value: formatAmount(item.total),
//       });
//     });

//     report.perWeek.forEach((item, index) => {
//       statsData.push({
//         metric: `REVENU_SEMAINE_${item.week}`,
//         value: formatAmount(item.total),
//       });
//     });

//     report.perMonth.forEach((item, index) => {
//       statsData.push({
//         metric: `REVENU_MOIS_${item.month}`,
//         value: formatAmount(item.total),
//       });
//     });

//     await statsWriter.writeRecords(statsData);
//   }
// };

// const getStatusLabel = (status: string): string => {
//   const labels: Record<string, string> = {
//     livree: "Livrée",
//     en_livraison: "En livraison",
//     prix_valide: "Prix validé",
//     assignee: "Assignée",
//     echec: "Échec",
//     en_attente: "En attente",
//     en_discussion_tarifaire: "En discussion",
//   };
//   return labels[status] || status;
// };
