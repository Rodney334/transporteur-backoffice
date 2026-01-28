// app/(dashboard)/admin/dashboard/page.tsx
"use client";

import { useDashboard } from "../use-dashboard";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardHeader } from "./DashboardHeader";
import { StatsCards } from "./StatsCards";
import { RevenueChart } from "./RevenueChart";
import { RecentOrders } from "./RecentOrders";
import { TopClients } from "./TopClients";
import { TopCouriers } from "./TopCouriers";
import { AdvancedMetrics } from "./AdvancedMetrics";
import { ExportPanel } from "./ExportPanel";
import { AlertTriangle, BarChart3 } from "lucide-react";

// Imports pour les nouveaux rapports
import { useReportData } from "@/hooks/use-report-data";
import { ReportFilters } from "./reports/ReportFilters";
import { KPIsCards } from "./reports/KPIsCards";
import { AlertsList } from "./reports/AlertsList";
import { CoursesTable } from "./reports/CoursesTable";
import { KPICharts } from "./reports/KPICharts";

export const Dashboard = () => {
  // 1. Logique existante du Dashboard
  const { stats, isLoading: isDashboardLoading, lastUpdated, filters, setFilters, refreshData: refreshDashboard } =
    useDashboard();

  // 2. Logique pour les nouveaux rapports
  const {
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
    isLoading: isReportLoading,
    refreshData: refreshReports,
  } = useReportData();

  // Fonction globale de rafraîchissement
  const handleRefreshAll = () => {
    refreshDashboard();
    refreshReports();
  };

  console.log("Stats:", stats);
  console.log("KPIs:", kpis);
  console.log("Courses:", courses);
  console.log("Alerts:", alerts);

  // Gestion des erreurs / Loading initial (si aucune donnée du tout)
  if (isDashboardLoading && !stats) {
    return <DashboardSkeleton />;
  }

  // Si on a les deux sets de données nuls, on affiche l'écran vide
  if (!stats && !kpis) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Aucune Donnée Disponible
          </h2>
          <p className="text-gray-600 mb-6">
            Aucune commande n'a été trouvée. Les statistiques apparaîtront ici
            lorsque des commandes seront créées.
          </p>
          <button
            onClick={handleRefreshAll}
            className="cursor-pointer px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* =================================================================================
            SECTION 1: DASHBOARD PRINCIPAL (EXISTANT)
           ================================================================================= */}

        <DashboardHeader
          filters={filters}
          onFilterChange={setFilters}
          lastUpdated={lastUpdated}
          onRefresh={handleRefreshAll}
          isLoading={isDashboardLoading || isReportLoading}
        />

        {stats && (
          <>
            {/* Cartes de statistiques principales */}
            <StatsCards stats={stats} />

            {/* Graphique des revenus */}
            <RevenueChart
              data={stats.revenueTrend}
              period={filters.period}
              totalRevenue={stats.totalRevenue}
            />

            {/* Panel d'export */}
            <ExportPanel
              stats={stats}
              filters={filters}
              lastUpdated={lastUpdated}
            />

            {/* Métriques avancées */}
            <AdvancedMetrics stats={stats} />

            {/* Grille des sections inférieures */}
            <div className="grid grid-cols-1 mb-8">
              {/* Dernières commandes */}
              <div>
                <RecentOrders orders={stats.recentOrders} />
              </div>
            </div>

            {/* Grille des tops performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Top clients par commandes */}
              <div>
                <TopClients
                  clients={stats.topClientsByOrders}
                  title="Top Clients (Commandes)"
                  metric="orders"
                />
              </div>

              {/* Top clients par revenus */}
              <div>
                <TopClients
                  clients={stats.topClientsByRevenue}
                  title="Top Clients (Revenus)"
                  metric="revenue"
                />
              </div>

              {/* Top livreurs par livraisons */}
              <div>
                <TopCouriers
                  couriers={stats.topCouriersByDeliveries}
                  title="Top Livreurs (Livraisons)"
                  metric="deliveries"
                />
              </div>

              {/* Top livreurs par revenus */}
              <div>
                <TopCouriers
                  couriers={stats.topCouriersByRevenue}
                  title="Top Livreurs (Revenus)"
                  metric="revenue"
                />
              </div>
            </div>
          </>
        )}

        {/* =================================================================================
            SECTION 2: RAPPORTS DÉTAILLÉS (NOUVEAU)
           ================================================================================= */}

        <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Rapports Détaillés & KPIs
              </h2>
              <p className="text-gray-500 text-sm">
                Analyse approfondie des performances journalières
              </p>
            </div>
          </div>

          {/* Filtres Spécifiques aux Rapports */}
          <ReportFilters
            period={period}
            onPeriodChange={setPeriod}
            date={date}
            onDateChange={setDate}
            onRefresh={refreshReports}
            isLoading={isReportLoading}
          />

          {/* KPIs Cards */}
          {kpis && <KPIsCards kpis={kpis} />}

          {/* Charts & Alerts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              {kpis && (kpis.topToCities.length > 0 || kpis.topRoutes.length > 0) ? (
                <KPICharts kpis={kpis} />
              ) : (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex items-center justify-center text-gray-400">
                  Aucune donnée graphique disponible
                </div>
              )}
            </div>
            <div className="xl:col-span-1">
              {alerts && <AlertsList alerts={alerts} />}
            </div>
          </div>

          {/* Courses Table */}
          <div className="mb-8">
            {courses && (
              <CoursesTable
                courses={courses}
                filters={coursesFilters}
                onFilterChange={setCoursesFilters}
                page={coursesPage}
                limit={coursesLimit}
                onPageChange={setCoursesPage}
              />
            )}
          </div>
        </div>

        {/* Footer Global */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            <p>Dashboard mis à jour en temps quasi-réel</p>
            <p className="mt-1">
              © {new Date().getFullYear()} - Transporteur Backoffice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
