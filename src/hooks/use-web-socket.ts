// hooks/use-web-socket.ts
import { useOrderStore } from "@/lib/stores/order-store";

export const useWebSocket = () => {
  const {
    socket,
    isConnected,
    connectWebSocket,
    disconnectWebSocket,
    handleWebSocketMessage,
  } = useOrderStore();

  // Fonction pour envoyer un message
  const sendMessage = (type: string, payload: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn("WebSocket non connecté");
    }
  };

  // S'abonner à un type d'événement
  const subscribe = (eventType: string, callback: (data: any) => void) => {
    if (!socket) return;

    const messageHandler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === eventType) {
          callback(data.payload);
        }
      } catch (error) {
        console.error("Erreur parsing message:", error);
      }
    };

    socket.addEventListener("message", messageHandler);

    // Fonction de nettoyage
    return () => {
      socket.removeEventListener("message", messageHandler);
    };
  };

  return {
    isConnected,
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
    sendMessage,
    subscribe,
  };
};
