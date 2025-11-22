// Protected-route.tsx
"use client";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { LoadingFullPage, LoadingSpinner, LoadingDots } from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: "user" | "admin"; // Optionnel : restriction spécifique
}

function ProtectedRouteContent({
  children,
  fallback = <LoadingDots />,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { currentRole } = usePermissions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirection vers login si non authentifié
      const loginUrl = redirect
        ? `/login?redirect=${encodeURIComponent(redirect)}`
        : "/login";
      router.push(loginUrl);
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      // Déterminer la redirection basée sur le rôle
      const isUserRole = user.role === "user" || user.role === "client";
      const isAdminRole = ["admin", "livreur", "operateur"].includes(user.role);

      const currentPath = window.location.pathname;

      // Redirection si l'utilisateur n'est pas dans le bon espace
      if (isUserRole && currentPath.startsWith("/admin")) {
        router.push("/user/dashboard");
      } else if (isAdminRole && currentPath.startsWith("/user")) {
        router.push("/admin/dashboard");
      }

      // Vérification du rôle requis spécifique
      if (requiredRole === "admin" && isUserRole) {
        router.push("/user/dashboard");
      } else if (requiredRole === "user" && isAdminRole) {
        router.push("/admin/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirect, requiredRole]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Vérification optionnelle du rôle spécifique
  if (requiredRole && user) {
    const isUserRole = user.role === "user" || user.role === "client";
    const isAdminRole = ["admin", "livreur", "operateur"].includes(user.role);

    if (requiredRole === "admin" && !isAdminRole) {
      return null;
    }
    if (requiredRole === "user" && !isUserRole) {
      return null;
    }
  }

  return <>{children}</>;
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  return (
    <Suspense fallback={props.fallback || <LoadingDots />}>
      <ProtectedRouteContent {...props} />
    </Suspense>
  );
}
