// app/(dashboard)/admin/dashboard/page.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { OrdersManager } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager";
import { CommandCard } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/CommandCard";
import { getAdminConfig } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager.utils";
import { GrantedRole } from "@/type/enum";

export default function CommandePage() {
  const { user } = useAuth();
  const adminConfig = getAdminConfig();

  return (
    <OrdersManager
      userRole={user?.role || GrantedRole.Admin}
      tabs={["Nouvelles", "En cours", "Terminées"]}
      defaultTab="Nouvelles"
      cardComponent={CommandCard}
      shouldShowPriceForm={adminConfig.shouldShowPriceForm}
      formatOrder={adminConfig.formatOrder}
      filterOrders={adminConfig.filterOrders}
      getEmptyMessage={adminConfig.getEmptyMessage}
      onAcceptOrder={adminConfig.onAcceptOrder}
      onRejectOrder={adminConfig.onRejectOrder}
      onEndOrder={adminConfig.onEndOrder}
      onValidatePrice={adminConfig.onValidatePrice}
      headerTitle="Gestion des Commandes"
      showHeaderCounter={false}
      customHeader={
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Commandes
            {user?.role === GrantedRole.Livreur && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                (qui vous sont assignées)
              </span>
            )}
          </h1>
        </div>
      }
    />
  );
}
