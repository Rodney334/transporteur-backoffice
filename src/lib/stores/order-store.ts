// stores/order-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order } from "@/type/order.type";
import { OrderStatus } from "@/type/enum";
import { orderService } from "@/lib/services/order-service";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useAuthStore } from "./auth-store";
import { showSimpleNotification } from "@/utils/web-notifications-simple";

interface OrderStore {
  // État
  orders: Order[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  socket: WebSocket | null;
  isConnected: boolean;

  // Actions de base
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSocket: (socket: WebSocket | null) => void;
  setIsConnected: (isConnected: boolean) => void;

  // Actions métier
  fetchOrders: (userId?: string, userRole?: string) => Promise<void>;
  fetchUserOrders: (userId: string) => Promise<void>;

  // WebSocket
  connectWebSocket: (token: string) => void;
  disconnectWebSocket: () => void;
  handleWebSocketMessage: (event: MessageEvent) => void;

  handleOrderCreated: (payloard: Order) => void;
  handleOrderUpdated: (payloard: Order) => void;
  handleOrderStatusChanged: (payloard: Order) => void;
  handleOrderDeleted: (payloard: Order) => void;
  handlePriceNegotiation: (payloard: Order) => void;

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
// URL de base WebSocket
const WS_BASE_URL = "wss://letransporteur-production.up.railway.app/";

export const useOrderStore = create<OrderStore>()(
  // persist(
  (set, get) => ({
    // État initial
    orders: [],
    loading: false,
    error: null,
    lastFetched: null,
    socket: null,
    isConnected: false,

    // Actions de base
    setOrders: (orders) => set({ orders }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSocket: (socket) => set({ socket }),
    setIsConnected: (isConnected) => set({ isConnected }),

    // Charger les commandes (avec cache)
    fetchOrders: async (userId?: string, userRole?: string) => {
      const { lastFetched, orders, isConnected } = get();
      const now = Date.now();

      // Vérifier le cache (sauf si WebSocket est connecté pour données temps réel)
      if (
        !isConnected &&
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
        console.log("Error fetching orders:", err);
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
        console.log("Error fetching user orders:", err);
        set({
          error: "Erreur lors du chargement des commandes",
          loading: false,
        });
      }
    },

    // Connexion WebSocket
    connectWebSocket: (token: string) => {
      const { socket, isConnected } = get();

      // Si déjà connecté, ne rien faire
      if (isConnected && socket) {
        console.log("WebSocket déjà connecté");
        return;
      }

      // Fermer l'ancienne connexion si elle existe
      if (socket) {
        socket.close();
      }

      const wsUrl = `${WS_BASE_URL}?token=${token}`;
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log("WebSocket connecté");
        set({ isConnected: true });
        toast.success("Connecté en temps réel", {
          position: "top-right",
          autoClose: 1500,
        });
      };

      newSocket.onclose = (event) => {
        console.log("WebSocket déconnecté", event.code, event.reason);
        set({ isConnected: false, socket: null });

        // if (event.code !== 1000) {
        //   // 1000 = fermeture normale
        //   toast.warning("Déconnexion WebSocket. Reconnexion...", {
        //     position: "top-right",
        //     autoClose: 3000,
        //   });

        //   // Tentative de reconnexion après 5 secondes
        //   setTimeout(() => {
        //     const { isConnected: currentConnected } = get();
        //     if (!currentConnected) {
        //       get().connectWebSocket(token);
        //     }
        //   }, 5000);
        // }
      };

      newSocket.onerror = (error) => {
        console.log("WebSocket error:", error);
        set({ isConnected: false });
        // toast.error("Erreur de connexion WebSocket", {
        //   position: "top-right",
        //   autoClose: 5000,
        // });
      };

      newSocket.onmessage = (event) => {
        // console.log({ websocket: event });
        get().handleWebSocketMessage(event);
      };

      set({ socket: newSocket });
    },

    // Déconnexion WebSocket
    disconnectWebSocket: () => {
      const { socket } = get();
      if (socket) {
        socket.close(1000, "Déconnexion utilisateur");
        set({ socket: null, isConnected: false });
      }
    },

    // Gestion des messages WebSocket
    handleWebSocketMessage: async (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        const { type, payload } = data;

        toast.info(payload.message || "Nouvelle notification", {
          position: "top-right",
          autoClose: 5000,
        });

        // await showSimpleNotification(
        //   "Nouvelle notification",
        //   payload.message || "Vous avez une nouvelle notification"
        // );

        // Notification web (seulement si permission accordée)
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            const notification = new Notification("Nouvelle notification", {
              body: payload.message || "Vous avez une nouvelle notification",
              icon: "/favicon.ico",
            });

            // Fermer automatiquement après 5 secondes
            setTimeout(() => notification.close(), 5000);

            // Rediriger au clic
            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          }
          // Si permission n'est pas "granted", on n'affiche pas de notification web
          // L'utilisateur doit d'abord activer via SimpleNotificationToggle
        }

        const authStore = useAuthStore.getState();
        const { user } = authStore;

        // Rafraîchir les commandes
        const { fetchOrders } = get();
        if (user?._id && user?.role) {
          fetchOrders(user._id, user.role);
        } else {
          fetchOrders();
        }
      } catch (error) {
        console.log("Erreur parsing WebSocket message:", error);
      }
    },

    // Gestion des événements spécifiques
    handleOrderCreated: (order: Order) => {
      set((state) => ({
        orders: [order, ...state.orders],
      }));

      toast.info("Nouvelle commande créée", {
        position: "top-right",
        autoClose: 3000,
      });
    },

    handleOrderUpdated: (updatedOrder: Order) => {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        ),
      }));

      toast.info("Commande mise à jour", {
        position: "top-right",
        autoClose: 2000,
      });
    },

    handleOrderStatusChanged: ({ orderId, status, timestamp }: any) => {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: status as OrderStatus,
                updatedAt: timestamp || new Date().toISOString(),
              }
            : order
        ),
      }));

      const statusLabels: Record<OrderStatus, string> = {
        [OrderStatus.EN_ATTENTE]: "En attente",
        [OrderStatus.ASSIGNEE]: "Assignée",
        [OrderStatus.EN_DISCUSSION]: "En discussion",
        [OrderStatus.PRIX_VALIDE]: "Prix validé",
        [OrderStatus.EN_LIVRAISON]: "En livraison",
        [OrderStatus.LIVREE]: "Livrée",
        [OrderStatus.ECHEC]: "Échec",
      };

      toast.info(
        `Statut changé: ${statusLabels[status as OrderStatus] || status}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    },

    handleOrderDeleted: ({ orderId }: any) => {
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
      }));

      toast.warning("Commande supprimée", {
        position: "top-right",
        autoClose: 3000,
      });
    },

    handlePriceNegotiation: ({ orderId, price, userId, action }: any) => {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? order : order
        ),
      }));

      const actionLabel = action === "propose" ? "proposé" : "accepté";
      toast.info(`Prix ${actionLabel}: ${price} FCFA`, {
        position: "top-right",
        autoClose: 3000,
      });
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
  })
  // {
  //   name: "order-storage",
  //   partialize: (state) => ({
  //     orders: state.orders,
  //     lastFetched: state.lastFetched,
  //   }),
  // }
  // )
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

    // Actions WebSocket
    connectWebSocket: (token: string) => store.connectWebSocket(token),
    disconnectWebSocket: () => store.disconnectWebSocket(),
    sendWebSocketMessage: (message: any) => {
      const { socket, isConnected } = store;
      if (isConnected && socket) {
        socket.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket non connecté");
      }
    },
  };
};

// Hook pour gérer la connexion WebSocket avec l'authentification
export const useWebSocketConnection = () => {
  const { connectWebSocket, disconnectWebSocket } = useOrderActions();

  // Fonction pour établir la connexion
  const connect = (token: string) => {
    connectWebSocket(token);
  };

  // Fonction pour déconnecter
  const disconnect = () => {
    disconnectWebSocket();
  };

  // Hook pour gérer la connexion/déconnexion automatique
  const useAutoConnect = (token?: string) => {
    useEffect(() => {
      if (token) {
        connect(token);

        // Nettoyage à la déconnexion
        return () => {
          disconnect();
        };
      }
    }, [token]);
  };

  return {
    connect,
    disconnect,
    useAutoConnect,
  };
};
