// app/(dashboard)/admin/dashboard/page.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { OrdersManager } from "@/app/(dashboard)/components/OrdersManager/OrdersManager";
import { CommandCard } from "@/app/(dashboard)/components/OrdersManager/CommandCard";
import { getAdminConfig } from "@/app/(dashboard)/components/OrdersManager/OrdersManager.utils";
import { GrantedRole } from "@/type/enum";

export default function AdminPage() {
  const { user } = useAuth();
  const adminConfig = getAdminConfig();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Administration</h1>
      <p>Interface d'administration réservée aux administrateurs.</p>
    </div>
  );
}
