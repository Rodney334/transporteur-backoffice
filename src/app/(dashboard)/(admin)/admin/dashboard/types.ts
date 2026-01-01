// types.ts
import { Order } from "@/type/order.type";
import { User } from "@/type/user.type";
import { OrderStatus } from "@/type/enum";

export interface DashboardPeriod {
  type: "day" | "week" | "month" | "year" | "all";
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
}

export interface TopClient {
  user: User;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface TopCourier {
  user: User;
  totalDeliveries: number;
  totalRevenue: number;
  successRate: number;
}

export interface DashboardStats {
  // Cartes principales
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  deliveryRate: number;

  // Métriques avancées
  averageOrderValue: number;
  mostActiveCity: string;
  mostPopularService: string;
  conversionRate: number;

  // Données pour graphiques
  revenueTrend: RevenueData[];
  ordersByStatus: Record<OrderStatus, number>;
  ordersByService: Record<string, number>;

  // Top performers
  topClientsByOrders: TopClient[];
  topClientsByRevenue: TopClient[];
  topCouriersByDeliveries: TopCourier[];
  topCouriersByRevenue: TopCourier[];

  // Dernières commandes
  recentOrders: Order[];
}

export interface DashboardFilters {
  period: "day" | "week" | "month" | "year" | "all";
  startDate?: Date;
  endDate?: Date;
  status?: OrderStatus[];
  serviceType?: string[];
}
