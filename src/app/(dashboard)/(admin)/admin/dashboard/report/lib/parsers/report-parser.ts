// lib/parsers/report-parser.ts
export interface CourseDetail {
  time: string;
  from: string;
  to: string;
  amount: string;
  status: string;
  reference: string;
}

export interface LivreurSummary {
  name: string;
  totalAmount: string;
  coursesCount: string;
  paid: string;
  pending: string;
  failed: string;
}

export interface GlobalStats {
  successRate: string;
  bestCity: string;
  bestClient: string;
  bestDay: string;
  bestWeek: string;
  bestMonth: string;
}

export interface PaymentSummary {
  paid: string;
  pending: string;
  failed: string;
}

export interface PeriodReport {
  title: string;
  periodType: "daily" | "weekly" | "monthly" | "all";
  unpaidCoursesWarning?: string;
  paymentSummary: PaymentSummary;
  coursesByLivreur: Array<{
    livreurName: string;
    courses: CourseDetail[];
  }>;
  livreurSummaries: Array<{
    summary: LivreurSummary;
    stats: GlobalStats;
  }>;
}

export const parseReportText = (text: string): PeriodReport[] => {
  if (!text) return [];

  // Séparer les périodes
  const periodSections = text.split(
    "════════════════════════════════════════════════════════════"
  );

  return periodSections
    .filter((section) => section.trim())
    .map((section) => {
      const lines = section.trim().split("\n");

      // Titre de la période (ex: "➖Mardi 23 Décembre 2025")
      const titleLine = lines.find((line) => line.startsWith("➖"));
      const title = titleLine
        ? titleLine.replace("➖", "").trim()
        : "Sans titre";

      // Détecter le type de période
      let periodType: PeriodReport["periodType"] = "all";
      if (
        title.toLowerCase().includes("lundi") ||
        title.toLowerCase().includes("mardi") ||
        title.toLowerCase().includes("mercredi") ||
        title.toLowerCase().includes("jeudi") ||
        title.toLowerCase().includes("vendredi") ||
        title.toLowerCase().includes("samedi") ||
        title.toLowerCase().includes("dimanche")
      ) {
        periodType = "daily";
      } else if (title.toLowerCase().includes("semaine")) {
        periodType = "weekly";
      } else if (
        title.toLowerCase().includes("janvier") ||
        title.toLowerCase().includes("février") ||
        title.toLowerCase().includes("mars") ||
        title.toLowerCase().includes("avril") ||
        title.toLowerCase().includes("mai") ||
        title.toLowerCase().includes("juin") ||
        title.toLowerCase().includes("juillet") ||
        title.toLowerCase().includes("août") ||
        title.toLowerCase().includes("septembre") ||
        title.toLowerCase().includes("octobre") ||
        title.toLowerCase().includes("novembre") ||
        title.toLowerCase().includes("décembre")
      ) {
        periodType = "monthly";
      }

      // Avertissement cours non payés
      const warningLine = lines.find((line) =>
        line.includes("courses LIVRÉES NON PAYÉES")
      );
      const unpaidCoursesWarning = warningLine ? warningLine.trim() : undefined;

      // Résumé des paiements
      const paymentSummary: PaymentSummary = {
        paid: "0 FCFA",
        pending: "0 FCFA",
        failed: "0 FCFA",
      };

      const paidLineIndex = lines.findIndex((line) =>
        line.includes("✅ Payés :")
      );
      const pendingLineIndex = lines.findIndex(
        (line) =>
          line.includes("⏳ En attente :") || line.includes("⏳ Pending :")
      );
      const failedLineIndex = lines.findIndex(
        (line) =>
          line.includes("❌ Échoués :") || line.includes("❌ Non payés :")
      );

      if (paidLineIndex !== -1) {
        const paidLine = lines[paidLineIndex];
        const match =
          paidLine.match(/✅ Payés : (.*)/) || paidLine.match(/✅ Payés :(.*)/);
        if (match) paymentSummary.paid = match[1].trim();
      }

      if (pendingLineIndex !== -1) {
        const pendingLine = lines[pendingLineIndex];
        const match =
          pendingLine.match(/⏳ En attente : (.*)/) ||
          pendingLine.match(/⏳ Pending : (.*)/);
        if (match) paymentSummary.pending = match[1].trim();
      }

      if (failedLineIndex !== -1) {
        const failedLine = lines[failedLineIndex];
        const match =
          failedLine.match(/❌ Échoués : (.*)/) ||
          failedLine.match(/❌ Non payés : (.*)/);
        if (match) paymentSummary.failed = match[1].trim();
      }

      // Extraire les cours par livreur
      const coursesByLivreur: Array<{
        livreurName: string;
        courses: CourseDetail[];
      }> = [];
      let currentLivreur: string | null = null;
      let currentCourses: CourseDetail[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Détecter un nouveau livreur (ligne avec emoji personne)
        if (line.startsWith("👤")) {
          // Sauvegarder les cours du livreur précédent
          if (currentLivreur && currentCourses.length > 0) {
            coursesByLivreur.push({
              livreurName: currentLivreur,
              courses: [...currentCourses],
            });
          }

          currentLivreur = line.replace("👤", "").trim();
          currentCourses = [];
        }

        // Détecter un cours (ligne avec "✅" et "|")
        else if (line.startsWith("- ✅") && line.includes("|")) {
          const parts = line
            .replace("- ✅", "")
            .trim()
            .split("|")
            .map((p) => p.trim());
          if (parts.length >= 5) {
            const course: CourseDetail = {
              time: parts[0],
              from: parts[1].replace("→", "").trim(),
              to: parts[2].trim(),
              amount: parts[3],
              status: parts[4],
              reference: parts[5] ? parts[5].trim() : "",
            };
            currentCourses.push(course);
          }
        }
      }

      // Ajouter le dernier livreur
      if (currentLivreur && currentCourses.length > 0) {
        coursesByLivreur.push({
          livreurName: currentLivreur,
          courses: currentCourses,
        });
      }

      // Extraire les résumés par livreur et statistiques
      const livreurSummaries: Array<{
        summary: LivreurSummary;
        stats: GlobalStats;
      }> = [];

      for (let i = 0; i < lines.length; i++) {
        // Chercher les résumés par livreur (ex: "EPAMINONDAS Babatounde 4.000 FCFA (03 Courses)")
        if (
          lines[i].includes("FCFA") &&
          lines[i].includes("Courses") &&
          !lines[i].startsWith("📊")
        ) {
          const livreurName = lines[i].split("FCFA")[0].trim();
          const summaryMatch = lines[i].match(
            /(.*?)\s+(\d[\d\s.,]*\s*FCFA)\s+\((\d+)\s+Courses\)/
          );

          if (summaryMatch) {
            const summary: LivreurSummary = {
              name: summaryMatch[1].trim(),
              totalAmount: summaryMatch[2].trim(),
              coursesCount: summaryMatch[3].trim(),
              paid: "0 FCFA",
              pending: "0 FCFA",
              failed: "0 FCFA",
            };

            // Chercher les statistiques globales pour ce livreur
            const stats: GlobalStats = {
              successRate: "",
              bestCity: "",
              bestClient: "",
              bestDay: "",
              bestWeek: "",
              bestMonth: "",
            };

            // Chercher les lignes de statistiques après ce livreur
            for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
              const statLine = lines[j].trim();
              if (statLine.includes("✅ Taux de succès :")) {
                stats.successRate = statLine.split(":")[1].trim();
              } else if (statLine.includes("🏙️ Meilleure ville :")) {
                stats.bestCity = statLine.split(":")[1].trim();
              } else if (statLine.includes("👤 Meilleur client :")) {
                stats.bestClient = statLine.split(":")[1].trim();
              } else if (statLine.includes("📆 Meilleur jour :")) {
                stats.bestDay = statLine.split(":")[1].trim();
              } else if (statLine.includes("📅 Meilleure semaine :")) {
                stats.bestWeek = statLine.split(":")[1].trim();
              } else if (statLine.includes("📅 Meilleur mois :")) {
                stats.bestMonth = statLine.split(":")[1].trim();
              }
            }

            livreurSummaries.push({ summary, stats });
          }
        }
      }

      return {
        title,
        periodType,
        unpaidCoursesWarning,
        paymentSummary,
        coursesByLivreur,
        livreurSummaries,
      };
    });
};

// Fonction utilitaire pour extraire le montant numérique
export const extractAmountValue = (amountStr: string): number => {
  const match = amountStr.match(/(\d[\d\s.,]*)/);
  if (match) {
    const cleanAmount = match[1].replace(/\s/g, "").replace(",", ".");
    return parseFloat(cleanAmount) || 0;
  }
  return 0;
};
