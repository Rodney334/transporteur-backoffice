// types/promo.type.ts
export type PromoType = "PERCENT" | "FIXED";
export type PromoChannel = "PUBLIC" | "PRIVATE";

export interface PromoConstraints {
  maxDiscount?: number;
  minOrderAmount?: number;
  firstTimeOnly?: boolean;
  applicableServices?: string[];
  applicableZones?: string[];
}

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  maxDiscount: number | null;
  minOrderAmount: number;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  startsAt: string | null;
  endsAt: string | null;
  constraints: PromoConstraints | null;
  isActive: boolean;
  companyId: string | null;
  campaignId: string | null;
  assignedUserId: string | null;
  channel: PromoChannel;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromoDto {
  code: string;
  type: PromoType;
  value: number;
}

export interface UpdatePromoDto {
  code?: string;
  type?: PromoType;
  value?: number;
}

export interface PromoExportData {
  id: string;
  code: string;
  type: string;
  value: string;
  isActive: string;
  usageLimit: string;
  usageLimitPerUser: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  channel: string;
  companyId: string;
  campaignId: string;
  assignedUserId: string;
  minOrderAmount: string;
  maxDiscount: string;
  constraints: string;
}
