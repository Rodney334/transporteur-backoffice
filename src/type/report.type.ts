
export enum SummaryPeriod {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
}

export type ReportPeriod = SummaryPeriod;

export interface KPISchema {
    period: ReportPeriod;
    dateKey: string;
    ordersTotal: number;
    delivered: number;
    failed: number;
    successRate: number;
    revenueDelivered: number;
    revenuePaid: number;
    revenuePending: number;
    revenueFailed: number;
    deliveredNotPaidCount: number;
    deliveredNotPaidAmount: number;
    topToCities: { city: string; delivered: number; failed: number }[];
    topRoutes: { route: string; delivered: number; failed: number }[];

    promoUsedCount: number;
    promoDiscountTotal: number;
    start: string;
    end: string;
}

export interface KPIResponse {
    description: string;
    schema: KPISchema;
}

export interface AlertItem {
    type: 'DELIVERED_NOT_PAID' | 'UNASSIGNED_ORDER' | string;
    orderId: string;
    at: string;
    details?: {
        paymentStatus?: string;
        paymentAmount?: number;
        [key: string]: any;
    };
}

export interface AlertsSchema {
    period: ReportPeriod;
    date: string;
    count: number;
    alerts: AlertItem[];
}

export interface AlertsResponse {
    description: string;
    schema: AlertsSchema;
}

export interface CourseItem {
    courierId: string;
    courierName: string;
    orderId: string;
    changedAt: string;
    status: string;
    paymentStatus: string;
    paymentAmount: number;
    amount: number;
    fromCity: string;
    toCity: string;
    promoUsed?: boolean;
    promoCodeId?: string | null;
    promoCodeText?: string | null;
    discountAmount?: number;
    basePriceBeforeDiscount?: number | null;
    promoErrorMessage?: string | null;
}

export interface CoursesFilters {
    courierId?: string | null;
    status?: string | null;
    paymentStatus?: string | null;
}

export interface CoursesPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface CoursesSchema {
    period: ReportPeriod;
    date: string;
    filters: CoursesFilters;
    pagination: CoursesPagination;
    items: CourseItem[];
}

export interface CoursesResponse {
    description: string;
    schema: CoursesSchema;
}
