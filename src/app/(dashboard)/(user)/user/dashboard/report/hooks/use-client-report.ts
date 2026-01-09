// app/(dashboard)/reports/hooks/use-client-report.ts
import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/use-auth";
import { GrantedRole } from "@/type/enum";
import { reportService } from "@/lib/services/report-service";
import { ClientReport, CourseStats, CityStats, Course } from "../types/types";
import { transformReportData } from "../utils/report-transformer";
import { OrderStatus } from "@/type/enum";

export const useClientReport = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données dérivées
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [cityStats, setCityStats] = useState<CityStats | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");

  const hasAccess = user?.role === GrantedRole.Client;

  const fetchReport = useCallback(async () => {
    if (!hasAccess) {
      setError("Accès non autorisé");
      return;
    }

    setIsLoading(true);
    setError(null);

    const toastId = toast.loading("Chargement de votre rapport...", {
      position: "top-left",
    });

    try {
      const response = await reportService.currentUser();
      const clientReport: ClientReport = response;

      setReport(clientReport);
      setFilteredCourses(clientReport.courses);

      // Transformer les données
      const transformed = transformReportData(clientReport);
      setStats(transformed.courseStats);
      setCityStats(transformed.cityStats);

      toast.update(toastId, {
        render: "Rapport chargé avec succès",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    } catch (error: any) {
      console.log("Erreur chargement rapport:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors du chargement de votre rapport";

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
  }, [hasAccess]);

  // Filtrer les courses par statut
  const filterCourses = useCallback(
    (status: OrderStatus | "all") => {
      setActiveFilter(status);
      if (!report) return;

      if (status === "all") {
        setFilteredCourses(report.courses);
      } else {
        setFilteredCourses(
          report.courses.filter((course) => course.status === status)
        );
      }
    },
    [report]
  );

  // Charger au montage
  useEffect(() => {
    if (hasAccess) {
      fetchReport();
    }
  }, [fetchReport, hasAccess]);

  return {
    // Données
    report,
    stats,
    cityStats,
    filteredCourses,

    // États
    isLoading,
    error,
    hasAccess,
    activeFilter,

    // Actions
    fetchReport,
    filterCourses,
  };
};
