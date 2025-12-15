// stores/order-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order } from "@/type/order.type";
import { OrderStatus } from "@/type/enum";
import { orderService } from "@/lib/services/order-service";
import { equal } from "assert";

interface OrderStore {
  // État
  orders: Order[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions de base
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions métier
  fetchOrders: (userId?: string, userRole?: string) => Promise<void>;
  fetchUserOrders: (userId: string) => Promise<void>;

  // Mise à jour optimiste
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;

  // Gestion du cache
  clearOrders: () => void;
  invalidateCache: () => void;

  // Sélecteurs dérivés
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (statuses: OrderStatus[]) => Order[];
  getOrdersByTab: (tab: string, userRole: string, userId?: string) => Order[];

  // Stats
  getStats: () => {
    total: number;
    byStatus: Record<OrderStatus, number>;
  };
}

// Constantes pour le cache (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      // État initial
      orders: [],
      loading: false,
      error: null,
      lastFetched: null,

      // Actions de base
      setOrders: (orders) => set({ orders }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Charger les commandes (avec cache)
      fetchOrders: async (userId?: string, userRole?: string) => {
        const { lastFetched, orders } = get();
        const now = Date.now();

        // Vérifier le cache
        if (
          lastFetched &&
          now - lastFetched < CACHE_DURATION &&
          orders.length > 0
        ) {
          return; // Utiliser le cache
        }

        try {
          set({ loading: true, error: null });

          let ordersData: Order[] = [];

          // Logique de chargement selon le rôle
          if (userRole === "client" && userId) {
            ordersData = await orderService.getUserOrder(userId);
          } else {
            ordersData = await orderService.getOrder();
          }

          set({
            orders: ordersData,
            loading: false,
            lastFetched: now,
          });
        } catch (err: any) {
          console.error("Error fetching orders:", err);
          set({
            error: "Erreur lors du chargement des commandes",
            loading: false,
          });
        }
      },

      // Charger les commandes d'un utilisateur spécifique
      fetchUserOrders: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          const ordersData = await orderService.getUserOrder(userId);
          set({ orders: ordersData, loading: false });
        } catch (err: any) {
          console.error("Error fetching user orders:", err);
          set({
            error: "Erreur lors du chargement des commandes",
            loading: false,
          });
        }
      },

      // Mise à jour optimiste d'une commande
      updateOrder: (orderId: string, updates: Partial<Order>) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, ...updates } : order
          ),
        }));
      },

      // Ajouter une nouvelle commande
      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      // Supprimer une commande
      removeOrder: (orderId: string) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
      },

      // Vider les commandes
      clearOrders: () => {
        set({ orders: [], lastFetched: null });
      },

      // Invalider le cache
      invalidateCache: () => {
        set({ lastFetched: null });
      },

      // Sélecteurs
      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getOrdersByStatus: (statuses: OrderStatus[]) => {
        return get().orders.filter((order) =>
          statuses.includes(order.status as OrderStatus)
        );
      },

      getOrdersByTab: (tab: string, userRole: string, userId?: string) => {
        const { orders } = get();

        // Mapping des statuts par onglet
        const statusMapping: Record<string, OrderStatus[]> = {
          Nouvelles: [OrderStatus.EN_ATTENTE],
          "En cours": [
            OrderStatus.ASSIGNEE,
            OrderStatus.EN_DISCUSSION,
            OrderStatus.PRIX_VALIDE,
            OrderStatus.EN_LIVRAISON,
          ],
          Terminées: [OrderStatus.LIVREE, OrderStatus.ECHEC],
        };

        const clientStatusMapping: Record<string, OrderStatus[]> = {
          "En cours": [
            OrderStatus.EN_ATTENTE,
            OrderStatus.ASSIGNEE,
            OrderStatus.EN_DISCUSSION,
            OrderStatus.PRIX_VALIDE,
            OrderStatus.EN_LIVRAISON,
          ],
          Terminées: [OrderStatus.LIVREE, OrderStatus.ECHEC],
        };

        const statuses =
          userRole === "client"
            ? clientStatusMapping[tab] || []
            : statusMapping[tab] || [];

        return orders.filter((order) => {
          const isInStatus = statuses.includes(order.status as OrderStatus);

          // Pour le client, filtre par userId
          if (userRole === "client") {
            return isInStatus && order.createdBy._id === userId;
          }

          // Pour les livreurs, filtrage supplémentaire
          if (userRole === "livreur") {
            if (tab === "Nouvelles") {
              return isInStatus;
            }
            if (tab === "En cours" || tab === "Terminées") {
              return isInStatus && order.assignedTo === userId;
            }
          }

          // Pour admin/opérateur
          return isInStatus;
        });
      },

      // Statistiques
      getStats: () => {
        const { orders } = get();
        const byStatus: Record<OrderStatus, number> = {} as Record<
          OrderStatus,
          number
        >;

        orders.forEach((order) => {
          const status = order.status as OrderStatus;
          byStatus[status] = (byStatus[status] || 0) + 1;
        });

        return {
          total: orders.length,
          byStatus,
        };
      },
    }),
    {
      name: "order-storage",
      partialize: (state) => ({
        orders: state.orders,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Hook personnalisé pour les actions courantes
export const useOrderActions = () => {
  const store = useOrderStore();

  return {
    // Actions avec toast et mise à jour optimiste
    acceptOrder: async (orderId: string) => {
      const order = store.getOrderById(orderId);
      if (!order) return;

      // Mise à jour optimiste
      store.updateOrder(orderId, {
        status: OrderStatus.ASSIGNEE,
        updatedAt: new Date().toISOString(),
      });

      try {
        await orderService.acceptOrder(orderId);
        // Optionnel: recharger pour s'assurer de la synchronisation
        await store.fetchOrders();
      } catch (err) {
        // Rollback en cas d'erreur
        store.updateOrder(orderId, {
          status: order.status,
          updatedAt: order.updatedAt,
        });
        throw err;
      }
    },

    rejectOrder: async (orderId: string) => {
      const order = store.getOrderById(orderId);
      if (!order) return;

      store.updateOrder(orderId, {
        status: OrderStatus.ECHEC,
        updatedAt: new Date().toISOString(),
      });

      try {
        await orderService.rejectOrder(orderId);
      } catch (err) {
        store.updateOrder(orderId, {
          status: order.status,
          updatedAt: order.updatedAt,
        });
        throw err;
      }
    },

    endOrder: async (orderId: string) => {
      const order = store.getOrderById(orderId);
      if (!order) return;

      store.updateOrder(orderId, {
        status: OrderStatus.LIVREE,
        updatedAt: new Date().toISOString(),
      });

      try {
        await orderService.endOrder(orderId);
      } catch (err) {
        store.updateOrder(orderId, {
          status: order.status,
          updatedAt: order.updatedAt,
        });
        throw err;
      }
    },

    validatePrice: async (orderId: string, price: number, method?: string) => {
      try {
        if (method) {
          await orderService.clientValidatePrice(orderId, price, method);
        } else {
          await orderService.validatePrice(orderId, price);
        }

        // Recharger pour obtenir les données de négociation à jour
        await store.fetchOrders();
      } catch (err) {
        throw err;
      }
    },
  };
};
