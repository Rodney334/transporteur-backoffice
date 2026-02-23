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
  maxDiscount?: number | null;
  minOrderAmount?: number;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  constraints?: PromoConstraints | null;
  channel: PromoChannel;
  isActive: boolean;
}

export interface UpdatePromoDto {
  code?: string;
  type?: PromoType;
  value?: number;
  maxDiscount?: number | null;
  minOrderAmount?: number;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  constraints?: PromoConstraints | null;
  channel?: PromoChannel;
  isActive?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  codePrefix: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerDto {
  name: string;
  codePrefix: string;
  isActive: boolean;
}

export interface UpdatePartnerDto {
  name?: string;
  codePrefix?: string;
  isActive?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface UpdateCampaignDto {
  name?: string;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
}

export interface BatchPromoDto {
  campaignId: string;
  count: number;
  type: PromoType;
  value: number;
  maxDiscount: number;
  minOrderAmount: number;
  usageLimit: number;
  usageLimitPerUser: number;
  startsAt: string;
  endsAt: string;
  channel: string;
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
