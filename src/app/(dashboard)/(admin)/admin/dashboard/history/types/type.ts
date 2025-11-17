export type HistoriqueDataType = {
  id: string;
  from: string;
  to: string;
  status: string;
  date: string;
};

export interface DeliveryCardInterface {
  item: HistoriqueDataType;
  type: string;
}
