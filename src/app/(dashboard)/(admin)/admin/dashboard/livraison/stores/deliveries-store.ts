// lib/stores/deliveries-store.ts
import { create } from "zustand";
import { Order } from "@/type/order.type";

interface DeliveriesStore {
  // États
  selectedDelivery: Order | null;

  // Actions
  setSelectedDelivery: (delivery: Order | null) => void;
  clearSelectedDelivery: () => void;
}

export const useDeliveriesStore = create<DeliveriesStore>((set) => ({
  selectedDelivery: null,

  setSelectedDelivery: (delivery) => set({ selectedDelivery: delivery }),
  clearSelectedDelivery: () => set({ selectedDelivery: null }),
}));
