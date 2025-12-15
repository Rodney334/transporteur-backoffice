// app/(dashboard)/client/historique/page.tsx - VERSION SIMPLIFIÉE
"use client";

import { OrdersManager } from "@/app/(dashboard)/components/OrdersManager/OrdersManager";
import { DeliveryCard } from "@/app/(dashboard)/components/OrdersManager//DeliveryCard";
import { getClientConfig } from "@/app/(dashboard)/components/OrdersManager/OrdersManager.utils";
import { GrantedRole } from "@/type/enum";

export default function HistoriquePage() {
  const clientConfig = getClientConfig();

  return (
    <OrdersManager
      userRole={GrantedRole.Client} // Ou le rôle approprié pour le client
      tabs={["En cours", "Terminées"]}
      defaultTab="En cours"
      cardComponent={DeliveryCard}
      shouldShowPriceForm={clientConfig.shouldShowPriceForm}
      formatOrder={clientConfig.formatOrder}
      filterOrders={clientConfig.filterOrders}
      getEmptyMessage={clientConfig.getEmptyMessage}
      onValidatePrice={clientConfig.onValidatePrice}
      headerTitle="Mes Commandes"
      showHeaderCounter={true}
    />
  );
}
