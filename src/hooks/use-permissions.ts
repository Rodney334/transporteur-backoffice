import { useAuthStore } from "@/lib/stores/auth-store";
import { GrantedRole } from "@/type/enum";

// Définition des permissions par rôle - CORRECTION ICI
const rolePermissions: Record<GrantedRole, string[]> = {
  [GrantedRole.Admin]: [
    "view_dashboard",
    "manage_users",
    "view_reports",
    "manage_orders",
  ],
  [GrantedRole.Livreur]: ["view_orders", "update_status", "view_dashboard"],
  [GrantedRole.Operateur]: ["view_orders", "manage_orders", "view_dashboard"],
  [GrantedRole.Client]: ["view_dashboard", "create_orders", "view_own_orders"],
  [GrantedRole.User]: ["view_dashboard", "create_orders"], // Permissions par défaut
};

// use-permissions.ts
export const usePermissions = () => {
  const { user } = useAuthStore();

  const can = (permission: string): boolean => {
    if (!user?.role) return false;
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  };

  const canAny = (permissions: string[]): boolean => {
    return permissions.some((permission) => can(permission));
  };

  const canAll = (permissions: string[]): boolean => {
    return permissions.every((permission) => can(permission));
  };

  // Nouveaux helpers pour les types d'utilisateurs
  const isAdminUser = ["admin", "livreur", "operateur"].includes(
    user?.role || ""
  );
  const isRegularUser = ["user", "client"].includes(user?.role || "");

  return {
    can,
    canAny,
    canAll,
    currentRole: user?.role,
    isAdminUser,
    isRegularUser,
    // Alias pour plus de clarté
    hasAdminAccess: isAdminUser,
    hasUserAccess: isRegularUser,
  };
};
