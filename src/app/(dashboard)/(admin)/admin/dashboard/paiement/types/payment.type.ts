import { Order } from "@/type/order.type";
import { User } from "@/type/user.type";
import { PaymentMethod, PaymentStatus } from "@/type/enum";

export interface Payment {
  id: string;
  order: Order;
  client: User;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentExportResponse {
  csvUrl?: string;
  pdfUrl?: string;
  message?: string;
}
