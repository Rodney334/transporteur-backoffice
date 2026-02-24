import { api } from "../api/axios";
import { KPIResponse, AlertsResponse, CoursesResponse, ReportPeriod, SummaryPeriod, CoursesFilters, CoursesPagination, KPISchema, AlertsSchema, CoursesSchema, CourierSummaryResponse } from "@/type/report.type";

export interface Options {
  courierId?: string | null;
  status?: string | null;
  paymentStatus?: string | null;
  page?: number;
  limit?: number;
}

export const reportService = {
  // New methods
  async getKPIs(period: string, date: string) {
    const response = await api.get<KPISchema>("/report/kpis", {
      params: { period, date },
    });
    return response.data;
  },

  async getAlerts(period: string, date: string) {
    const response = await api.get<AlertsSchema>("/report/alerts", {
      params: { period, date },
    });
    return response.data;
  },

  async getCourses(
    period: string,
    date: string,
    options?: Options
  ) {
    const response = await api.get<CoursesSchema>("/report/courses", {
      params: { period, date, ...options },
    });
    return response.data;
  },

  // Existing methods
  async all() {
    const response = await api.post("report/couriers/summary/all", {});
    return response.data;
  },

  async daily() {
    const response = await api.post("report/couriers/summary/daily", {});
    return response.data;
  },

  async weekly() {
    const response = await api.post("report/couriers/summary/week", {});
    return response.data;
  },

  async monthly() {
    const response = await api.post("report/couriers/summary/month", {});
    return response.data;
  },

  async currentUser() {
    const response = await api.post("report/history/me", {});
    return response.data;
  },

  async getCouriersSummary(period: string, date: string) {
    const response = await api.get<CourierSummaryResponse>("/report/couriers/summary/json", {
      params: { period, date },
    });
    return response.data;
  },
};
