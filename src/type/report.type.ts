
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

export interface CourierPerf {
    rank: number;
    totalAmount: number;
    courses: number;
    successRate: number;
    prevTotalAmount: number;
    prevCourses: number;
    prevSuccessRate: number;
    deltaAmount: number;
    deltaAmountPct: number | null;
    deltaCourses: number;
    deltaCoursesPct: number | null;
    deltaSuccessRatePts: number;
}

export interface CourierCourseItem extends CourseItem {
    clientId: string;
    clientName: string;
    orderNumber: string;
    fromCity: string;
    toCity: string;
    courierPerf: CourierPerf;
}

export interface CourierSummaryItem {
    courierId: string;
    courierName: string;
    totals: {
        courses: number;
        delivered: number;
        failed: number;
        totalAmount: number;
        successRate: number;
        paid: number;
        pending: number;
        failedPayments: number;
        promoCount: number;
        promoDiscountTotal: number;
    };
    courses: CourierCourseItem[];
}

export interface ClientSummaryItem {
    clientId: string;
    clientName: string;
    orders: number;
    delivered: number;
    revenue: number;
}

export interface CourierSummaryResponse {
    period: string;
    isoDate: string;
    dateKey: string;
    previousIsoDate: string;
    kpis: KPISchema;
    leaderboard: {
        totals: {
            current: number;
            previous: number;
            delta: number;
            deltaPct: number | null;
        };
        couriers: {
            courierId: string;
            courierName: string;
            current: {
                totalAmount: number;
                courses: number;
                successRate: number;
                unpaidCount: number;
                unpaidAmount: number;
                rank: number;
            };
            previous: any | null;
            delta: {
                totalAmount: number;
                totalAmountPct: number | null;
                courses: number;
                coursesPct: number | null;
                successRate: number;
                unpaidAmount: number;
                unpaidAmountPct: number | null;
            };
        }[];
    };
    payments: {
        paid: number;
        pending: number;
        failed: number;
        deliveredNotPaidCount: number;
        deliveredNotPaidAmount: number;
    };
    promo: {
        usedCount: number;
        discountTotal: number;
        topCodes: { code: string; count: number; totalDiscount: number }[];
    };
    top: {
        couriersByRevenue: any[];
        couriersByOrders: any[];
    };
    clients: {
        topByRevenue: ClientSummaryItem[];
        topByOrders: ClientSummaryItem[];
    };
    couriers: CourierSummaryItem[];
    courses: CourierCourseItem[];
}
