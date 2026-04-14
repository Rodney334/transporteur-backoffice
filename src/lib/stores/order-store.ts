// stores/order-store.ts
import { create } from "zustand";
import { Order } from "@/type/order.type";
import { GrantedRole, OrderStatus, PaymentMethod } from "@/type/enum";
import { orderService } from "@/lib/services/order-service";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useAuthStore } from "./auth-store";
import { notificationQueue } from "@/utils/notification-queue";
import { useNotificationStore } from "./notification-store";
import { User } from "@/type/user.type";

interface OrderStore {
  // État
  orders: Order[];
  loading: boolean;
  error: string | null;
  socket: WebSocket | null;
  isConnected: boolean;
  // Set des IDs de messages WS déjà traités (déduplication)
  _processedWsKeys: Set<string>;

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

  // Nettoyage
  clearOrders: () => void;

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
// const WS_BASE_URL = "wss://letransporteur-production.up.railway.app/"; //"wss://backend.letrans-porteur.com/"; // "wss://letransporteur-production.up.railway.app/";
const WS_BASE_URL = "wss://backend.letrans-porteur.com/"; // "wss://letransporteur-production.up.railway.app/";

export const useOrderStore = create<OrderStore>()(
  // persist(
  (set, get) => ({
    // État initial
    orders: [],
    loading: false,
    error: null,
    socket: null,
    isConnected: false,
    _processedWsKeys: new Set<string>(),

    // Actions de base
    setOrders: (orders) => set({ orders }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSocket: (socket) => set({ socket }),
    setIsConnected: (isConnected) => set({ isConnected }),

    // Charger les commandes (sans cache — état temps réel)
    fetchOrders: async (userId?: string, userRole?: string) => {
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
        toast.success("Temps réel activé", {
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

        // ── Déduplication ──────────────────────────────────────────────────
        // Clé format event_orderId_tsRounded (cohérent entre WS et FCM)
        const orderId = payload?.orderId || payload?.id || "";
        const tsRounded = Math.floor(Date.now() / 3000); // fenêtre de 3s
        const dedupKey = orderId
          ? `order_event_${orderId}_${tsRounded}`
          : `generic_event_${type}_${tsRounded}`;

        const { _processedWsKeys } = get();
        if (_processedWsKeys.has(dedupKey)) {
          console.log("WebSocket message dupliqué ignoré:", dedupKey);
          return;
        }
        // Ajouter la clé et l'expirer après 5s
        _processedWsKeys.add(dedupKey);
        setTimeout(() => _processedWsKeys.delete(dedupKey), 5000);
        // ──────────────────────────────────────────────────────────────────

        // Afficher le toast via la queue
        const toastMessage = payload?.message || "Nouvelle notification";
        notificationQueue.enqueueToast(
          toastMessage,
          {
            position: "top-right",
            autoClose: 5000,
          },
          dedupKey,
        );

        // Rafraîchir les données
        const authStore = useAuthStore.getState();
        const { user } = authStore;

        const notifStore = useNotificationStore.getState();
        const { fetchNotifications } = notifStore;

        const { fetchOrders } = get();
        if (user?._id && user?.role) {
          fetchOrders(user._id, user.role);
        } else {
          fetchOrders();
        }
        fetchNotifications();
      } catch (error) {
        console.log("Erreur parsing WebSocket message:", error);
      }
    },

    // Gestion des événements spécifiques
    handleOrderCreated: (order: Order) => {
      set((state) => ({
        orders: [order, ...state.orders],
      }));

      notificationQueue.enqueueToast(
        "Nouvelle commande créée",
        {
          position: "top-right",
          autoClose: 3000,
        },
        `manual_created_${order.id}`,
      );
    },

    handleOrderUpdated: (updatedOrder: Order) => {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      }));

      notificationQueue.enqueueToast(
        "Commande mise à jour",
        {
          position: "top-right",
          autoClose: 2000,
        },
        `manual_updated_${updatedOrder.id}`,
      );
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
            : order,
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
        [OrderStatus.CONFLIT]: "En conflit",
        [OrderStatus.ANNULEE_PAR_CLIENT]: "Annulée par le client",
        [OrderStatus.ANNULEE_PAR_LIVREUR]: "Annulée par le livreur",
      };

      notificationQueue.enqueueToast(
        `Statut changé: ${statusLabels[status as OrderStatus] || status}`,
        {
          position: "top-right",
          autoClose: 3000,
        },
        `manual_status_${orderId}_${status}`,
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
          order.id === orderId ? order : order,
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
          order.id === orderId ? { ...order, ...updates } : order,
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
      set({ orders: [] });
    },

    // Sélecteurs
    getOrderById: (orderId: string) => {
      return get().orders.find((order) => order.id === orderId);
    },

    getOrdersByStatus: (statuses: OrderStatus[]) => {
      return get().orders.filter((order) =>
        statuses.includes(order.status as OrderStatus),
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
        Programmées: [OrderStatus.EN_ATTENTE],
        Terminées: [OrderStatus.LIVREE],
        Échouées: [
          OrderStatus.ECHEC,
          OrderStatus.ANNULEE_PAR_LIVREUR,
          OrderStatus.ANNULEE_PAR_CLIENT,
        ],
        "En conflit": [OrderStatus.CONFLIT],
      };

      const clientStatusMapping: Record<string, OrderStatus[]> = {
        "En cours": [
          OrderStatus.EN_ATTENTE,
          OrderStatus.ASSIGNEE,
          OrderStatus.EN_DISCUSSION,
          OrderStatus.PRIX_VALIDE,
          OrderStatus.EN_LIVRAISON,
        ],
        Terminées: [OrderStatus.LIVREE],
        Échouées: [
          OrderStatus.ECHEC,
          OrderStatus.ANNULEE_PAR_LIVREUR,
          OrderStatus.ANNULEE_PAR_CLIENT,
        ],
        "En conflit": [OrderStatus.CONFLIT],
      };

      const statuses =
        userRole === "client"
          ? clientStatusMapping[tab] || []
          : statusMapping[tab] || [];

      const now = new Date();

      return orders.filter((order) => {
        const isInStatus = statuses.includes(order.status as OrderStatus);
        if (!isInStatus) return false;

        // Logique spécifique pour les commandes programmées
        if (userRole !== "client") {
          if (tab === "Nouvelles") {
            // Dans "Nouvelles", on ne veut pas les commandes programmées dans le futur
            if (order.isScheduled && order.scheduledAt) {
              const scheduledDate = new Date(order.scheduledAt);
              if (scheduledDate > now) return false;
            }
          } else if (tab === "Programmées") {
            // Dans "Programmées", on ne veut QUE les commandes programmées dans le futur
            if (!order.isScheduled || !order.scheduledAt) return false;
            const scheduledDate = new Date(order.scheduledAt);
            const [date, time] = order.scheduledAt.split("T");
            const [hour, minute] = time.split(":");
            scheduledDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
            if (scheduledDate <= now) return false;
          }
        }

        // Filtres de visibilité (hiddenForClient / hiddenForCourier)
        if (userRole === "client" && order.hiddenForClient) return false;
        if (userRole === "livreur" && order.hiddenForCourier) return false;

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

    validatePrice: async (
      orderId: string,
      price: number,
      method?: string,
      userRole?: GrantedRole,
    ) => {
      try {
        if (userRole === "admin") {
          const methode = method || PaymentMethod.CASH;
          await orderService.adminValidatePrice(orderId, price, methode);
        } else {
          if (method) {
            await orderService.clientValidatePrice(orderId, price, method);
          } else {
            await orderService.validatePrice(orderId, price);
          }
        }

        // Recharger pour obtenir les données de négociation à jour
        await store.fetchOrders();
      } catch (err) {
        throw err;
      }
    },

    cancelOrder: async (orderId: string) => {
      try {
        await orderService.deleteOrder(orderId);
        store.removeOrder(orderId);
      } catch (err) {
        throw err;
      }
    },

    cancelOrderByCourier: async (orderId: string, reason: string) => {
      try {
        await orderService.cancelOrderByCourier(orderId, reason);
        // On pourrait juste mettre à jour le statut ou recharger
        await store.fetchOrders();
      } catch (err) {
        throw err;
      }
    },

    cancelOrderByClient: async (orderId: string, reason: string) => {
      try {
        await orderService.cancelOrderByClient(orderId, reason);
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
