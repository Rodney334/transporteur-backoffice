// app/(dashboard)/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useReportManagement } from "./hooks/report-hook";
import { ReportHeader } from "./components/ReportHeader";
import { PaymentSummaryCard } from "./components/PaymentSummaryCard";
import { CourseDetailsCard } from "./components/CourseDetailsCard";
import { LivreurStatsCard } from "./components/LivreurStatsCard";
import { LoadingSpinner } from "@/components/Loading";
import {
  AlertTriangle,
  Calendar,
  Users,
  DollarSign,
  Package,
} from "lucide-react";

export default function ReportPage() {
  const {
    reports,
    isLoading,
    error,
    selectedPeriod,
    hasAccess,
    all,
    daily,
    weekly,
    monthly,
    fetchReports,
  } = useReportManagement();

  const [activePeriodIndex, setActivePeriodIndex] = useState(0);

  // Gérer le changement de période
  const handlePeriodChange = async (
    period: "all" | "daily" | "weekly" | "monthly"
  ) => {
    await fetchReports(period);
    setActivePeriodIndex(0); // Retourner au premier rapport
  };

  // Exporter les données
  const handleExport = () => {
    // TODO: Implémenter l'export PDF/Excel
    alert("Fonctionnalité d'export à implémenter");
  };

  // Si l'utilisateur n'a pas accès
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-600 mb-6">
            Cette page est réservée aux administrateurs et opérateurs. Veuillez
            contacter votre administrateur système pour obtenir l'accès.
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

  // Écran de chargement
  if (isLoading && reports.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Écran d'erreur
  if (error && reports.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Erreur de Chargement
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchReports(selectedPeriod)}
            className="px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Aucun rapport
  if (reports.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Aucun Rapport Disponible
          </h2>
          <p className="text-gray-600">
            Aucune donnée de rapport n'est disponible pour le moment. Revenez
            plus tard ou vérifiez vos paramètres.
          </p>
        </div>
      </div>
    );
  }

  const currentReport = reports[activePeriodIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec filtres */}
        <ReportHeader
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          isLoading={isLoading}
          onExport={handleExport}
        />

        {/* Sélecteur de période multiple (si plusieurs rapports) */}
        {reports.length > 1 && (
          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Périodes disponibles :
              </h3>
              <div className="flex flex-wrap gap-2">
                {reports.map((report: any, index: any) => (
                  <button
                    key={index}
                    onClick={() => setActivePeriodIndex(index)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      activePeriodIndex === index
                        ? "bg-[#FD481A] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {report.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Avertissement cours non payés */}
        {currentReport.unpaidCoursesWarning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  {currentReport.unpaidCoursesWarning}
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Certaines courses livrées n'ont pas encore été payées.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Résumé des paiements */}
        {currentReport.paymentSummary && (
          <PaymentSummaryCard
            summary={currentReport.paymentSummary}
            className="mb-6"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Statistiques globales */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#FD481A]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Performances des Livreurs
                </h3>
              </div>

              <div className="space-y-6">
                {currentReport.livreurSummaries.map((item: any, index: any) => (
                  <LivreurStatsCard
                    key={`${item.summary.name}-${index}`}
                    summary={item.summary}
                    stats={item.stats}
                    className="border border-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Métriques rapides */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Livreurs Actifs
                </h3>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {currentReport.coursesByLivreur.length}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Livreurs avec des courses cette période
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Chiffre d'Affaires
                </h3>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {currentReport.paymentSummary.paid}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Total payé cette période
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Courses Total
                </h3>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {currentReport.coursesByLivreur.reduce(
                  (total: number, livreur: any) =>
                    total + livreur.courses.length,
                  0
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Courses effectuées cette période
              </p>
            </div>
          </div>
        </div>

        {/* Cours détaillés par livreur */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-[#FD481A]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Courses Détaillées
              </h3>
            </div>

            <div className="space-y-6">
              {currentReport.coursesByLivreur.map(
                (livreur: any, index: any) => (
                  <CourseDetailsCard
                    key={`${livreur.livreurName}-${index}`}
                    livreurName={livreur.livreurName}
                    courses={livreur.courses}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Indicateur de chargement pour les mises à jour */}
        {isLoading && reports.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FD481A]"></div>
            <span className="text-sm font-medium text-gray-700">
              Mise à jour des données...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
