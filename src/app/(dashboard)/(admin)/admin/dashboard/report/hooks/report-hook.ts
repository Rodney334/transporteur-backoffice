// hooks/use-report-management.ts
import { reportService } from "@/lib/services/report-service";
import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { parseReportText, PeriodReport } from "../lib/parsers/report-parser";
import { useAuth } from "@/hooks/use-auth";
import { GrantedRole } from "@/type/enum";

export const useReportManagement = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<PeriodReport[]>([]);
  const [rawText, setRawText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "all" | "daily" | "weekly" | "monthly"
  >("all");

  // Vérifier si l'utilisateur a accès
  const hasAccess =
    user?.role === GrantedRole.Admin || user?.role === GrantedRole.Operateur;

  const fetchReports = useCallback(
    async (periodType: "all" | "daily" | "weekly" | "monthly") => {
      if (!hasAccess) {
        toast.error(
          "Accès refusé : réservé aux administrateurs et opérateurs",
          {
            position: "top-left",
          }
        );
        return;
      }

      setIsLoading(true);
      setError(null);
      const toastId = toast.loading(
        `Chargement des rapports ${
          periodType === "all" ? "complets" : periodType
        }...`,
        {
          position: "top-left",
        }
      );

      try {
        let response: string;

        switch (periodType) {
          case "daily":
            response = await reportService.daily();
            break;
          case "weekly":
            response = await reportService.weekly();
            break;
          case "monthly":
            response = await reportService.monthly();
            break;
          case "all":
          default:
            response = await reportService.all();
            break;
        }

        setRawText(response);
        const parsedReports = parseReportText(response);
        setReports(parsedReports);
        setSelectedPeriod(periodType);

        toast.update(toastId, {
          render: `Rapports ${
            periodType === "all" ? "complets" : periodType
          } chargés avec succès`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      } catch (error: any) {
        console.log("Erreur chargement rapports:", error);
        const errorMessage =
          error.response?.data?.message ||
          `Erreur lors du chargement des rapports ${periodType}`;

        setError(errorMessage);
        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [hasAccess]
  );

  // Charger les rapports au montage si l'utilisateur a accès
  useEffect(() => {
    if (hasAccess) {
      fetchReports("all");
    }
  }, [fetchReports, hasAccess]);

  const all = useCallback(async () => {
    await fetchReports("all");
  }, [fetchReports]);

  const daily = useCallback(async () => {
    await fetchReports("daily");
  }, [fetchReports]);

  const weekly = useCallback(async () => {
    await fetchReports("weekly");
  }, [fetchReports]);

  const monthly = useCallback(async () => {
    await fetchReports("monthly");
  }, [fetchReports]);

  return {
    reports,
    rawText,
    isLoading,
    error,
    selectedPeriod,
    hasAccess,

    // Actions
    all,
    daily,
    weekly,
    monthly,
    fetchReports,
  };
};

// import { reportService } from "@/lib/services/report-service";
// import { useCallback, useState } from "react";

// export const useReportManagement = () => {
//   const [reports, setReports] = useState();
//   const all = useCallback(async () => {
//     const response = await reportService.all();
//     setReports(response);
//   }, []);

//   const daily = useCallback(async () => {
//     const response = await reportService.daily();
//     setReports(response);
//   }, []);

//   const weekly = useCallback(async () => {
//     const response = await reportService.weekly();
//     setReports(response);
//   }, []);

//   const monthly = useCallback(async () => {
//     const response = await reportService.monthly();
//     setReports(response);
//   }, []);

//   return {
//     reports,

//     all,
//     daily,
//     weekly,
//     monthly,
//   };
// };
