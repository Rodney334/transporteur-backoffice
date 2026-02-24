"use client";

import { reportService } from "@/lib/services/report-service";
import { CourierSummaryResponse, SummaryPeriod } from "@/type/report.type";
import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/use-auth";
import { GrantedRole } from "@/type/enum";

export const useCourierReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CourierSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<SummaryPeriod>(SummaryPeriod.MONTH);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const hasAccess =
    user?.role === GrantedRole.Admin || user?.role === GrantedRole.Operateur;

  const fetchReport = useCallback(
    async (p: SummaryPeriod, d: string) => {
      if (!hasAccess) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await reportService.getCouriersSummary(p, d);
        setData(response);
      } catch (err: any) {
        console.error("Error fetching courier report:", err);
        const errorMessage =
          err.response?.data?.message || "Erreur lors du chargement du rapport";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [hasAccess]
  );

  useEffect(() => {
    if (hasAccess) {
      fetchReport(period, date);
    }
  }, [fetchReport, period, date, hasAccess]);

  const refreshAction = () => fetchReport(period, date);

  return {
    data,
    isLoading,
    error,
    period,
    setPeriod,
    date,
    setDate,
    hasAccess,
    refreshAction,
  };
};
