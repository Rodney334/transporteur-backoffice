"use client";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refreshAuth, isAuthenticated, isLoading } = useAuth();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Rafraîchir le token au chargement de l'application si authentifié
    if (isAuthenticated && !hasRefreshed.current && !isLoading) {
      hasRefreshed.current = true;
      refreshAuth().catch(console.error);
    }
  }, [isAuthenticated, isLoading, refreshAuth]);

  return <>{children}</>;
}
