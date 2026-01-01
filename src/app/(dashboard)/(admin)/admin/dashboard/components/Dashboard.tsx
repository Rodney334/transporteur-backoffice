// app/(dashboard)/admin/dashboard/page.tsx
"use client";

import { useState } from "react";
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
import { AlertTriangle } from "lucide-react";

export const Dashboard = () => {
  const { stats, isLoading, lastUpdated, filters, setFilters, refreshData } =
    useDashboard();

  // Gestion des erreurs
  if (isLoading && !stats) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
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
            onClick={refreshData}
            className="px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
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
        {/* En-tête avec filtres */}
        <DashboardHeader
          filters={filters}
          onFilterChange={setFilters}
          lastUpdated={lastUpdated}
          onRefresh={refreshData}
          isLoading={isLoading}
        />

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Dernières commandes */}
          <div className="lg:col-span-2">
            <RecentOrders orders={stats.recentOrders} />
          </div>

          {/* Top clients par commandes */}
          <div>
            <TopClients
              clients={stats.topClientsByOrders}
              title="Top Clients (Commandes)"
              metric="orders"
            />
          </div>
        </div>

        {/* Grille des tops performers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Pied de page */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            <p>Dashboard mis à jour en temps quasi-réel</p>
            <p className="mt-1">
              © {new Date().getFullYear()} - Tableau de Bord Commandes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
