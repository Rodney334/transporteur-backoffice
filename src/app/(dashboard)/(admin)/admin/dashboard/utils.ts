// utils/dashboard-calculator.ts
import { Order } from "@/type/order.type";
import { User } from "@/type/user.type";
import { OrderStatus } from "@/type/enum";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, 
         startOfMonth, endOfMonth, startOfYear, endOfYear, 
         eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { userService } from "@/lib/services/user-service";
import { DashboardStats, RevenueData } from "./types";

export class DashboardCalculator {
  private orders: Order[];
  private users: Map<string, User> = new Map();

  constructor(orders: Order[]) {
    this.orders = orders;
  }

  // Charger les informations utilisateur
  async loadUsers(userIds: string[]): Promise<void> {
    const uniqueIds = [...new Set(userIds)];
    
    for (const userId of uniqueIds) {
      try {
        const user = await userService.getUserById(userId);
        this.users.set(userId, user);
      } catch (error) {
        console.warn(`Utilisateur ${userId} non trouvé`);
      }
    }
  }

  // Filtrer les commandes par période
  filterOrdersByPeriod(
    orders: Order[],
    period: "day" | "week" | "month" | "year" | "all",
    date: Date = new Date()
  ): Order[] {
    const now = new Date(date);
    
    switch (period) {
      case "day":
        const startOfDayDate = startOfDay(now);
        const endOfDayDate = endOfDay(now);
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfDayDate && orderDate <= endOfDayDate;
        });

      case "week":
        const startOfWeekDate = startOfWeek(now, { locale: fr });
        const endOfWeekDate = endOfWeek(now, { locale: fr });
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfWeekDate && orderDate <= endOfWeekDate;
        });

      case "month":
        const startOfMonthDate = startOfMonth(now);
        const endOfMonthDate = endOfMonth(now);
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfMonthDate && orderDate <= endOfMonthDate;
        });

      case "year":
        const startOfYearDate = startOfYear(now);
        const endOfYearDate = endOfYear(now);
        return orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfYearDate && orderDate <= endOfYearDate;
        });

      case "all":
      default:
        return orders;
    }
  }

  // Calculer les statistiques principales
  calculateStats(filters: {
    period: "day" | "week" | "month" | "year" | "all";
    date?: Date;
  }): DashboardStats {
    const filteredOrders = this.filterOrdersByPeriod(
      this.orders, 
      filters.period, 
      filters.date
    );

    // Commandes livrées uniquement
    const deliveredOrders = filteredOrders.filter(
      order => order.status === OrderStatus.LIVREE && order.finalPrice !== null
    );

    // Commandes en cours
    const activeOrders = filteredOrders.filter(order =>
      [OrderStatus.EN_ATTENTE, OrderStatus.ASSIGNEE, OrderStatus.EN_DISCUSSION, 
       OrderStatus.PRIX_VALIDE, OrderStatus.EN_LIVRAISON].includes(order.status)
    );

    // Revenus totaux (seulement finalPrice des commandes livrées)
    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + (order.finalPrice || 0), 
      0
    );

    // Statistiques par statut
    const ordersByStatus = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);

    // Statistiques par type de service
    const ordersByService = filteredOrders.reduce((acc, order) => {
      acc[order.serviceType] = (acc[order.serviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ville la plus active
    const cityFrequency = filteredOrders.reduce((acc, order) => {
      const city = order.deliveryAddress.city || order.pickupAddress.city || 'Inconnue';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostActiveCity = Object.entries(cityFrequency)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Aucune';

    // Service le plus populaire
    const mostPopularService = Object.entries(ordersByService)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Aucun';

    // Top clients (par nombre de commandes livrées)
    const clientOrders = deliveredOrders.reduce((acc, order) => {
      const clientId = order.createdBy._id;
      if (!acc[clientId]) {
        acc[clientId] = {
          user: order.createdBy,
          orders: 0,
          revenue: 0
        };
      }
      acc[clientId].orders++;
      acc[clientId].revenue += order.finalPrice || 0;
      return acc;
    }, {} as Record<string, { user: User; orders: number; revenue: number }>);

    const topClientsByOrders = Object.values(clientOrders)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 3)
      .map(item => ({
        user: item.user,
        totalOrders: item.orders,
        totalRevenue: item.revenue,
        averageOrderValue: item.revenue / item.orders
      }));

    const topClientsByRevenue = Object.values(clientOrders)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
      .map(item => ({
        user: item.user,
        totalOrders: item.orders,
        totalRevenue: item.revenue,
        averageOrderValue: item.revenue / item.orders
      }));

    // Top livreurs (seulement commandes livrées)
    const courierOrders = deliveredOrders.reduce((acc, order) => {
      const courierId = order.assignedTo;
      if (!courierId) return acc;
      
      if (!acc[courierId]) {
        acc[courierId] = {
          id: courierId,
          deliveries: 0,
          revenue: 0,
          totalOrders: 0
        };
      }
      acc[courierId].deliveries++;
      acc[courierId].revenue += order.finalPrice || 0;
      return acc;
    }, {} as Record<string, { id: string; deliveries: number; revenue: number; totalOrders: number }>);

    // Pour les livreurs, on charge les informations utilisateur
    const courierIds = Object.keys(courierOrders);
    
    const topCouriersByDeliveries = courierIds
      .sort((a, b) => courierOrders[b].deliveries - courierOrders[a].deliveries)
      .slice(0, 3)
      .map(courierId => {
        const courier = this.users.get(courierId);
        const data = courierOrders[courierId];
        const userOrders = filteredOrders.filter(o => o.assignedTo === courierId);
        const successfulOrders = userOrders.filter(o => o.status === OrderStatus.LIVREE).length;
        
        return {
          user: courier || {
            _id: courierId,
            name: `Livreur ${courierId.slice(0, 6)}`,
            email: '',
            phoneNumber: '',
            countryCode: '',
            role: 'courier' as any,
            genderrole: 'male' as any,
            createdAt: '',
            updatedAt: '',
            isArchived: false,
            refreshToken: null
          },
          totalDeliveries: data.deliveries,
          totalRevenue: data.revenue,
          successRate: userOrders.length > 0 
            ? Math.round((successfulOrders / userOrders.length) * 100) 
            : 0
        };
      });

    const topCouriersByRevenue = courierIds
      .sort((a, b) => courierOrders[b].revenue - courierOrders[a].revenue)
      .slice(0, 3)
      .map(courierId => {
        const courier = this.users.get(courierId);
        const data = courierOrders[courierId];
        const userOrders = filteredOrders.filter(o => o.assignedTo === courierId);
        const successfulOrders = userOrders.filter(o => o.status === OrderStatus.LIVREE).length;
        
        return {
          user: courier || {
            _id: courierId,
            name: `Livreur ${courierId.slice(0, 6)}`,
            email: '',
            phoneNumber: '',
            countryCode: '',
            role: 'courier' as any,
            genderrole: 'male' as any,
            createdAt: '',
            updatedAt: '',
            isArchived: false,
            refreshToken: null
          },
          totalDeliveries: data.deliveries,
          totalRevenue: data.revenue,
          successRate: userOrders.length > 0 
            ? Math.round((successfulOrders / userOrders.length) * 100) 
            : 0
        };
      });

    // Tendance des revenus (selon période)
    const revenueTrend = this.calculateRevenueTrend(filteredOrders, filters.period);

    // Trois dernières commandes
    const recentOrders = filteredOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return {
      // Cartes principales
      totalRevenue,
      totalOrders: filteredOrders.length,
      activeOrders: activeOrders.length,
      deliveryRate: filteredOrders.length > 0 
        ? Math.round((deliveredOrders.length / filteredOrders.length) * 100) 
        : 0,
      
      // Métriques avancées
      averageOrderValue: deliveredOrders.length > 0 
        ? Math.round(totalRevenue / deliveredOrders.length) 
        : 0,
      mostActiveCity,
      mostPopularService,
      conversionRate: filteredOrders.length > 0 
        ? Math.round((deliveredOrders.length / filteredOrders.length) * 100) 
        : 0,
      
      // Données pour graphiques
      revenueTrend,
      ordersByStatus,
      ordersByService,
      
      // Top performers
      topClientsByOrders,
      topClientsByRevenue,
      topCouriersByDeliveries,
      topCouriersByRevenue,
      
      // Dernières commandes
      recentOrders
    };
  }

  // Calculer la tendance des revenus
  private calculateRevenueTrend(
    orders: Order[],
    period: "day" | "week" | "month" | "year" | "all"
  ): RevenueData[] {
    const deliveredOrders = orders.filter(
      order => order.status === OrderStatus.LIVREE && order.finalPrice !== null
    );

    if (period === "all") {
      // Grouper par mois pour "all"
      const monthlyData = deliveredOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const monthKey = format(date, 'yyyy-MM');
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            revenue: 0,
            orders: 0
          };
        }
        
        acc[monthKey].revenue += order.finalPrice || 0;
        acc[monthKey].orders++;
        return acc;
      }, {} as Record<string, { revenue: number; orders: number }>);

      return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([period, data]) => ({
          period: format(new Date(`${period}-01`), 'MMM yyyy', { locale: fr }),
          revenue: data.revenue,
          orders: data.orders
        }));
    }

    const now = new Date();
    let intervals: Date[] = [];
    let formatter: (date: Date) => string;

    switch (period) {
      case "day":
        // 24 heures
        intervals = Array.from({ length: 24 }, (_, i) => {
          const date = new Date(now);
          date.setHours(date.getHours() - 23 + i);
          return date;
        });
        formatter = (date) => format(date, 'HH:00', { locale: fr });
        break;

      case "week":
        // 7 jours
        intervals = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - 6 + i);
          return startOfDay(date);
        });
        formatter = (date) => format(date, 'EEE', { locale: fr });
        break;

      case "month":
        // 30 jours
        intervals = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - 29 + i);
          return startOfDay(date);
        });
        formatter = (date) => format(date, 'dd MMM', { locale: fr });
        break;

      case "year":
        // 12 mois
        intervals = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now);
          date.setMonth(date.getMonth() - 11 + i);
          return startOfMonth(date);
        });
        formatter = (date) => format(date, 'MMM', { locale: fr });
        break;

      default:
        return [];
    }

    return intervals.map(intervalDate => {
      let startDate: Date, endDate: Date;
      
      switch (period) {
        case "day":
          startDate = new Date(intervalDate);
          endDate = new Date(intervalDate);
          endDate.setHours(endDate.getHours() + 1);
          break;
        case "week":
        case "month":
          startDate = startOfDay(intervalDate);
          endDate = endOfDay(intervalDate);
          break;
        case "year":
          startDate = startOfMonth(intervalDate);
          endDate = endOfMonth(intervalDate);
          break;
        default:
          startDate = intervalDate;
          endDate = intervalDate;
      }

      const periodOrders = deliveredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });

      const revenue = periodOrders.reduce(
        (sum, order) => sum + (order.finalPrice || 0), 
        0
      );

      return {
        period: formatter(intervalDate),
        revenue,
        orders: periodOrders.length
      };
    });
  }
}