import { FormattedDeliveryCard } from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager.types";

export type HistoriqueDataType = {
  id: string;
  from: string;
  to: string;
  status: string;
  date: string;
};

export interface DeliveryCardInterface {
  item: FormattedDeliveryCard;
  type: string;
}
