// hooks/use-dashboard.ts
import { useState, useEffect, useCallback } from "react";
import { useOrderStore } from "@/lib/stores/order-store";
import { DashboardCalculator } from "./utils";
import { DashboardStats, DashboardFilters } from "./types";
import { toast } from "react-toastify";

export const useDashboard = () => {
  const { orders, loading: ordersLoading, fetchOrders } = useOrderStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    period: "month",
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Charger les commandes
  const loadOrders = useCallback(async () => {
    try {
      await fetchOrders();
      setLastUpdated(new Date());
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
      console.error(error);
    }
  }, [fetchOrders]);

  // Calculer les statistiques
  const calculateStats = useCallback(async () => {
    if (orders.length === 0) {
      setStats(null);
      return;
    }

    setIsCalculating(true);
    try {
      const calculator = new DashboardCalculator(orders);

      // Charger les informations des livreurs
      const courierIds = [
        ...new Set(
          orders
            .filter((order) => order.assignedTo)
            .map((order) => order.assignedTo)
        ),
      ];

      await calculator.loadUsers(courierIds);

      // Calculer les statistiques
      const calculatedStats = calculator.calculateStats({
        period: filters.period,
        date: filters.startDate || new Date(),
      });

      setStats(calculatedStats);
    } catch (error) {
      console.error("Erreur calcul statistiques:", error);
      toast.error("Erreur lors du calcul des statistiques");
    } finally {
      setIsCalculating(false);
    }
  }, [orders, filters]);

  // Rafraîchir les données
  const refreshData = async () => {
    await loadOrders();
    toast.success("Données rafraîchies");
  };

  // Effets
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      calculateStats();
    }
  }, [orders, filters, calculateStats]);

  return {
    // Données
    stats,
    orders,

    // États
    isLoading: ordersLoading || isCalculating,
    lastUpdated,
    filters,

    // Actions
    setFilters,
    refreshData,
    loadOrders,
  };
};
