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
    // if (isAuthenticated) {
    //   refreshAuth().catch(console.error);
    // }

    if (isAuthenticated && !hasRefreshed.current && !isLoading) {
      hasRefreshed.current = true;
      refreshAuth().catch(console.error);
    }

    // Optionnel : Rafraîchir périodiquement (toutes les 30 minutes)
    // const interval = setInterval(() => {
    //   if (isAuthenticated) {
    //     refreshAuth().catch(console.error);
    //   }
    // }, 30 * 60 * 1000); // 30 minutes

    // return () => clearInterval(interval);
  }, [isAuthenticated, isLoading, refreshAuth]);

  return <>{children}</>;
}
