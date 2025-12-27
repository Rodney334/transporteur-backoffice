// app/(dashboard)/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useClientReport } from "./hooks/use-client-report";
import { ClientDashboardSkeleton } from "./components/ClientDashboardSkeleton";
import { SummaryCards } from "./components/SummaryCards";
import { RevenueChart } from "./components/RevenueChart";
import { CityMetricsCard } from "./components/CityMetricsCard";
import { CoursesTable } from "./components/CoursesTable";
import { ExportPanel } from "./components/ExportPanel";
import { AlertTriangle, RefreshCw, BarChart3 } from "lucide-react";
import { toast } from "react-toastify";

export default function ReportPage() {
  const {
    report,
    stats,
    cityStats,
    filteredCourses,
    isLoading,
    error,
    hasAccess,
    activeFilter,
    fetchReport,
    filterCourses,
  } = useClientReport();

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    fetchReport();
    toast.info("Actualisation en cours...");
  };

  const handleExport = () => {
    toast.success("Export lancé ! Vérifiez vos téléchargements.");
  };

  // Écran de chargement initial
  if (isLoading && !report) {
    return <ClientDashboardSkeleton />;
  }

  // Vérification d'accès
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Accès Non Autorisé
          </h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page. Cette fonctionnalité est réservée aux clients.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Écran d'erreur
  if (error && !report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Erreur de Chargement
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Aucune donnée
  if (!report && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Aucune Donnée Disponible
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore effectué de courses. Vos statistiques
            apparaîtront ici après votre première commande.
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>
    );
  }

  if (!report || !stats || !cityStats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Tableau de Bord Client
              </h1>
              <p className="text-gray-600 mt-1">
                Analyse de vos performances et historique des courses
              </p>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-sm text-gray-500 hidden md:block">
                  Mis à jour:{" "}
                  {lastUpdated.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Actualiser
              </button>
            </div>
          </div>

          {/* Indicateur de chargement si mise à jour */}
          {isLoading && report && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg mb-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Mise à jour des données...</span>
            </div>
          )}
        </div>

        {/* Cartes de statistiques */}
        <SummaryCards stats={stats} isLoading={isLoading} />

        {/* Graphique des revenus */}
        <RevenueChart
          dailyData={report.perDay}
          weeklyData={report.perWeek}
          monthlyData={report.perMonth}
        />

        {/* Panel d'export */}
        <ExportPanel
          report={report}
          stats={stats}
          onExportComplete={handleExport}
        />

        {/* Métriques des villes */}
        <CityMetricsCard
          favoriteCity={cityStats.favoriteCity}
          worstCity={cityStats.worstCity}
          favoriteRoute={cityStats.favoriteRoute}
          mostFrequentFromCity={cityStats.mostFrequentFromCity}
          mostFrequentToCity={cityStats.mostFrequentToCity}
          totalCities={cityStats.totalCities}
        />

        {/* Tableau des courses */}
        <CoursesTable
          courses={filteredCourses}
          activeFilter={activeFilter}
          onFilterChange={filterCourses}
          onExport={handleExport}
        />

        {/* Pied de page */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div>
              <p>ID Client: {report.id.slice(0, 8)}...</p>
              <p className="mt-1">
                Dernière activité:{" "}
                {new Date(
                  report.courses[0]?.date || Date.now()
                ).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} Dashboard Client</p>
              <p className="mt-1">Données mises à jour en temps quasi-réel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
