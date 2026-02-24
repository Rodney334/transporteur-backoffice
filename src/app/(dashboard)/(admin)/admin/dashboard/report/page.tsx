// app/(dashboard)/reports/page.tsx
"use client";

import { useCourierReport } from "./hooks/json-report-hook";
import { ReportHeader } from "./components/ReportHeader";
import { PaymentSummaryCard } from "./components/PaymentSummaryCard";
import { CourseDetailsCard } from "./components/CourseDetailsCard";
import { LivreurStatsCard } from "./components/LivreurStatsCard";
import { KPIStatsCard } from "./components/KPIStatsCard";
import { LeaderboardCard } from "./components/LeaderboardCard";
import { exportCourierSummaryToCSV } from "./lib/csv-export";
import { LoadingSpinner } from "@/components/Loading";
import {
  AlertTriangle,
  FolderOpen
} from "lucide-react";
import ProtectedRoute from "@/components/Protected-route";
import { GrantedRole } from "@/type/enum";

export default function ReportPage() {
  const {
    data,
    isLoading,
    error,
    period,
    setPeriod,
    date,
    setDate,
    hasAccess,
    refreshAction,
  } = useCourierReport();

  // Exporter les données
  const handleExport = () => {
    if (data) {
      exportCourierSummaryToCSV(data);
    } else {
      alert("Aucune donnée à exporter");
    }
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
            className="cursor-pointer px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Écran de chargement initial
  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Écran d'erreur
  if (error && !data) {
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
            onClick={refreshAction}
            className="cursor-pointer px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Aucun rapport
  if (!data && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Données indisponibles
          </h2>
          <p className="text-gray-600 mb-4">
            Aucune donnée de rapport trouvée pour la période et date sélectionnées.
          </p>
          <button
            onClick={refreshAction}
            className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Actualiser
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[GrantedRole.Admin, GrantedRole.Operateur]}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* En-tête avec filtres */}
          <ReportHeader
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            selectedDate={date}
            onDateChange={setDate}
            isLoading={isLoading}
            onExport={handleExport}
          />

          {data && (
            <>
              {/* KPIs Globaux */}
              <KPIStatsCard kpis={data.kpis} className="mb-6" />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                {/* Classement et Paiements */}
                <div className="lg:col-span-2 space-y-6">
                  <LeaderboardCard leaderboard={data.leaderboard} />
                  
                  <PaymentSummaryCard summary={data.payments} />

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                      Performances Individuelles
                    </h3>
                    <div className="space-y-6">
                      {data.couriers.map((courier) => (
                        <LivreurStatsCard
                          key={courier.courierId}
                          summary={courier}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Détails des courses (Sidebar ou section à droite) */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 px-2">
                    Dernières Courses
                  </h3>
                  <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {data.couriers.map((courier) => (
                      <CourseDetailsCard
                        key={`details-${courier.courierId}`}
                        livreurName={courier.courierName}
                        courses={courier.courses}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Indicateur de chargement pour les mises à jour */}
          {isLoading && data && (
            <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FD481A]"></div>
              <span className="text-sm font-medium text-gray-700">
                Mise à jour des données...
              </span>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
