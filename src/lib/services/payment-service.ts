import { api } from "@/lib/api/axios";
import {
  Payment,
  PaymentExportResponse,
} from "@/app/(dashboard)/(admin)/admin/dashboard/paiement/types/payment.type";
import { PaymentMethod, PaymentStatus } from "@/type/enum";

export const paymentService = {
  async getAllPayments(): Promise<Payment[]> {
    const response = await api.get<Payment[]>("/payment");
    return response.data;
  },

  async markAsPaid(paymentId: string): Promise<Payment> {
    const response = await api.patch<Payment>(
      `/payment/${paymentId}/mark-paid`
    );
    return response.data;
  },

  async deletePayment(paymentId: string): Promise<{ message: string }> {
    const response = await api.delete(`/payment/${paymentId}`);
    return response.data;
  },

  async exportPayments(
    format: "csv" | "pdf" = "csv"
  ): Promise<PaymentExportResponse> {
    const response = await api.get<PaymentExportResponse>("/payment/export", {
      params: { format },
    });
    return response.data;
  },

  async getPaymentById(paymentId: string): Promise<Payment> {
    const response = await api.get<Payment>(`/payment/${paymentId}`);
    return response.data;
  },

  async changePaymentStatus(
    paymentId: string,
    method: PaymentMethod,
    status: PaymentStatus
  ): Promise<Payment> {
    const response = await api.patch<Payment>(`/payment/${paymentId}`, {
      method,
      status,
    });
    return response.data;
  },
};
