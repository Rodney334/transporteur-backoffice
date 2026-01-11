// types/report.ts
import { OrderStatus } from "@/type/enum";

export interface DailyData {
  date: string;
  total: number;
  count: number;
}

export interface WeeklyData {
  week: string;
  total: number;
  count: number;
}

export interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export interface ClientReport {
  type: "client";
  id: string;
  totalAmount: number;
  totalCourses: number;
  courses: Course[];
  perDay: DailyData[];
  perWeek: WeeklyData[];
  perMonth: MonthlyData[];
  bestCity: string;
  worstCity: string;
  bestRoute: string;
}

export interface Course {
  orderId: string;
  date: string;
  fromCity: string;
  toCity: string;
  amount: number;
  status: OrderStatus;
  courierId: string;
  isSuccess: boolean;
  isFailed: boolean;
}

export interface PeriodData {
  date?: string;
  week?: string;
  month?: string;
  total: number;
  count: number;
}

export interface CourseStats {
  totalCourses: number;
  successfulCourses: number;
  failedCourses: number;
  pendingCourses: number;
  successRate: number;
  totalRevenue: number;
  averageRevenuePerCourse: number;
}

export interface CityStats {
  bestCity: string;
  bestClient?: string;
  worstCity: string;
  bestRoute: string;
  mostFrequentFromCity: string;
  mostFrequentToCity: string;
  totalCities: number;
}

export interface ExportOptions {
  format: "pdf" | "csv";
  includeCourses: boolean;
  includeCharts: boolean;
  includeStats: boolean;
}
