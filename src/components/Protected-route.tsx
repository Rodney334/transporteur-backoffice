// Protected-route.tsx - VERSION AMÉLIORÉE
"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { LoadingFullPage, LoadingSpinner, LoadingDots } from "./Loading";
import { GrantedRole } from "@/type/enum";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: GrantedRole | GrantedRole[]; // Peut être un rôle unique ou un tableau
  allowedRoles?: GrantedRole[]; // Rôles autorisés pour cette route
}

function ProtectedRouteContent({
  children,
  fallback = <LoadingDots />,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { currentRole } = usePermissions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  // Définir les espaces par rôle
  const adminSpaceRoles = [
    GrantedRole.Admin,
    GrantedRole.Operateur,
    GrantedRole.Livreur,
  ];

  const userSpaceRoles = [GrantedRole.Client, GrantedRole.User];

  // Déterminer si un utilisateur a accès à l'espace admin
  const isAdminSpaceUser =
    user?.role && adminSpaceRoles.includes(user.role as GrantedRole);

  // Déterminer si un utilisateur a accès à l'espace user
  const isUserSpaceUser =
    user?.role && userSpaceRoles.includes(user.role as GrantedRole);

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
      const currentPath = window.location.pathname;
      const isAdminPath = currentPath.startsWith("/admin");
      const isUserPath = currentPath.startsWith("/user");

      // Redirection basée sur l'espace (admin/user)
      if (isAdminSpaceUser && isUserPath) {
        // Utilisateur admin dans espace user → rediriger vers admin
        router.push("/admin/dashboard");
        return;
      }

      if (isUserSpaceUser && isAdminPath) {
        // Utilisateur client dans espace admin → rediriger vers user
        router.push("/user/dashboard");
        return;
      }

      // Vérification des rôles spécifiques pour la route
      if (allowedRoles && user.role) {
        const userRole = user.role as GrantedRole;
        if (!allowedRoles.includes(userRole)) {
          // Accès non autorisé → rediriger vers l'espace approprié
          if (isAdminSpaceUser) {
            router.push("/admin/dashboard");
          } else if (isUserSpaceUser) {
            router.push("/user/dashboard");
          } else {
            router.push("/login");
          }
          return;
        }
      }

      // Vérification du rôle requis (déprécié, utiliser allowedRoles)
      if (requiredRole) {
        const requiredRolesArray = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];

        if (
          user.role &&
          !requiredRolesArray.includes(user.role as GrantedRole)
        ) {
          // Rôle requis non satisfait
          if (isAdminSpaceUser) {
            router.push("/admin/dashboard");
          } else if (isUserSpaceUser) {
            router.push("/user/dashboard");
          } else {
            router.push("/login");
          }
          return;
        }
      }

      // Redirection par défaut pour les admins/opérateurs/livreurs
      if (isAdminSpaceUser && currentPath === "/admin") {
        // Rediriger vers le dashboard admin par défaut
        router.push("/admin/dashboard");
        return;
      }

      // Redirection par défaut pour les clients
      if (isUserSpaceUser && currentPath === "/user") {
        router.push("/user/dashboard");
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    router,
    redirect,
    requiredRole,
    allowedRoles,
    isAdminSpaceUser,
    isUserSpaceUser,
  ]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Vérification finale des permissions
  if (user) {
    const userRole = user.role as GrantedRole;

    // Vérification avec allowedRoles (prioritaire)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Accès Refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à cette
              page. Votre rôle actuel :{" "}
              <span className="font-medium capitalize">{userRole}</span>
            </p>
            <button
              onClick={() => {
                if (isAdminSpaceUser) {
                  router.push("/admin/dashboard");
                } else if (isUserSpaceUser) {
                  router.push("/user/dashboard");
                } else {
                  router.push("/login");
                }
              }}
              className="px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      );
    }

    // Vérification avec requiredRole (rétrocompatibilité)
    if (requiredRole) {
      const requiredRolesArray = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];

      if (!requiredRolesArray.includes(userRole)) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Accès Restreint
              </h2>
              <p className="text-gray-600 mb-6">
                Cette page nécessite un rôle spécifique. Votre rôle actuel :{" "}
                <span className="font-medium capitalize">{userRole}</span>
              </p>
              <button
                onClick={() => {
                  if (isAdminSpaceUser) {
                    router.push("/admin/dashboard");
                  } else if (isUserSpaceUser) {
                    router.push("/user/dashboard");
                  } else {
                    router.push("/login");
                  }
                }}
                className="px-6 py-3 bg-[#FD481A] text-white font-medium rounded-xl hover:bg-[#E63F15] transition-colors"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        );
      }
    }

    // Vérification de l'espace approprié
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    const isAdminPath = currentPath.startsWith("/admin");
    const isUserPath = currentPath.startsWith("/user");

    if (isAdminPath && !isAdminSpaceUser) {
      return null; // Déjà géré par useEffect
    }

    if (isUserPath && !isUserSpaceUser) {
      return null; // Déjà géré par useEffect
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

// // Protected-route.tsx
// "use client";
// import { useAuth } from "@/hooks/use-auth";
// import { usePermissions } from "@/hooks/use-permissions";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useEffect } from "react";
// import { LoadingFullPage, LoadingSpinner, LoadingDots } from "./Loading";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   fallback?: React.ReactNode;
//   requiredRole?: "user" | "admin"; // Optionnel : restriction spécifique
// }

// function ProtectedRouteContent({
//   children,
//   fallback = <LoadingDots />,
//   requiredRole,
// }: ProtectedRouteProps) {
//   const { isAuthenticated, isLoading, user } = useAuth();
//   const { currentRole } = usePermissions();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirect = searchParams.get("redirect");

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       // Redirection vers login si non authentifié
//       const loginUrl = redirect
//         ? `/login?redirect=${encodeURIComponent(redirect)}`
//         : "/login";
//       router.push(loginUrl);
//       return;
//     }

//     if (!isLoading && isAuthenticated && user) {
//       // Déterminer la redirection basée sur le rôle
//       const isUserRole = user.role === "user" || user.role === "client";
//       const isAdminRole = ["admin", "livreur", "operateur"].includes(user.role);

//       const currentPath = window.location.pathname;

//       // Redirection si l'utilisateur n'est pas dans le bon espace
//       if (isUserRole && currentPath.startsWith("/admin")) {
//         router.push("/user/dashboard");
//       } else if (isAdminRole && currentPath.startsWith("/user")) {
//         router.push("/admin/dashboard");
//       }

//       // Vérification du rôle requis spécifique
//       if (requiredRole === "admin" && isUserRole) {
//         router.push("/user/dashboard");
//       } else if (requiredRole === "user" && isAdminRole) {
//         router.push("/admin/dashboard");
//       }
//     }
//   }, [isAuthenticated, isLoading, user, router, redirect, requiredRole]);

//   if (isLoading) {
//     return <>{fallback}</>;
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

//   // Vérification optionnelle du rôle spécifique
//   if (requiredRole && user) {
//     const isUserRole = user.role === "user" || user.role === "client";
//     const isAdminRole = ["admin", "livreur", "operateur"].includes(user.role);

//     if (requiredRole === "admin" && !isAdminRole) {
//       return null;
//     }
//     if (requiredRole === "user" && !isUserRole) {
//       return null;
//     }
//   }

//   return <>{children}</>;
// }

// export default function ProtectedRoute(props: ProtectedRouteProps) {
//   return (
//     <Suspense fallback={props.fallback || <LoadingDots />}>
//       <ProtectedRouteContent {...props} />
//     </Suspense>
//   );
// }
