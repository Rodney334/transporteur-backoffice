import { create } from "zustand";
import { Payment } from "../types/payment.type";

interface PaymentStore {
  // États
  payments: Payment[];
  selectedPayment: Payment | null;
  loading: boolean;
  error: string | null;

  // Actions
  setPayments: (payments: Payment[]) => void;
  setSelectedPayment: (payment: Payment | null) => void;
  clearSelectedPayment: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions pour mettre à jour un paiement dans la liste
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  removePayment: (paymentId: string) => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  selectedPayment: null,
  loading: false,
  error: null,

  setPayments: (payments) => set({ payments }),
  setSelectedPayment: (payment) => set({ selectedPayment: payment }),
  clearSelectedPayment: () => set({ selectedPayment: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  updatePayment: (paymentId, updates) =>
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === paymentId ? { ...payment, ...updates } : payment
      ),
    })),

  removePayment: (paymentId) =>
    set((state) => ({
      payments: state.payments.filter((payment) => payment.id !== paymentId),
    })),
}));
