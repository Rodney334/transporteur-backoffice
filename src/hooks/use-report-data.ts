
import { useState, useCallback, useEffect } from "react";
import { reportService } from "@/lib/services/report-service";
import { KPIResponse, AlertsResponse, CoursesResponse, KPISchema, AlertsSchema, CoursesSchema, ReportPeriod, SummaryPeriod, CoursesFilters } from "@/type/report.type";
import { toast } from "react-toastify";

export const useReportData = () => {
    const [period, setPeriod] = useState<ReportPeriod>(SummaryPeriod.DAY);
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

    // Data States
    const [kpis, setKpis] = useState<KPISchema | null>(null);
    const [alerts, setAlerts] = useState<AlertsSchema | null>(null);
    const [courses, setCourses] = useState<CoursesSchema | null>(null);

    // Courses Filters & Pagination
    const [coursesFilters, setCoursesFilters] = useState<CoursesFilters>({
        courierId: null,
        status: null,
        paymentStatus: null
    });
    const [coursesPage, setCoursesPage] = useState(1);
    const [coursesLimit, setCoursesLimit] = useState(10);

    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [kpisResponse, alertsResponse, coursesResponse] = await Promise.all([
                reportService.getKPIs(period, date),
                reportService.getAlerts(period, date),
                reportService.getCourses(period, date, {
                    ...coursesFilters,
                    page: coursesPage,
                    limit: coursesLimit
                })
            ]);

            console.log("Raw KPI Response:", kpisResponse);
            console.log("Raw Alerts Response:", alertsResponse);
            console.log("Raw Courses Response:", coursesResponse);

            setKpis(kpisResponse || null);
            setAlerts(alertsResponse || null);
            setCourses(coursesResponse || null);
        } catch (error) {
            console.error("Error fetching report data:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    }, [period, date, coursesFilters, coursesPage, coursesLimit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refreshData = () => {
        fetchData();
    };

    return {
        period,
        setPeriod,
        date,
        setDate,
        kpis,
        alerts,
        courses,
        coursesFilters,
        setCoursesFilters,
        coursesPage,
        setCoursesPage,
        coursesLimit,
        setCoursesLimit,
        isLoading,
        refreshData,
    };
};
