// components/WebSocketProvider.tsx
"use client";

import { useEffect } from "react";
import { useWebSocketConnection } from "@/lib/stores/order-store";
import { useAuth } from "@/hooks/use-auth";

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, accessToken } = useAuth();
  const { useAutoConnect } = useWebSocketConnection();

  useAutoConnect(accessToken || "");

  useEffect(() => {
    if (accessToken) {
      console.log("Token utilisateur disponible, connexion WebSocket...");
    } else {
      console.log("Aucun token utilisateur, WebSocket non connecté");
    }
  }, [accessToken]);

  return <>{children}</>;
};
